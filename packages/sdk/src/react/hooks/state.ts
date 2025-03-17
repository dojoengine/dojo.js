import { useContext } from "react";
import type { BigNumberish } from "starknet";
import type { SchemaType } from "../../types";
import { DojoContext, type DojoContextType } from "../provider";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { createDojoStoreFactory } from "../../state/zustand";
import type { GameState } from "../../state";

/**
 * Factory function to create a React Zustand store based on a given SchemaType.
 *
 * @template T - The schema type.
 * @returns A Zustand hook tailored to the provided schema.
 */
export function createDojoStore<T extends SchemaType>() {
    // hacktually until I find a proper type input to createDojoStoreFactory
    return createDojoStoreFactory<T>(create) as unknown as UseBoundStore<
        StoreApi<GameState<T>>
    >;
}

/**
 * Custom hook to retrieve a specific model for a given entityId within a specified namespace.
 *
 * @param entityId - The ID of the entity.
 * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
 * @returns The model structure if found, otherwise undefined.
 */
export function useModel<
    N extends keyof SchemaType,
    M extends keyof SchemaType[N] & string,
    Client extends (...args: any) => any,
    Schema extends SchemaType,
>(entityId: BigNumberish, model: `${N}-${M}`): SchemaType[N][M] | undefined {
    const [namespace, modelName] = model.split("-") as [N, M];
    const { useDojoStore } =
        useContext<DojoContextType<Client, Schema>>(DojoContext);

    // Select only the specific model data for the given entityId
    const modelData = useDojoStore(
        (state) =>
            state.entities[entityId.toString()]?.models?.[namespace]?.[
                modelName
            ] as SchemaType[N][M] | undefined
    );

    return modelData;
}

/**
 * Custom hook to retrieve all entities that have a specific model.
 *
 * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
 * @returns The model structure if found, otherwise undefined.
 */
export function useModels<
    N extends keyof SchemaType,
    M extends keyof SchemaType[N] & string,
    Client extends (...args: any) => any,
    Schema extends SchemaType,
>(model: `${N}-${M}`): { [entityId: string]: SchemaType[N][M] | undefined } {
    const [namespace, modelName] = model.split("-") as [N, M];
    const { useDojoStore } =
        useContext<DojoContextType<Client, Schema>>(DojoContext);

    const modelData = useDojoStore((state) =>
        state.getEntitiesByModel(namespace, modelName).map((entity) => ({
            [entity.entityId]: entity.models?.[namespace]?.[modelName],
        }))
    ) as unknown as { [entityId: string]: SchemaType[N][M] | undefined };

    return modelData;
}
