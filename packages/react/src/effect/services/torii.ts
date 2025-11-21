import { makeToriiClient, type ToriiClient } from "@dojoengine/grpc";
import { createDojoConfig } from "@dojoengine/core";
import type { DojoConfig } from "@dojoengine/core";
import { Effect, Data, Layer, Context } from "effect";

export class ToriiGrpcClientError extends Data.TaggedError(
    "ToriiGrpcClientError"
)<{
    cause?: unknown;
    message?: string;
}> {}

export interface DojoConfigParams {
    manifest: any;
    rpcUrl?: string;
    toriiUrl?: string;
    masterAddress?: string;
    masterPrivateKey?: string;
    accountClassHash?: string;
    feeTokenAddress?: string;
}

export interface ToriiClientConfig {
    toriiUrl?: string;
    worldAddress?: string;
    autoReconnect?: boolean;
    maxReconnectAttempts?: number;
}

export interface DojoConfigServiceImpl {
    readonly dojoConfig: DojoConfig;
    readonly toriiClientConfig: ToriiClientConfig;
}

export class DojoConfigService extends Context.Tag("DojoConfigService")<
    DojoConfigService,
    DojoConfigServiceImpl
>() {}

export interface ToriiGrpcClientImpl {
    use: <T>(
        fn: (client: ToriiClient) => PromiseLike<T>
    ) => Effect.Effect<T, ToriiGrpcClientError>;
    client: ToriiClient;
}

export class ToriiGrpcClient extends Effect.Service<ToriiGrpcClient>()(
    "ToriiGrpcClient",
    {
        effect: Effect.gen(function* () {
            const { dojoConfig, toriiClientConfig } =
                yield* DojoConfigService;
            const client = makeToriiClient({
                toriiUrl:
                    toriiClientConfig.toriiUrl ?? dojoConfig.toriiUrl,
                worldAddress:
                    toriiClientConfig.worldAddress ??
                    dojoConfig.manifest.world.address,
                autoReconnect: toriiClientConfig.autoReconnect ?? true,
                maxReconnectAttempts:
                    toriiClientConfig.maxReconnectAttempts ?? 5,
            });
            return {
                use: <T>(
                    fn: (client: ToriiClient) => PromiseLike<T>
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

export function makeDojoConfigLayer(
    params: DojoConfigParams,
    toriiClientConfig: ToriiClientConfig = {}
): Layer.Layer<DojoConfigService> {
    return Layer.succeed(DojoConfigService, {
        dojoConfig: createDojoConfig(params),
        toriiClientConfig,
    });
}

export function makeToriiLayer(
    params: DojoConfigParams,
    toriiClientConfig: ToriiClientConfig = {}
): Layer.Layer<ToriiGrpcClient> {
    const configLayer = makeDojoConfigLayer(params, toriiClientConfig);
    return Layer.provide(ToriiGrpcClient.Default, configLayer);
}
