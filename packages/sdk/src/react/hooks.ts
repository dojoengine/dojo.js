import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import type { BigNumberish } from "starknet";
import { StandardizedQueryResult, type SchemaType } from "../types";
import { DojoContext, type DojoContextType } from "./provider";
import { create, type StoreApi, type UseBoundStore } from "zustand";
import { createDojoStoreFactory } from "../state/zustand";
import type { GameState } from "../state";
import { ToriiQueryBuilder } from "../toriiQueryBuilder";
import { Subscription } from "@dojoengine/torii-client";
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
 * Subscribe to entity changes. This hook fetches initial data from torii and subscribe to each entity change. Use `useModel` to access your data.
 *
 * @param query ToriiQuery
 */
export function useEntityQuery<Schema extends SchemaType>(
    query: ToriiQueryBuilder<Schema>
) {
    const { sdk, useDojoStore } = useDojoSDK();
    const state = useDojoStore((s) => s);

    // Subscription handle to update. Avoid unecessary creating/cancelling subscriptions
    const subscriptionRef = useRef<Subscription | null>(null);
    // Handle to user input query.
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
            const [entities, clause] = await sdk.toriiQueryIntoHashedKeys(
                fetchingRef.current!
            );
            await sdk.updateEntitySubscription(subscriptionRef.current, clause);
            state.mergeEntities(entities);
            return null;
        }

        const [initialData, subscription] = await sdk.subscribeEntityQuery({
            query: fetchingRef.current!,
            callback: ({ data, error }) => {
                if (data) {
                    const entity = data.pop();
                    if (entity && entity.entityId !== "0x0") {
                        state.updateEntity(entity);
                    }
                }
                if (error) {
                    console.error(
                        "Dojo.js - useEntityQuery - error subscribing to entity with query : ",
                        query.toString()
                    );
                    console.error(error);
                }
            },
        });

        state.mergeEntities(initialData);

        return subscription;
    }, [query, subscriptionRef]);

    useEffect(() => {
        if (!deepEqual(query, fetchingRef.current)) {
            fetchingRef.current = query;

            fetchData()
                .then((s) => {
                    if (s !== null) {
                        subscriptionRef.current = s;
                    }
                    // Important to release lock at this point.
                    isUpdating.current = false;
                })
                .catch((err) => {
                    console.error(
                        "Dojo.js - useEntityQuery - error fetching entities for query ",
                        JSON.stringify(query)
                    );
                    console.error(err);
                })
                .finally(() => {
                    // Important to release lock at this point.
                    isUpdating.current = false;
                });
        }

        return () => {
            if (subscriptionRef.current) {
                // subscriptionRef.current?.cancel();
                // subscriptionRef.current = null;
                // setSub(null);
            }
        };
    }, [query, subscriptionRef, fetchData]);
}

/**
 * Subscribe to entity changes. This hook fetches initial data from torii and subscribe to each entity change. Use `useModel` to access your data.
 *
 * @param query ToriiQuery
 */
export function useEventQuery<Schema extends SchemaType>(
    query: ToriiQueryBuilder<Schema>
) {
    const { sdk, useDojoStore } = useDojoSDK();
    const state = useDojoStore((s) => s);

    // Subscription handle to update. Avoid unecessary creating/cancelling subscriptions
    const subscriptionRef = useRef<Subscription | null>(null);
    // Handle to user input query.
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
            const [events, clause] =
                await sdk.toriiEventMessagesQueryIntoHashedKeys(
                    fetchingRef.current!,
                    false
                );
            await sdk.updateEventMessageSubscription(
                subscriptionRef.current,
                clause,
                false
            );
            state.mergeEntities(events);

            return null;
        }

        const [initialData, subscription] = await sdk.subscribeEventQuery({
            query: fetchingRef.current!,
            callback: ({ data, error }) => {
                if (data) {
                    const event = data.pop();
                    if (event && event.entityId !== "0x0") {
                        state.updateEntity(event);
                    }
                }
                if (error) {
                    console.error(
                        "Dojo.js - useEventQuery - error subscribing to events with query : ",
                        query.toString()
                    );
                    console.error(error);
                }
            },
            historical: false,
        });

        state.mergeEntities(initialData);

        return subscription;
    }, [query, subscriptionRef]);

    useEffect(() => {
        if (!deepEqual(query, fetchingRef.current)) {
            fetchingRef.current = query;

            fetchData()
                .then((s) => {
                    if (s !== null) {
                        subscriptionRef.current = s;
                    }
                    // Important to release lock at this point.
                    isUpdating.current = false;
                })
                .catch((err) => {
                    console.error(
                        "Dojo.js - useEventQuery - error fetching events for query ",
                        JSON.stringify(query)
                    );
                    console.error(err);
                })
                .finally(() => {
                    // Important to release lock at this point.
                    isUpdating.current = false;
                });
        }

        return () => {
            if (subscriptionRef.current) {
                // subscriptionRef.current?.cancel();
                // subscriptionRef.current = null;
                // setSub(null);
            }
        };
    }, [query, subscriptionRef, fetchData]);
}

/**
 * Subscribe to historical events changes. This hook fetches initial data from torii and subscribe to each entity change. Use `useModel` to access your data.
 * You need to specify to torii which events has to be taken in account as historical events.
 *
 * @param query ToriiQuery
 */
export function useHistoricalEventsQuery<Schema extends SchemaType>(
    query: ToriiQueryBuilder<Schema>
) {
    const { sdk } = useDojoSDK<() => any, Schema>();
    const [events, setEvents] = useState<StandardizedQueryResult<Schema>[]>([]);

    // Subscription handle to update. Avoid unecessary creating/cancelling subscriptions
    const subscriptionRef = useRef<Subscription | null>(null);
    // Handle to user input query.
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
            const [events, clause] =
                await sdk.toriiEventMessagesQueryIntoHashedKeys(
                    fetchingRef.current!,
                    true
                );
            await sdk.updateEventMessageSubscription(
                subscriptionRef.current,
                clause,
                true
            );
            setEvents(events);
            return null;
        }

        const [initialData, subscription] = await sdk.subscribeEventQuery({
            query: fetchingRef.current!,
            callback: ({ data, error }) => {
                if (data) {
                    const event = data.pop();
                    if (event) {
                        setEvents((ev) => [event, ...ev]);
                    }
                }
                if (error) {
                    console.error(
                        "Dojo.js - useHistoricalEventsQuery - error subscribing to events with query : ",
                        query.toString()
                    );
                    console.error(error);
                }
            },
            historical: true,
        });

        setEvents(initialData);

        return subscription;
    }, [query, subscriptionRef]);

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
                        "Dojo.js - useHistoricalEventsQuery - error fetching events for query ",
                        JSON.stringify(query)
                    );
                    console.error(err);
                })
                .finally(() => {
                    // Important to release lock at this point.
                    isUpdating.current = false;
                });
        }

        return () => {
            if (subscriptionRef.current) {
                // subscriptionRef.current?.cancel();
                // subscriptionRef.current = null;
                // setSub(null);
            }
        };
    }, [query, subscriptionRef, fetchData]);

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
