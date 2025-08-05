import type { BigNumberish } from "starknet";
import type { SchemaType, StandardizedQueryResult } from "./types";

/**
 * Custom hook to retrieve a specific model for a given entityId within a specified namespace.
 *
 * @param entityId - The ID of the entity.
 * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
 * @returns The model structure if found, otherwise undefined.
 */
export function getModelByEntityId<
    N extends keyof SchemaType,
    M extends keyof SchemaType[N] & string,
    Schema extends SchemaType,
>(
    entityId: BigNumberish,
    model: `${N}-${M}`,
    value: StandardizedQueryResult<Schema>
): SchemaType[N][M] | undefined {
    const [namespace, modelName] = model.split("-") as [N, M];
    for (const v of value) {
        if (v.entityId !== entityId) {
            continue;
        }
        return v.models?.[namespace]?.[modelName] as
            | SchemaType[N][M]
            | undefined;
    }
}

/**
 * Custom hook to retrieve a specific model for a given entityId within a specified namespace.
 *
 * @param entityId - The ID of the entity.
 * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
 * @returns The model structure if found, otherwise undefined.
 */
export function getModel<
    N extends keyof SchemaType,
    M extends keyof SchemaType[N] & string,
    Schema extends SchemaType,
>(
    model: `${N}-${M}`,
    value: StandardizedQueryResult<Schema>
): SchemaType[N][M] | undefined {
    const [namespace, modelName] = model.split("-") as [N, M];
    for (const v of value) {
        return v.models?.[namespace]?.[modelName] as
            | SchemaType[N][M]
            | undefined;
    }
}

// /**
//  * Custom hook to retrieve all entities that have a specific model.
//  *
//  * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
//  * @returns The model structure if found, otherwise undefined.
//  */
// export function getModels<
//     N extends keyof SchemaType,
//     M extends keyof SchemaType[N] & string,
//     Client extends (...args: any) => any,
//     Schema extends SchemaType,
// >(model: `${N}-${M}`): { [entityId: string]: SchemaType[N][M] | undefined } {
//     const [namespace, modelName] = model.split("-") as [N, M];
//     const { useDojoStore } =
//         useContext<DojoContextType<Client, Schema>>(DojoContext);
//
//     const modelData = useDojoStore((state) =>
//         state.getEntitiesByModel(namespace, modelName).map((entity) => ({
//             [entity.entityId]: entity.models?.[namespace]?.[modelName],
//         }))
//     ) as unknown as { [entityId: string]: SchemaType[N][M] | undefined };
//
//     return modelData;
// }
