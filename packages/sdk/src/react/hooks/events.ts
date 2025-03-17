import { useDojoSDK } from "../hooks";
import { createSubscriptionHook } from "./hooks";
import type { SchemaType, ToriiQueryBuilder } from "../../types";
import { useState } from "react";
import type { StandardizedQueryResult } from "../../types";

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
