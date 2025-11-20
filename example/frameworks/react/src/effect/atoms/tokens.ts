import { Atom } from "@effect-atom/atom-react";
import { Effect, Stream, Schedule } from "effect";
import type { ToriiGrpcClient as BaseToriiGrpcClient } from "@dojoengine/grpc";
import type { TokenQuery, Tokens } from "@dojoengine/torii-client";
import {
    ToriiGrpcClient,
    ToriiGrpcClientError,
    makeToriiLayer,
} from "../services/torii";
import manifest from "../../../../../../worlds/dojo-starter/manifest_dev.json" with {
    type: "json",
};

const toriiRuntime = Atom.runtime(
    makeToriiLayer(
        { manifest },
        { autoReconnect: false, maxReconnectAttempts: 5 }
    )
);

export function createTokenQueryAtom(query: TokenQuery) {
    return toriiRuntime
        .atom(
            Effect.gen(function* () {
                const { use } = yield* ToriiGrpcClient;
                return yield* use((client: BaseToriiGrpcClient) =>
                    client.getTokens(query)
                );
            })
        )
        .pipe(Atom.keepAlive);
}

export function createTokenUpdatesAtom(
    contractAddresses: string[] | null | undefined = null,
    tokenIds: string[] | null | undefined = null
) {
    return toriiRuntime
        .atom(
            Stream.unwrap(
                Effect.gen(function* () {
                    const { client } = yield* ToriiGrpcClient;

                    const stream = Stream.asyncPush<
                        unknown,
                        ToriiGrpcClientError
                    >((emit) =>
                        Effect.acquireRelease(
                            Effect.tryPromise({
                                try: () =>
                                    client.onTokenUpdated(
                                        contractAddresses,
                                        tokenIds,
                                        (token: unknown) => {
                                            emit.single(token);
                                        },
                                        (error) => {
                                            emit.fail(
                                                new ToriiGrpcClientError({
                                                    cause: error,
                                                    message:
                                                        "Token subscription stream error",
                                                })
                                            );
                                        }
                                    ),
                                catch: (error) =>
                                    new ToriiGrpcClientError({
                                        cause: error,
                                        message: "Failed to subscribe to tokens",
                                    }),
                            }),
                            (subscription: unknown) =>
                                Effect.sync(() =>
                                    (subscription as { cancel: () => void }).cancel()
                                )
                        )
                    );

                    return stream.pipe(
                        Stream.scan([] as unknown[], (tokens, token) => {
                            return [...tokens, token];
                        })
                    );
                })
            ).pipe(Stream.retry(Schedule.exponential("1 second", 2))),
            { initialValue: [] as unknown[] }
        )
        .pipe(Atom.keepAlive);
}
