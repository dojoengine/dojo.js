import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
    Draft,
    Patch,
    WritableDraft,
    applyPatches,
    produceWithPatches,
} from "immer";

import { enablePatches } from "immer";
import { subscribeWithSelector } from "zustand/middleware";
import { ParsedEntity, SchemaType } from "../types";

enablePatches();

interface PendingTransaction {
    transactionId: string;
    patches: Patch[];
    inversePatches: Patch[];
}

interface GameState<T extends SchemaType> {
    entities: Record<string, ParsedEntity<T>>;
    pendingTransactions: Record<string, PendingTransaction>;
    setEntities: (entities: ParsedEntity<T>[]) => void;
    updateEntity: (entity: Partial<ParsedEntity<T>>) => void;
    applyOptimisticUpdate: (
        transactionId: string,
        updateFn: (draft: Draft<GameState<T>>) => void
    ) => void;
    revertOptimisticUpdate: (transactionId: string) => void;
    confirmTransaction: (transactionId: string) => void;
    subscribeToEntity: (
        entityId: string,
        listener: (entity: ParsedEntity<T> | undefined) => void
    ) => () => void;
    waitForEntityChange: (
        entityId: string,
        predicate: (entity: ParsedEntity<T> | undefined) => boolean,
        timeout?: number
    ) => Promise<ParsedEntity<T> | undefined>;
}

/**
 * Factory function to create a Zustand store based on a given SchemaType.
 *
 * @template T - The schema type.
 * @returns A Zustand hook tailored to the provided schema.
 */
export function createDojoStore<T extends SchemaType>() {
    const useStore = create<GameState<T>>()(
        subscribeWithSelector(
            immer((set, get) => ({
                entities: {},
                pendingTransactions: {},
                setEntities: (entities: ParsedEntity<T>[]) => {
                    set((state: Draft<GameState<T>>) => {
                        entities.forEach((entity) => {
                            state.entities[entity.entityId] =
                                entity as WritableDraft<ParsedEntity<T>>;
                        });
                    });
                },
                updateEntity: (entity: Partial<ParsedEntity<T>>) => {
                    set((state: Draft<GameState<T>>) => {
                        if (
                            entity.entityId &&
                            state.entities[entity.entityId]
                        ) {
                            Object.assign(
                                state.entities[entity.entityId],
                                entity
                            );
                        }
                    });
                },
                applyOptimisticUpdate: (transactionId, updateFn) => {
                    const currentState = get();
                    const [nextState, patches, inversePatches] =
                        produceWithPatches(
                            currentState,
                            (draftState: Draft<GameState<T>>) => {
                                updateFn(draftState);
                            }
                        );

                    set(() => nextState);

                    set((state: Draft<GameState<T>>) => {
                        state.pendingTransactions[transactionId] = {
                            transactionId,
                            patches,
                            inversePatches,
                        };
                    });
                },
                revertOptimisticUpdate: (transactionId) => {
                    const transaction =
                        get().pendingTransactions[transactionId];
                    if (transaction) {
                        set((state: Draft<GameState<T>>) =>
                            applyPatches(state, transaction.inversePatches)
                        );
                        set((state: Draft<GameState<T>>) => {
                            delete state.pendingTransactions[transactionId];
                        });
                    }
                },
                confirmTransaction: (transactionId) => {
                    set((state: Draft<GameState<T>>) => {
                        delete state.pendingTransactions[transactionId];
                    });
                },
                subscribeToEntity: (entityId, listener): (() => void) => {
                    return useStore.subscribe((state) => {
                        const entity = state.entities[entityId];
                        listener(entity);
                    });
                },
                waitForEntityChange: (entityId, predicate, timeout = 6000) => {
                    return new Promise<ParsedEntity<T> | undefined>(
                        (resolve, reject) => {
                            const unsubscribe = useStore.subscribe(
                                (state) => state.entities[entityId],
                                (entity) => {
                                    if (predicate(entity)) {
                                        clearTimeout(timer);
                                        unsubscribe();
                                        resolve(entity);
                                    }
                                }
                            );

                            const timer = setTimeout(() => {
                                unsubscribe();
                                reject(
                                    new Error(
                                        `waitForEntityChange: Timeout of ${timeout}ms exceeded`
                                    )
                                );
                            }, timeout);
                        }
                    );
                },
            }))
        )
    );

    return useStore;
}
