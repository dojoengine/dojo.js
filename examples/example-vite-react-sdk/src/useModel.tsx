import { BigNumberish } from "starknet";
import { useDojoStore } from "./App";
import { SchemaType } from "./typescript/models.gen.ts";

/**
 * Custom hook to retrieve a specific model for a given entityId within a specified namespace.
 *
 * @param entityId - The ID of the entity.
 * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
 * @returns The model structure if found, otherwise undefined.
 */
function useModel<
    N extends keyof SchemaType,
    M extends keyof SchemaType[N] & string,
>(entityId: BigNumberish, model: `${N}-${M}`): SchemaType[N][M] | undefined {
    const [namespace, modelName] = model.split("-") as [N, M];

    // Select only the specific model data for the given entityId
    const modelData = useDojoStore(
        (state) =>
            state.entities[entityId]?.models?.[namespace]?.[modelName] as
                | SchemaType[N][M]
                | undefined
    );

    return modelData;
}

export default useModel;
