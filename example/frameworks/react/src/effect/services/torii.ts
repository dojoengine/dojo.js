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
        fn: (client: BaseToriiGrpcClient) => T
    ) => Effect.Effect<Awaited<T>, ToriiGrpcClientError>;
}

export class ToriiGrpcClient extends Effect.Service<ToriiGrpcClient>()(
    "ToriiGrpcClient",
    {
        effect: Effect.gen(function* () {
            const client = new BaseToriiGrpcClient({
                toriiUrl: dojoConfig.toriiUrl,
                worldAddress: dojoConfig.manifest.world.address,
            });
            return {
                use: <T>(
                    fn: (client: BaseToriiGrpcClient) => T
                ): Effect.Effect<Awaited<T>, ToriiGrpcClientError> =>
                    Effect.tryPromise({
                        try: async () => await fn(client),
                        catch: (e) =>
                            new ToriiGrpcClientError({
                                cause: e,
                                message: "Torii gRPC Client Error",
                            }),
                    }) as Effect.Effect<Awaited<T>, ToriiGrpcClientError>,
            } satisfies ToriiGrpcClientImpl;
        }),
    }
) {}

export { dojoConfig };
