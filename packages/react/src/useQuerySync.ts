import { useCallback, useEffect } from "react";
import { Component, Metadata, Schema } from "@dojoengine/recs";
import { getSyncEntities } from "@dojoengine/state";
import {
    Clause,
    EntityKeysClause,
    Subscription,
    ToriiClient,
} from "@dojoengine/torii-client";

/**
 * Synchronizes entities with their components.
 * @param toriiClient - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param entityKeyClause - An array of EntityKeysClause objects for subscribing to specifying entity keys.
 * @param clause - Optional clause for filtering fetched entities.
 *
 * @example
 *
 * useQuerySync(toriiClient, contractComponents, [
 *     {
 *         keys: [BigInt(account?.account.address).toString()],
 *         models: ["Position", "Moves", "DirectionsAvailable"],
 *     },
 * ]);
 */
export function useQuerySync<S extends Schema>(
    toriiClient: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause[],
    clause?: Clause | undefined
) {
    const setupSync = useCallback(async () => {
        try {
            return await getSyncEntities(
                toriiClient,
                components,
                clause,
                entityKeyClause
            );
        } catch (error) {
            throw error;
        }
    }, [toriiClient, components]);

    useEffect(() => {
        let unsubscribe: Subscription | undefined;

        setupSync()
            .then((sync) => {
                unsubscribe = sync;
            })
            .catch((error) => {
                console.error("Error setting up entity sync:", error);
            });

        return () => {
            if (unsubscribe) {
                unsubscribe.cancel();
                console.log("Sync unsubscribed");
            }
        };
    }, [setupSync]);
}
