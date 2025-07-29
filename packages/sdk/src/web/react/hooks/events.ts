import { useState } from "react";
import type {
    ParsedEntity,
    SchemaType,
    ToriiQueryBuilder,
} from "../../../internal/types";
import { useDojoSDK } from "../hooks";
import { createSubscriptionHook } from "./hooks";

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
        queryToHashedKeysMethod: (query) => query.getClause()._unsafeUnwrap(),
        processInitialData: (data) => {
            state.mergeEntities(data);
        },
        processUpdateData: (data) => {
            if (data) {
                const evts = data.filter(
                    (e) => Number.parseInt(e.entityId, 16) !== 0
                );
                const event = evts[0];
                if (event) {
                    state.updateEntity(event);
                }
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
    const [events, setEvents] = useState<ParsedEntity<Schema>[]>([]);

    const useHistoricalEventsQueryHook = createSubscriptionHook<Schema, true>({
        subscribeMethod: (options) => sdk.subscribeEventQuery(options),
        updateSubscriptionMethod: (subscription, clause) =>
            sdk.updateEventMessageSubscription(subscription, clause, true),
        queryToHashedKeysMethod: (query) => query.getClause()._unsafeUnwrap(),
        processInitialData: (data) => {
            setEvents(data);
        },
        processUpdateData: (data) => {
            if (data) {
                const evts = data.filter(
                    (e) => Number.parseInt(e.entityId, 16) !== 0
                );
                setEvents((ev) => [...evts, ...ev]);
            }
        },
        getErrorPrefix: () => "Dojo.js - useHistoricalEventsQuery",
        historical: true,
    });

    useHistoricalEventsQueryHook(query);

    return events;
}
