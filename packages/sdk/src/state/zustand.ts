import { UseBoundStore, type StateCreator, type StoreApi } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Draft, WritableDraft, applyPatches, produceWithPatches } from "immer";

import { enablePatches } from "immer";
import { subscribeWithSelector } from "zustand/middleware";
import { ParsedEntity, SchemaType } from "../types";
import { GameState } from ".";

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

type MergedModels<T extends SchemaType> =
    ParsedEntity<T>["models"][keyof ParsedEntity<T>["models"]];

function deepMerge<T extends SchemaType>(
    target: MergedModels<T>,
    source: Partial<MergedModels<T>>
): MergedModels<T> {
    const result = { ...target } as Record<string, any>;

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (
                source[key] !== null &&
                typeof source[key] === "object" &&
                !Array.isArray(source[key])
            ) {
                // If the property is an object in both source and target, recursively merge
                if (
                    key in target &&
                    typeof target[key] === "object" &&
                    !Array.isArray(target[key])
                ) {
                    result[key] = deepMerge(target[key], source[key]);
                } else {
                    // If the key doesn't exist in target or isn't an object, just assign
                    result[key] = source[key];
                }
            } else {
                // For non-objects (primitives, arrays, null), just assign
                result[key] = source[key];
            }
        }
    }

    return result;
}
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
                        entities.forEach((entity) => {
                            state.entities[entity.entityId] =
                                entity as WritableDraft<ParsedEntity<T>>;
                        });
                    });
                },
                mergeEntities: (entities: ParsedEntity<T>[]) => {
                    set((state: Draft<GameState<T>>) => {
                        entities.forEach((entity) => {
                            if (entity.entityId && entity.models) {
                                const existingEntity =
                                    state.entities[entity.entityId];

                                if (!existingEntity) {
                                    // Set new entity
                                    state.entities[entity.entityId] =
                                        entity as WritableDraft<
                                            ParsedEntity<T>
                                        >;
                                    return;
                                }
                                // Create new models object without spread
                                const mergedModels: typeof existingEntity.models =
                                    Object.assign({}, existingEntity.models);

                                // Iterate through each namespace in the new models
                                Object.entries(entity.models).forEach(
                                    ([namespace, namespaceModels]) => {
                                        const typedNamespace =
                                            namespace as keyof ParsedEntity<T>["models"];
                                        if (!(typedNamespace in mergedModels)) {
                                            mergedModels[
                                                typedNamespace as keyof typeof mergedModels
                                            ] = {} as any;
                                        }

                                        // Use deep merge instead of Object.assign
                                        mergedModels[
                                            typedNamespace as keyof typeof mergedModels
                                        ] = deepMerge(
                                            mergedModels[
                                                typedNamespace as keyof typeof mergedModels
                                            ] as MergedModels<T>,
                                            namespaceModels
                                        ) as any;
                                    }
                                );

                                // Update the entity
                                state.entities[entity.entityId] = {
                                    ...existingEntity,
                                    ...entity,
                                    models: mergedModels,
                                };
                            }
                        });
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
                            Object.entries(entity.models).forEach(
                                ([namespace, namespaceModels]) => {
                                    const typedNamespace =
                                        namespace as keyof ParsedEntity<T>["models"];
                                    if (!(typedNamespace in mergedModels)) {
                                        mergedModels[
                                            typedNamespace as keyof typeof mergedModels
                                        ] = {} as any;
                                    }

                                    mergedModels[
                                        typedNamespace as keyof typeof mergedModels
                                    ] = deepMerge(
                                        mergedModels[
                                            typedNamespace as keyof typeof mergedModels
                                        ] as MergedModels<T>,
                                        namespaceModels
                                    ) as any;
                                }
                            );
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
            }))
        )
    );

    return useStore;
}
