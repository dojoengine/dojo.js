import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useAccount, useContractWrite } from "@starknet-react/core";
import { useDojoDb } from "@/dojo/provider";
import { ensureStarkFelt } from "@/lib/utils";
import { SDK } from "@dojoengine/sdk";
import { OnchainDashSchemaType } from "@/dojo/models";
import { Subscription } from "@dojoengine/torii-wasm";
import { dojoConfig } from "@/../dojoConfig";

export default function CallerCounter() {
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [sub, setSub] = useState<Subscription | null>(null);
    const { address } = useAccount();
    const { write: incrementCallerCounter } = useContractWrite({
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

    const db = useDojoDb();
    useEffect(() => {
        async function getEntity(
            db: SDK<OnchainDashSchemaType>,
            address: string
        ) {
            const entity = await db.getEntities(
                {
                    onchain_dash: {
                        CallerCounter: {
                            $: {
                                where: {
                                    caller: { $eq: ensureStarkFelt(address) },
                                },
                            },
                        },
                    },
                },
                () => {}
            );
            const counter = entity.pop();
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
            db: SDK<OnchainDashSchemaType>,
            address: string
        ) {
            const sub = await db.subscribeEntityQuery(
                {
                    // @ts-expect-error $eq is working there
                    onchain_dash: {
                        CallerCounter: {
                            $: {
                                where: {
                                    caller: { $eq: ensureStarkFelt(address) },
                                },
                            },
                        },
                    },
                },
                ({ data, error }) => {
                    if (data) {
                        const entity = data.pop();
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
                }
            );
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
