import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useContext, useMemo } from "react";
import type { BigNumberish } from "starknet";
import type { SchemaType } from "../../../internal/types";
import { DojoContext, type DojoContextType } from "../provider";

export * from "./entities";
export * from "./events";
export * from "./state";
export * from "./token";

/**
 * Hook that exposes sdk features.
 *
 * @template Client Client function generated with `sozo build --typescript`
 * @template Schema Schema function generated with `sozo build --typescript`
 * @returns DojoContextType<Client, Schema>
 */
export function useDojoSDK<
    Client extends (...args: any) => any,
    Schema extends SchemaType,
>(): DojoContextType<Client, Schema> {
    return useContext<DojoContextType<Client, Schema>>(DojoContext);
}

/**
 * If you know all distinct keys of your model, here is a way to compose it.
 *
 * @param keys Each keys corresponding to your model keys.
 * @returns Composed entityId
 */
export function useEntityId(...keys: BigNumberish[]): BigNumberish {
    const entityId = useMemo(() => {
        if (keys.length > 0) {
            return getEntityIdFromKeys(keys.map((k) => BigInt(k)));
        }
        return BigInt(0);
    }, [keys]);

    return entityId;
}
