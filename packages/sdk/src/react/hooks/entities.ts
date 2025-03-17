import { useDojoSDK } from "../hooks";
import { createSubscriptionHook } from "./hooks";
import type { SchemaType, ToriiQueryBuilder } from "../../types";

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
