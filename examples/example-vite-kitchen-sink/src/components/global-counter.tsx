import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useSendTransaction } from "@starknet-react/core";
import { ParsedEntity, QueryBuilder, SDK } from "@dojoengine/sdk";
import { Subscription } from "@dojoengine/torii-wasm";
import { dojoConfig } from "@/../dojoConfig";
import { SchemaType } from "@/typescript/models.gen";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { setupWorld } from "@/typescript/contracts.gen";

export default function GlobalCOunter() {
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sub, setSub] = useState<Subscription | null>(null);
    const { send: incrementGlobalCounter } = useSendTransaction({
        calls: [
            {
                contractAddress: dojoConfig.manifest.contracts[0].address,
                entrypoint: "increment_global_counter",
                calldata: [],
            },
        ],
    });
    const handleGlobalClick = useCallback(async () => {
        incrementGlobalCounter();
        setIsLoading(true);
    }, [incrementGlobalCounter, setIsLoading]);

    const { sdk: db } = useDojoSDK<typeof setupWorld, SchemaType>();

    useEffect(() => {
        async function getEntity(db: SDK<SchemaType>) {
            const entity = await db.getEntities({
                query: new QueryBuilder<SchemaType>()
                    .namespace("onchain_dash", (n) =>
                        n.entity("GlobalCounter", (e) =>
                            e.eq("global_counter_key", 9999999)
                        )
                    )
                    .build(),
                callback: ({ data, error }) => {},
            });

            const counter = entity.pop() as ParsedEntity<SchemaType>;
            if (!counter) {
                return 0;
            }
            const count = counter.models.onchain_dash?.GlobalCounter?.counter;
            if (undefined === count) {
                return 0;
            }
            return parseInt(count.toString(), 16);
        }

        if (db) {
            getEntity(db).then(setCount).catch(console.error);
        }
    }, [db]);

    useEffect(() => {
        async function subscribeToEntityUpdates(db: SDK<SchemaType>) {
            const sub = await db.subscribeEntityQuery({
                query: new QueryBuilder<SchemaType>()
                    .namespace("onchain_dash", (n) =>
                        n.entity("GlobalCounter", (e) =>
                            e.eq("global_counter_key", 9999999)
                        )
                    )
                    .build(),
                callback: ({ data, error }) => {
                    if (data) {
                        const entity = data.pop() as ParsedEntity<SchemaType>;
                        if (!entity) {
                            return;
                        }
                        if (
                            entity.models.onchain_dash?.GlobalCounter
                                ?.counter === undefined
                        ) {
                            return;
                        }
                        const count =
                            entity.models.onchain_dash?.GlobalCounter?.counter;
                        if (undefined === count) {
                            return 0;
                        }
                        const value = parseInt(count.toString(), 16);
                        setCount(value);
                        setIsLoading(false);
                        return;
                    }
                    if (error) {
                        throw error;
                    }
                },
            });
            setSub(sub);
        }
        if (db && sub === null) {
            subscribeToEntityUpdates(db)
                .then(() => {})
                .catch(console.error);
        }
        return () => {
            if (sub) {
                sub.free();
            }
        };
    }, [db, sub, setIsLoading]);

    return (
        <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
                Global counter
            </legend>
            <div className="grid gap-3">Count : {count}</div>
            <div className="grid gap-3">
                <Button
                    variant="outline"
                    className="rounded-lg"
                    loading={isLoading}
                    onClick={handleGlobalClick}
                >
                    Click me !
                </Button>
            </div>
        </fieldset>
    );
}
