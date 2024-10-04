import { useMemo } from "react";
import { useDojoStore } from "./App";
import { Schema } from "./bindings";

/**
 * Custom hook to retrieve a specific model for a given entityId within a specified namespace.
 *
 * @param entityId - The ID of the entity.
 * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
 * @returns The model structure if found, otherwise undefined.
 */
function useModel<N extends keyof Schema, M extends keyof Schema[N] & string>(
    entityId: string,
    model: `${N}-${M}`
): Schema[N][M] | undefined {
    const entities = useDojoStore((state) => state.entities);

    // Split the model string to extract namespace and modelName
    const [namespace, modelName] = model.split("-") as [N, M];

    const modelData = useMemo(() => {
        const data = entities[entityId]?.models?.[namespace]?.[modelName];
        return data as Schema[N][M] | undefined;
    }, [entities, entityId, namespace, modelName]);

    return modelData;
}

export default useModel;
