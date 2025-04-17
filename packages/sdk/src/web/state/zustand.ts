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
import { CairoCustomEnum, CairoOption, CairoOptionVariant } from "starknet";

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
 * Check if a value is a CairoOption
 * @param value - The value to check
 * @returns True if the value is a CairoOption, false otherwise
 */
function isCairoOption(value: unknown): value is CairoOption<unknown> {
    return value instanceof CairoOption;
}

/**
 * Merge two CairoOption instances
 * @param target - The target CairoOption
 * @param source - The source CairoOption
 * @returns A new CairoOption instance with the merged value
 */
function mergeCairoOption<T extends SchemaType>(
    target: MergedModels<T>,
    source: Partial<MergedModels<T>>
): MergedModels<T> {
    // If source is Some, prefer source's value
    if (source instanceof CairoOption && source.isSome()) {
        return new CairoOption(
            CairoOptionVariant.Some,
            source.unwrap()
        ) as unknown as MergedModels<T>;
    }

    // If source is None or undefined, keep target
    if (target instanceof CairoOption) {
        if (target.isSome()) {
            return new CairoOption(
                CairoOptionVariant.Some,
                target.unwrap()
            ) as unknown as MergedModels<T>;
        }
        return new CairoOption(
            CairoOptionVariant.None
        ) as unknown as MergedModels<T>;
    }

    // This should not happen if both are CairoOption instances
    return target as unknown as MergedModels<T>;
}

/**
 * Check if a value is a CairoCustomEnum
 * @param value - The value to check
 * @returns True if the value is a CairoCustomEnum, false otherwise
 */
function isCairoCustomEnum(value: unknown): value is CairoCustomEnum {
    return value instanceof CairoCustomEnum;
}

/**
 * Merge two CairoCustomEnum instances
 * @param target - The target CairoCustomEnum
 * @param source - The source CairoCustomEnum
 * @returns A new CairoCustomEnum instance with the merged value
 */
function mergeCairoCustomEnum<T extends SchemaType>(
    target: MergedModels<T>,
    source: Partial<MergedModels<T>>
): MergedModels<T> {
    if (!isCairoCustomEnum(target) || !isCairoCustomEnum(source)) {
        return target;
    }
    // If source has an active variant, prefer it
    const sourceActiveVariant = source.activeVariant();
    const sourceValue = source.unwrap();

    if (sourceActiveVariant && sourceValue !== undefined) {
        // Create a new enum with source's active variant
        const newEnumContent: Record<string, any> = {};

        // Initialize all variants from target with undefined
        for (const key in target.variant) {
            newEnumContent[key] = undefined;
        }

        // Set the active variant from source
        newEnumContent[sourceActiveVariant] = sourceValue;

        return new CairoCustomEnum(
            newEnumContent
        ) as unknown as MergedModels<T>;
    }

    // If source doesn't have an active variant, keep target
    const targetActiveVariant = target.activeVariant();
    const targetValue = target.unwrap();

    if (targetActiveVariant && targetValue !== undefined) {
        const newEnumContent: Record<string, any> = {};

        // Initialize all variants with undefined
        for (const key in target.variant) {
            newEnumContent[key] = undefined;
        }

        // Set the active variant from target
        newEnumContent[targetActiveVariant] = targetValue;

        return new CairoCustomEnum(
            newEnumContent
        ) as unknown as MergedModels<T>;
    }

    // Fallback if not both CairoCustomEnum
    return target;
}

/**
 * Merged models type
 * @template T - The schema type
 * @returns The merged models type
 */
type MergedModels<T extends SchemaType> =
    ParsedEntity<T>["models"][keyof ParsedEntity<T>["models"]];

function deepMerge<T extends SchemaType>(
    target: MergedModels<T>,
    source: Partial<MergedModels<T>>
): MergedModels<T> {
    if (isCairoOption(target) && isCairoOption(source)) {
        return mergeCairoOption(target, source);
    }
    if (isCairoCustomEnum(target) && isCairoCustomEnum(source)) {
        return mergeCairoCustomEnum(target, source);
    }
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
