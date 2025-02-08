import { useEffect, useMemo } from "react";

import { KeysClause, ParsedEntity, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { ModelsMapping, SchemaType } from "@/typescript/models.gen";
import { addAddressPadding } from "starknet";

export function usePlayerActions(address: string | undefined) {
    const { sdk, useDojoStore } = useDojoSDK();
    const state = useDojoStore((state) => state);

    const entityId = useMemo(() => {
        if (address) {
            return getEntityIdFromKeys([BigInt(address)]);
        }
        return BigInt(0);
    }, [address]);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribe = async (address: string) => {
            const [entities, subscription] = await sdk.subscribeEntityQuery({
                query: new ToriiQueryBuilder()
                    .withClause(
                        KeysClause(
                            [ModelsMapping.Moves, ModelsMapping.Position],
                            [addAddressPadding(address)],
                            "VariableLen"
                        ).build()
                    )
                    .includeHashedKeys(),
                callback: ({ error, data }) => {
                    if (error) {
                        console.error("Error setting up entity sync:", error);
                    } else if (
                        data &&
                        (data[0] as ParsedEntity<SchemaType>).entityId !== "0x0"
                    ) {
                        state.updateEntity(data[0] as ParsedEntity<SchemaType>);
                    }
                },
            });
            state.setEntities(entities);

            unsubscribe = () => subscription.cancel();
        };

        if (address) {
            subscribe(address);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [sdk, address]);

    return entityId;
}
