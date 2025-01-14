import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useAccount, useSendTransaction } from "@starknet-react/core";
import { useDojoDb } from "@/dojo/provider";
import { ensureStarkFelt } from "@/lib/utils";
import { ParsedEntity, QueryBuilder, SDK } from "@dojoengine/sdk";
import { Subscription } from "@dojoengine/torii-wasm";
import { dojoConfig } from "@/../dojoConfig";
import { SchemaType } from "@/typescript/models.gen";
import { addAddressPadding } from "starknet";

export default function CallerCounter() {
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sub, setSub] = useState<Subscription | null>(null);
    const { address } = useAccount();
    const { send: incrementCallerCounter } = useSendTransaction({
        calls: [
            {
                contractAddress: dojoConfig.manifest.contracts[0].address,
                entrypoint: "increment_caller_counter",
                calldata: [],
            },
        ],
    });

    const handleCallerClick = useCallback(async () => {
        incrementCallerCounter();
        setIsLoading(true);
    }, [incrementCallerCounter, setIsLoading]);

    const { db } = useDojoDb();
    useEffect(() => {
        async function getEntity(db: SDK<SchemaType>, address: string) {
            const entity = await db.getEntities({
                query: new QueryBuilder<SchemaType>()
                    .namespace("onchain_dash", (n) =>
                        n.entity("CallerCounter", (e) =>
                            e.eq("caller", addAddressPadding(address))
                        )
                    )
                    .build(),
                callback: () => {},
            });
            const counter = entity.pop() as ParsedEntity<SchemaType>;
            if (!counter) {
                return 0;
            }
            const count = counter.models.onchain_dash?.CallerCounter?.counter;
            if (undefined === count) {
                return 0;
            }

            return parseInt(count.toString(), 16);
        }
        if (address && db) {
            getEntity(db, address).then(setCount).catch(console.error);
        }
    }, [address, db]);

    useEffect(() => {
        async function subscribeToEntityUpdates(
            db: SDK<SchemaType>,
            address: string
        ) {
            const sub = await db.subscribeEntityQuery({
                query: new QueryBuilder<SchemaType>()
                    .namespace("onchain_dash", (n) =>
                        n.entity("CallerCounter", (e) =>
                            e.eq("caller", addAddressPadding(address))
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
                            entity.models.onchain_dash?.CallerCounter
                                ?.counter === undefined
                        ) {
                            return;
                        }
                        const count =
                            entity.models.onchain_dash?.CallerCounter?.counter;
                        if (undefined === count) {
                            return 0;
                        }

                        setIsLoading(false);
                        setCount(parseInt(count.toString(), 16));
                        return;
                    }
                    if (error) {
                        throw error;
                    }
                },
            });
            setSub(sub);
        }
        if (address && db && sub === null) {
            subscribeToEntityUpdates(db, address)
                .then(() => {})
                .catch(console.error);
        }
        return () => {
            if (sub) {
                sub.free();
            }
        };
    }, [address, db, sub]);
    return (
        <fieldset className="grid gap-6 rounded-lg border p-4">
            <legend className="-ml-1 px-1 text-sm font-medium">
                Per wallet counter
            </legend>
            <div className="grid gap-3">Count : {count}</div>
            <div className="grid gap-3">
                <Button
                    variant="outline"
                    className="rounded-lg"
                    loading={isLoading}
                    onClick={handleCallerClick}
                >
                    Click me !
                </Button>
            </div>
        </fieldset>
    );
}
