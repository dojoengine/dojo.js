import { DojoContext } from "@/dojo-sdk-provider";
import { SchemaType } from "@/typescript/models.gen";
import { ParsedEntity, QueryBuilder } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useContext, useEffect, useMemo } from "react";
import { addAddressPadding } from "starknet";
import { useDojoStore } from "./useDojoStore";

export function usePlayerActions(address: string | undefined) {
    const { sdk } = useContext(DojoContext);
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
            const subscription = await sdk.subscribeEntityQuery({
                query: new QueryBuilder<SchemaType>()
                    .namespace("dojo_starter", (n) =>
                        n
                            .entity("Moves", (e) =>
                                e.eq("player", addAddressPadding(address))
                            )
                            .entity("Position", (e) =>
                                e.is("player", addAddressPadding(address))
                            )
                    )
                    .build(),
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

    useEffect(() => {
        const fetchEntities = async (address: string) => {
            try {
                await sdk.getEntities({
                    query: new QueryBuilder<SchemaType>()
                        .namespace("dojo_starter", (n) =>
                            n.entity("Moves", (e) =>
                                e.eq("player", addAddressPadding(address))
                            )
                        )
                        .build(),
                    callback: (resp) => {
                        if (resp.error) {
                            console.error(
                                "resp.error.message:",
                                resp.error.message
                            );
                            return;
                        }
                        if (resp.data) {
                            state.setEntities(
                                resp.data as ParsedEntity<SchemaType>[]
                            );
                        }
                    },
                });
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        if (address) {
            fetchEntities(address);
        }
    }, [sdk, address]);

    return entityId;
}
