import { ToriiGrpcClient as BaseToriiGrpcClient } from "@dojoengine/grpc";
import { createDojoConfig } from "@dojoengine/core";
import { Effect, Data } from "effect";
import manifest from "../../../../../../worlds/dojo-starter/manifest_dev.json" with {
    type: "json",
};

const dojoConfig = createDojoConfig({
    manifest: manifest,
});

export class ToriiGrpcClientError extends Data.TaggedError(
    "ToriiGrpcClientError"
)<{
    cause?: unknown;
    message?: string;
}> {}

export interface ToriiGrpcClientImpl {
    use: <T>(
        fn: (client: BaseToriiGrpcClient) => PromiseLike<T>
    ) => Effect.Effect<T, ToriiGrpcClientError>;
    client: BaseToriiGrpcClient;
}

export class ToriiGrpcClient extends Effect.Service<ToriiGrpcClient>()(
    "ToriiGrpcClient",
    {
        effect: Effect.gen(function* () {
            const client = new BaseToriiGrpcClient({
                toriiUrl: dojoConfig.toriiUrl,
                worldAddress: dojoConfig.manifest.world.address,
                autoReconnect: false,
            });
            return {
                use: <T>(
                    fn: (client: BaseToriiGrpcClient) => PromiseLike<T>
                ): Effect.Effect<T, ToriiGrpcClientError> =>
                    Effect.tryPromise({
                        try: () => fn(client),
                        catch: (unknown) =>
                            new ToriiGrpcClientError({
                                cause: unknown,
                                message: "Torii gRPC Client Error",
                            }),
                    }),
                client,
            } satisfies ToriiGrpcClientImpl;
        }),
    }
) {}

export { dojoConfig };
