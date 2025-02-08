import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useSendTransaction } from "@starknet-react/core";
import {
    KeysClause,
    ParsedEntity,
    SDK,
    ToriiQueryBuilder,
} from "@dojoengine/sdk";
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
        async function subscribeToEntityUpdates(db: SDK<SchemaType>) {
            const [initialEntities, sub] = await db.subscribeEntityQuery({
                // Here it is important to includeHashedKeys as subscription requires hasedKeys to query entityIds
                query: new ToriiQueryBuilder()
                    .withClause(
                        KeysClause(
                            ["onchain_dash-GlobalCounter"],
                            ["9999999"],
                            "VariableLen"
                        ).build()
                    )
                    .includeHashedKeys(),
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

            const count =
                initialEntities[0]?.models.onchain_dash?.GlobalCounter?.counter;
            if (undefined === count) {
                setCount(0);
            } else {
                setCount(parseInt(count.toString(), 16));
            }
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
