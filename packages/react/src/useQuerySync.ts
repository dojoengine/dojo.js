import { Component, Metadata, Schema } from "@dojoengine/recs";
import { useCallback, useEffect } from "react";
import {
    Client,
    EntityKeysClause,
    Subscription,
} from "@dojoengine/torii-client";
import { getSyncEntities } from "@dojoengine/state";

/**
 * Synchronizes entities with their components.
 * @param toriiClient - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param models - An array of models to synchronize.
 * @param keys - An array of keys to synchronize.
 * @param patternMatching - The pattern matching strategy to use (default: "VariableLen").
 *
 * @example
 *
 * useQuerySync(toriiClient, contractComponents, [
 *     {
 *         Keys: {
 *             keys: [BigInt(account?.account.address).toString()],
 *             models: ["Position", "Moves", "DirectionsAvailable"],
 *             pattern_matching: "FixedLen",
 *         },
 *     },
 * ]);
 */
export function useQuerySync<S extends Schema>(
    toriiClient: Client,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause[]
) {
    const setupSync = useCallback(async () => {
        try {
            return await getSyncEntities(
                toriiClient,
                components,
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
