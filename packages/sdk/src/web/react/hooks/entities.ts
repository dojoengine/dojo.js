import { useDojoSDK } from "../hooks";
import { createSubscriptionHook } from "./hooks";
import type { SchemaType, ToriiQueryBuilder } from "../../../internal/types";

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
        processInitialData: (data) => {
            state.mergeEntities(data);
        },
        processUpdateData: (data) => {
            if (data) {
                const entities = data.filter(
                    (e) => Number.parseInt(e.entityId, 16) !== 0
                );

                const entity = entities[0];
                if (entity) {
                    state.updateEntity(entity);
                }
            }
        },
        getErrorPrefix: () => "Dojo.js - useEntityQuery",
        historical: false,
    });

    useEntityQueryHook(query);
}
