import { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import { ToriiGrpcClient as BaseToriiGrpcClient } from "@dojoengine/grpc";
import { createDojoConfig } from "@dojoengine/core";
import { init, KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { constants } from "starknet";
import manifest from "./manifest_sepolia.json" with { type: "json" };
import { ManagedRuntime, Effect, Data } from "effect";
import { createRuntimeProvider, useStreamSubscription, createEntityUpdateStream } from "./effect";

const dojoConfig = createDojoConfig({
    manifest: manifest,
    toriiUrl: "https://api.cartridge.gg/x/nums-bal/torii",
});

class ToriiGrpcClientError extends Data.TaggedError("ToriiGrpcClientError")<{
    cause?: unknown;
    message?: string;
}> {}

interface ToriiGrpcClientImpl {
    use: <T>(
        fn: (client: BaseToriiGrpcClient) => T
    ) => Effect.Effect<T, ToriiGrpcClientError>;
}

class ToriiGrpcClient extends Effect.Service<ToriiGrpcClient>()(
    "ToriiGrpcClient",
    {
        effect: Effect.gen(function* () {
            const client = new BaseToriiGrpcClient({
                toriiUrl: dojoConfig.toriiUrl,
                worldAddress: dojoConfig.manifest.world.address,
            });
            return {
                use: (fn) =>
                    Effect.gen(function* () {
                        return yield* Effect.tryPromise({
                            try: async () => await fn(client),
                            catch: (e) =>
                                new ToriiGrpcClientError({
                                    cause: e,
                                    message: "Torii gRPC Client Error",
                                }),
                        });
                    }),
            } satisfies ToriiGrpcClientImpl;
        }),
    }
) {}

const ClientRuntime = ManagedRuntime.make(ToriiGrpcClient.Default);

const { RuntimeProvider, useRuntime } = createRuntimeProvider<ToriiGrpcClient>();

const getEntities = Effect.gen(function* () {
    const { use } = yield* ToriiGrpcClient;
    const res = yield* use((client) => client.getAllEntities(10000));
    return res;
});

const getTokens = Effect.gen(function* () {
    const { use } = yield* ToriiGrpcClient;
    const res = yield* use((client) =>
        client.getTokens({
            contract_addresses: [],
            attribute_filters: [],
            token_ids: [],
            pagination: {
                limit: 10,
                cursor: undefined,
                direction: "Forward",
                order_by: [],
            },
        })
    );
    return res;
});

type Entity = {
    hashed_keys: string;
    models: Record<string, unknown>;
};

function EntitySubscriber() {
    const runtime = useRuntime();
    const [entities, setEntities] = useState<Map<string, Entity>>(new Map());

    const streamEffect = createEntityUpdateStream(
        ToriiGrpcClient,
        KeysClause([], [], "VariableLen").build(),
        null
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
            console.log("Entity updated:", e);
        },
        []
    );

    return (
        <div>
            <h2>Entity Updates</h2>
            <p>Entities: {entities.size}</p>
            <ul>
                {Array.from(entities.values()).slice(0, 10).map((entity) => (
                    <li key={entity.hashed_keys}>
                        {entity.hashed_keys.slice(0, 16)}...
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Root({ sdk }: { sdk: unknown }) {
    useEffect(() => {
        ClientRuntime.runPromise(getEntities).then(console.log);
        ClientRuntime.runPromise(getTokens).then(console.log);
    }, []);

    return (
        <RuntimeProvider layer={ToriiGrpcClient.Default}>
            <div>
                <h1>Hello Dojo</h1>
                <EntitySubscriber />
            </div>
        </RuntimeProvider>
    );
}

async function main() {
    const sdk = await init({
        client: {
            toriiUrl: dojoConfig.toriiUrl,
            worldAddress: dojoConfig.manifest.world.address,
        },
        domain: {
            name: "nums",
            version: "1.0",
            chainId: constants.StarknetChainId.SN_SEPOLIA,
            revision: "1",
        },
    });

    const container = document.getElementById("root");
    if (!container) {
        throw new Error("Root element not found");
    }

    createRoot(container).render(<Root sdk={sdk} />);
}

main().catch(console.error);
