import { useContext } from "react";
import { BigNumberish } from "starknet";
import { SchemaType } from "../types";
import { DojoContext, DojoContextType } from "./provider";

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
    const { useDojoStore } = useContext(DojoContext) as DojoContextType<
        Client,
        Schema
    >;

    // Select only the specific model data for the given entityId
    const modelData = useDojoStore(
        (state) =>
            state.entities[entityId.toString()]?.models?.[namespace]?.[
                modelName
            ] as SchemaType[N][M] | undefined
    );

    return modelData;
}

export function useDojoSDK<
    Client extends (...args: any) => any,
    Schema extends SchemaType,
>(): DojoContextType<Client, Schema> {
    return useContext(DojoContext);
}
