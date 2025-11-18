import { useMemo, useState } from "react";
import { Effect, Context, type ManagedRuntime } from "effect";
import type { ToriiGrpcClient as BaseToriiGrpcClient } from "@dojoengine/grpc";
import type { Clause } from "@dojoengine/torii-client";
import { useStreamSubscription } from "./useSubscription";
import { createEntityUpdateStream } from "../streams/subscriptions";

type Entity = {
    hashed_keys: string;
    models: Record<string, unknown>;
};

type ToriiGrpcClientService = {
    use: <T>(
        fn: (client: BaseToriiGrpcClient) => T
    ) => Effect.Effect<T, unknown>;
};

export function useEntityUpdates<I, S extends ToriiGrpcClientService>(
    runtime: ManagedRuntime.ManagedRuntime<I, never>,
    ToriiGrpcClient: Context.Tag<I, S>,
    clause: Clause | null | undefined,
    worldAddresses: string[] | null | undefined = null
) {
    const [entities, setEntities] = useState<Map<string, Entity>>(new Map());

    const streamEffect = useMemo(
        () => createEntityUpdateStream(ToriiGrpcClient, clause, worldAddresses),
        [ToriiGrpcClient, clause, worldAddresses]
    );

    useStreamSubscription(
        runtime,
        streamEffect,
        ({ entity }) => {
            const e = entity as Entity;
            setEntities((prev) => {
                const next = new Map(prev);
                next.set(e.hashed_keys, e);
                return next;
            });
        },
        [clause, worldAddresses]
    );

    return entities;
}
