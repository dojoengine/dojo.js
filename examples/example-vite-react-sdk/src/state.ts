import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Draft, Patch, applyPatches, produceWithPatches } from "immer";
import { ParsedEntity } from "@dojoengine/sdk";
import { Schema } from "./bindings";

import { enablePatches } from "immer";
enablePatches();

interface PendingTransaction {
    transactionId: string;
    patches: Patch[];
    inversePatches: Patch[];
}

interface GameState {
    entities: Record<string, ParsedEntity<Schema>>;
    pendingTransactions: Record<string, PendingTransaction>;
    setEntities: (entities: ParsedEntity<Schema>[]) => void;
    updateEntity: (entity: ParsedEntity<Schema>) => void;
    applyOptimisticUpdate: (
        transactionId: string,
        updateFn: (draft: Draft<GameState>) => void
    ) => void;
    revertOptimisticUpdate: (transactionId: string) => void;
    confirmTransaction: (transactionId: string) => void;
    subscribeToEntity: (
        entityId: string,
        listener: (entity: ParsedEntity<Schema> | undefined) => void
    ) => () => void;
    waitForEntityChange: (
        entityId: string,
        predicate: (entity: ParsedEntity<Schema> | undefined) => boolean,
        timeout?: number
    ) => Promise<ParsedEntity<Schema> | undefined>;
}

export const useGameState = create<GameState>()(
    immer((set, get) => ({
        entities: {},
        pendingTransactions: {},
        setEntities: (entities: ParsedEntity<Schema>[]) => {
            set((state) => {
                entities.forEach((entity) => {
                    state.entities[entity.entityId] = entity;
                });
            });
        },
        updateEntity: (entity: ParsedEntity<Schema>) => {
            set((state) => {
                state.entities[entity.entityId] = entity;
            });
        },
        applyOptimisticUpdate: (transactionId, updateFn) => {
            const currentState = get();
            const [nextState, patches, inversePatches] = produceWithPatches(
                currentState,
                (draft) => {
                    updateFn(draft);
                }
            );

            set(() => nextState);

            set((state) => {
                state.pendingTransactions[transactionId] = {
                    transactionId,
                    patches,
                    inversePatches,
                };
            });
        },
        revertOptimisticUpdate: (transactionId) => {
            const transaction = get().pendingTransactions[transactionId];
            if (transaction) {
                set((state) => applyPatches(state, transaction.inversePatches));
                set((state) => {
                    delete state.pendingTransactions[transactionId];
                });
            }
        },
        confirmTransaction: (transactionId) => {
            set((state) => {
                delete state.pendingTransactions[transactionId];
            });
        },
        subscribeToEntity: (entityId, listener): (() => void) => {
            const unsubscribe: () => void = useGameState.subscribe((state) => {
                const entity = state.entities[entityId];
                listener(entity);
            });
            return unsubscribe;
        },
        waitForEntityChange: (entityId, predicate, timeout = 6000) => {
            return new Promise<ParsedEntity<Schema> | undefined>(
                (resolve, reject) => {
                    const unsubscribe = useGameState.subscribe((state) => {
                        const entity = state.entities[entityId];
                        if (predicate(entity)) {
                            clearTimeout(timer);
                            unsubscribe();
                            resolve(entity);
                        }
                    });

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
);
