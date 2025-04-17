import { useCallback, useEffect, useRef } from "react";
import type {
    SubscribeResponse,
    ToriiResponse,
    SchemaType,
    SubscribeParams,
} from "../../../internal/types";
import type { ToriiQueryBuilder } from "../../../internal/toriiQueryBuilder";
import type { EntityKeysClause, Subscription } from "@dojoengine/torii-wasm";
import { deepEqual, sleep } from "./utils";

/**
 * Base hook factory for creating subscription hooks with shared logic
 */
export function createSubscriptionHook<
    Schema extends SchemaType,
    Historical extends boolean = false
>(config: {
    subscribeMethod: (
        options: SubscribeParams<Schema, Historical>
    ) => Promise<SubscribeResponse<Schema, Historical>>;
    updateSubscriptionMethod: (
        subscription: Subscription,
        clause: any,
        historical?: boolean
    ) => Promise<void>;
    queryToHashedKeysMethod: (
        query: ToriiQueryBuilder<Schema>,
        historical?: boolean
    ) => Promise<[ToriiResponse<Schema, Historical>, EntityKeysClause[]]>;
    processInitialData: (data: ToriiResponse<Schema, Historical>) => void;
    processUpdateData: (data: any) => void;
    getErrorPrefix: () => string;
    historical: Historical;
}) {
    return function useSubscriptionHook(query: ToriiQueryBuilder<Schema>) {
        // Subscription handle to update
        const subscriptionRef = useRef<Subscription | null>(null);
        // Handle to user input query
        const fetchingRef = useRef<ToriiQueryBuilder<Schema> | null>(null);
        // Async lock to sync with event loop
        const isUpdating = useRef<boolean>(false);

        const fetchData = useCallback(async () => {
            // Wait until lock is released
            while (isUpdating.current) {
                await sleep(50);
            }

            // Lock function
            isUpdating.current = true;

            if (subscriptionRef.current) {
                const [results, clause] = await config.queryToHashedKeysMethod(
                    fetchingRef.current!,
                    config.historical
                );
                await config.updateSubscriptionMethod(
                    subscriptionRef.current,
                    clause,
                    config.historical
                );
                config.processInitialData(results);
                return null;
            }

            const [initialData, subscription] = await config.subscribeMethod({
                query: fetchingRef.current!,
                callback: ({ data, error }) => {
                    if (data) {
                        config.processUpdateData(data);
                    }
                    if (error) {
                        console.error(
                            `${config.getErrorPrefix()} - error subscribing with query: `,
                            query.toString()
                        );
                        console.error(error);
                    }
                },
                historical: config.historical,
            });

            config.processInitialData(initialData);
            return subscription;
        }, [query]);

        useEffect(() => {
            if (!deepEqual(query, fetchingRef.current)) {
                fetchingRef.current = query;

                fetchData()
                    .then((s) => {
                        if (s !== null) {
                            subscriptionRef.current = s;
                        }
                    })
                    .catch((err) => {
                        console.error(
                            `${config.getErrorPrefix()} - error fetching data for query: `,
                            JSON.stringify(query)
                        );
                        console.error(err);
                    })
                    .finally(() => {
                        // Release lock
                        isUpdating.current = false;
                    });
            }

            return () => {
                if (subscriptionRef.current) {
                    // subscriptionRef.current?.cancel();
                    // subscriptionRef.current = null;
                }
            };
        }, [query, fetchData]);
    };
}
