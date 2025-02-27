import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { BigNumberish } from "starknet";
import type {
    StandardizedQueryResult,
    SubscribeResponse,
    ToriiResponse,
    SchemaType,
    SubscribeParams,
} from "../types";
import { DojoContext, type DojoContextType } from "./provider";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { createDojoStoreFactory } from "../state/zustand";
import type { GameState } from "../state";
import type { ToriiQueryBuilder } from "../toriiQueryBuilder";
import type { EntityKeysClause, Subscription } from "@dojoengine/torii-client";
import { getEntityIdFromKeys } from "@dojoengine/utils";

/**
 * Factory function to create a React Zustand store based on a given SchemaType.
 *
 * @template T - The schema type.
 * @returns A Zustand hook tailored to the provided schema.
 */
export function createDojoStore<T extends SchemaType>() {
    // hacktually until I find a proper type input to createDojoStoreFactory
    return createDojoStoreFactory<T>(create) as unknown as UseBoundStore<
        StoreApi<GameState<T>>
    >;
}

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
    const { useDojoStore } =
        useContext<DojoContextType<Client, Schema>>(DojoContext);

    // Select only the specific model data for the given entityId
    const modelData = useDojoStore(
        (state) =>
            state.entities[entityId.toString()]?.models?.[namespace]?.[
                modelName
            ] as SchemaType[N][M] | undefined
    );

    return modelData;
}

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

/**
 * Base hook factory for creating subscription hooks with shared logic
 */
function createSubscriptionHook<
    Schema extends SchemaType,
    Historical extends boolean = false,
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

/**
 * Subscribe to entity changes. This hook fetches initial data from torii and subscribes to each entity change.
 * Use `useModel` to access your data.
 *
 * @param query ToriiQuery
 */
export function useEntityQuery<Schema extends SchemaType>(
    query: ToriiQueryBuilder<Schema>
) {
    const { sdk, useDojoStore } = useDojoSDK<() => any, Schema>();
    const state = useDojoStore((s) => s);

    const useEntityQueryHook = createSubscriptionHook<Schema>({
        subscribeMethod: (options) => sdk.subscribeEntityQuery(options),
        updateSubscriptionMethod: (subscription, clause) =>
            sdk.updateEntitySubscription(subscription, clause),
        queryToHashedKeysMethod: (query) => sdk.toriiQueryIntoHashedKeys(query),
        processInitialData: (data) => state.mergeEntities(data),
        processUpdateData: (data) => {
            const entity = data.pop();
            if (entity && entity.entityId !== "0x0") {
                state.updateEntity(entity);
            }
        },
        getErrorPrefix: () => "Dojo.js - useEntityQuery",
        historical: false,
    });

    useEntityQueryHook(query);
}

/**
 * Subscribe to event changes. This hook fetches initial events from torii and subscribes to new events.
 *
 * @param query ToriiQuery
 */
export function useEventQuery<Schema extends SchemaType>(
    query: ToriiQueryBuilder<Schema>
) {
    const { sdk, useDojoStore } = useDojoSDK<() => any, Schema>();
    const state = useDojoStore((s) => s);

    const useEventQueryHook = createSubscriptionHook<Schema>({
        subscribeMethod: (options) => sdk.subscribeEventQuery(options),
        updateSubscriptionMethod: (subscription, clause) =>
            sdk.updateEventMessageSubscription(subscription, clause, false),
        queryToHashedKeysMethod: (query) =>
            sdk.toriiEventMessagesQueryIntoHashedKeys(query, false),
        processInitialData: (data) => state.mergeEntities(data),
        processUpdateData: (data) => {
            const event = data.pop();
            if (event && event.entityId !== "0x0") {
                state.updateEntity(event);
            }
        },
        getErrorPrefix: () => "Dojo.js - useEventQuery",
        historical: false,
    });

    useEventQueryHook(query);
}

/**
 * Subscribe to historical events changes. This hook fetches initial data from torii and subscribes to entity changes.
 * You need to specify to torii which events has to be taken in account as historical events.
 *
 * @param query ToriiQuery
 */
export function useHistoricalEventsQuery<Schema extends SchemaType>(
    query: ToriiQueryBuilder<Schema>
) {
    const { sdk } = useDojoSDK<() => any, Schema>();
    const [events, setEvents] = useState<StandardizedQueryResult<Schema>[]>([]);

    const useHistoricalEventsQueryHook = createSubscriptionHook<Schema, true>({
        subscribeMethod: (options) => sdk.subscribeEventQuery(options),
        updateSubscriptionMethod: (subscription, clause) =>
            sdk.updateEventMessageSubscription(subscription, clause, true),
        queryToHashedKeysMethod: (query) =>
            sdk.toriiEventMessagesQueryIntoHashedKeys(query, true),
        processInitialData: (data) => setEvents(data),
        processUpdateData: (data) => {
            const event = data.pop();
            if (event) {
                setEvents((ev) => [event, ...ev]);
            }
        },
        getErrorPrefix: () => "Dojo.js - useHistoricalEventsQuery",
        historical: true,
    });

    useHistoricalEventsQueryHook(query);

    return events;
}

/**
 * Performs a deep comparison between two values to determine if they are equivalent.
 * @param a First value to compare
 * @param b Second value to compare
 * @returns True if the values are equivalent, false otherwise
 */
function deepEqual(a: any, b: any): boolean {
    // If the values are strictly equal, return true
    if (a === b) return true;

    // If either value is null or not an object, they're not equal
    if (
        a === null ||
        b === null ||
        typeof a !== "object" ||
        typeof b !== "object"
    ) {
        return false;
    }

    // Handle arrays
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (!deepEqual(a[i], b[i])) return false;
        }

        return true;
    }

    // Handle Date objects
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }

    // Handle regular expressions
    if (a instanceof RegExp && b instanceof RegExp) {
        return a.toString() === b.toString();
    }

    // Get all keys from both objects
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    // If number of keys is different, objects are not equal
    if (keysA.length !== keysB.length) return false;

    // Check if every key in a exists in b and has the same value
    return keysA.every(
        (key) =>
            Object.prototype.hasOwnProperty.call(b, key) &&
            deepEqual(a[key], b[key])
    );
}

/**
 * Creates a Promise that resolves after the specified time
 * @param ms The time to sleep in milliseconds
 * @returns A Promise that resolves after the specified time
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
