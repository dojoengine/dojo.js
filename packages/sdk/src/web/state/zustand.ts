import type { StateCreator, StoreApi } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
    type Draft,
    type WritableDraft,
    applyPatches,
    produceWithPatches,
    enablePatches,
} from "immer";

import { subscribeWithSelector } from "zustand/middleware";
import type { ParsedEntity, SchemaType } from "../../internal/types";
import type { GameState } from ".";
import { deepMerge, MergedModels } from "../../internal/merge";

enablePatches();

// Define middleware types
type ImmerMiddleware = [["zustand/immer", never]];
type SubscribeMiddleware = [["zustand/subscribeWithSelector", never]];
type Middlewares = [...SubscribeMiddleware, ...ImmerMiddleware];

type CreateStore = {
    <T, Mos extends [...Middlewares]>(
        initializer: StateCreator<T, [], Mos>
    ): StoreApi<T>;
};

/**
 * Factory function to create a Zustand store based on a given SchemaType.
 *
 * @template T - The schema type.
 * @returns A Zustand hook tailored to the provided schema.
 */
export function createDojoStoreFactory<T extends SchemaType>(
    storeCreatorFn: CreateStore
) {
    const useStore = storeCreatorFn<GameState<T>, Middlewares>(
        subscribeWithSelector(
            immer((set, get) => ({
                entities: {},
                pendingTransactions: {},
                setEntities: (entities: ParsedEntity<T>[]) => {
                    set((state: Draft<GameState<T>>) => {
                        for (const entity of entities) {
                            state.entities[entity.entityId] =
                                entity as WritableDraft<ParsedEntity<T>>;
                        }
                    });
                },
                mergeEntities: (entities: ParsedEntity<T>[]) => {
                    set((state: Draft<GameState<T>>) => {
                        for (const entity of entities) {
                            if (entity.entityId && entity.models) {
                                const existingEntity =
                                    state.entities[entity.entityId];

                                if (!existingEntity) {
                                    // Set new entity
                                    state.entities[entity.entityId] =
                                        entity as WritableDraft<
                                            ParsedEntity<T>
                                        >;
                                    continue;
                                }
                                // Create new models object without spread
                                const mergedModels: typeof existingEntity.models =
                                    Object.assign({}, existingEntity.models);

                                // Iterate through each namespace in the new models
                                for (const [
                                    namespace,
                                    namespaceModels,
                                ] of Object.entries(entity.models)) {
                                    const typedNamespace =
                                        namespace as keyof ParsedEntity<T>["models"];
                                    if (!(typedNamespace in mergedModels)) {
                                        // @ts-expect-error TODO: change to better type
                                        mergedModels[
                                            typedNamespace as keyof typeof mergedModels
                                        ] = {} as Record<string, unknown>;
                                    }

                                    // Use deep merge instead of Object.assign
                                    // @ts-expect-error TODO: change to better type
                                    mergedModels[
                                        typedNamespace as keyof typeof mergedModels
                                    ] = deepMerge(
                                        mergedModels[
                                            typedNamespace as keyof typeof mergedModels
                                        ] as MergedModels<T>,
                                        namespaceModels
                                    ) as MergedModels<T>;
                                }

                                // Update the entity
                                state.entities[entity.entityId] = {
                                    ...existingEntity,
                                    ...entity,
                                    models: mergedModels,
                                };
                            }
                        }
                    });
                },
                updateEntity: (entity: Partial<ParsedEntity<T>>) => {
                    set((state: Draft<GameState<T>>) => {
                        if (entity.entityId && entity.models) {
                            const existingEntity =
                                state.entities[entity.entityId];

                            if (!existingEntity) {
                                // Set new entity
                                state.entities[entity.entityId] =
                                    entity as WritableDraft<ParsedEntity<T>>;
                                return;
                            }
                            // Create new models object without spread
                            const mergedModels: typeof existingEntity.models =
                                Object.assign({}, existingEntity.models);
                            // Iterate through each namespace in the new models
                            for (const [
                                namespace,
                                namespaceModels,
                            ] of Object.entries(entity.models)) {
                                const typedNamespace =
                                    namespace as keyof ParsedEntity<T>["models"];
                                if (!(typedNamespace in mergedModels)) {
                                    // @ts-expect-error TODO: change to better type
                                    mergedModels[
                                        typedNamespace as keyof typeof mergedModels
                                    ] = {} as Record<string, unknown>;
                                }

                                // @ts-expect-error TODO: change to better type
                                mergedModels[
                                    typedNamespace as keyof typeof mergedModels
                                ] = deepMerge(
                                    mergedModels[
                                        typedNamespace as keyof typeof mergedModels
                                    ] as MergedModels<T>,
                                    namespaceModels
                                ) as MergedModels<T>;
                            }
                            // Update the entity
                            state.entities[entity.entityId] = {
                                ...existingEntity,
                                ...entity,
                                models: mergedModels,
                            };
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
                            const unsubscribe = useStore.subscribe((state) => {
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
                // Implementing query layer methods
                getEntity: (entityId: string) => {
                    return get().entities[entityId];
                },

                getEntities: (
                    filter?: (entity: ParsedEntity<T>) => boolean
                ) => {
                    const allEntities = Object.values(get().entities);
                    return filter ? allEntities.filter(filter) : allEntities;
                },

                getEntitiesByModel: (namespace, model) => {
                    return get().getEntities((entity) => {
                        return !!entity.models[namespace]?.[model];
                    });
                },
                resetStore: () => {
                    set((state: Draft<GameState<T>>) => {
                        state.entities = {};
                        state.pendingTransactions = {};
                    });
                },
            }))
        )
    );

    return useStore;
}
