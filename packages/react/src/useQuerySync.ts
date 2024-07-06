import { Component, Metadata, Schema } from "@dojoengine/recs";
import { useCallback, useEffect } from "react";
import {
    Client,
    PatternMatching,
    Subscription,
} from "@dojoengine/torii-client";
import { getSyncEntities } from "@dojoengine/state";

export function useQuerySync<S extends Schema>(
    toriiClient: Client,
    components: Component<S, Metadata, undefined>[],
    models: string[],
    keys: string[],
    patternMatching: PatternMatching = "VariableLen"
) {
    const setupSync = useCallback(async () => {
        try {
            const sync = await getSyncEntities(toriiClient, components, {
                Keys: {
                    keys,
                    models,
                    pattern_matching: patternMatching,
                },
            });

            return sync;
        } catch (error) {
            throw error;
        }
    }, [toriiClient, components, keys, patternMatching]);

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
