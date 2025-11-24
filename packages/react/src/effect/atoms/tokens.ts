import { Atom } from "@effect-atom/atom-react";
import { Effect, Stream, Schedule, Console } from "effect";
import type { ToriiClient } from "@dojoengine/grpc";
import type { TokenQuery } from "@dojoengine/torii-client";
import { ToriiGrpcClient, ToriiGrpcClientError } from "../services/torii";

export function createTokenQueryAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    query: TokenQuery
) {
    return runtime
        .atom(
            Effect.gen(function* () {
                const { use } = yield* ToriiGrpcClient;
                return yield* use((client: ToriiClient) =>
                    client.getTokens(query)
                );
            }).pipe(Effect.withSpan("atom.tokenQuery"))
        )
        .pipe(Atom.keepAlive);
}

export function createTokenUpdatesAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    contractAddresses: string[] | null | undefined = null,
    tokenIds: string[] | null | undefined = null
) {
    return runtime
        .atom(
            Stream.unwrap(
                Effect.gen(function* () {
                    const { client } = yield* ToriiGrpcClient;

                    const stream = Stream.asyncScoped<
                        unknown,
                        ToriiGrpcClientError
                    >((emit) =>
                        Effect.gen(function* () {
                            const subscription = yield* Effect.tryPromise({
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
                                        message:
                                            "Failed to subscribe to tokens",
                                    }),
                            });
                            yield* Effect.addFinalizer(() =>
                                Effect.sync(() => subscription.cancel())
                            );
                        })
                    );

                    return stream.pipe(
                        Stream.scan([] as unknown[], (tokens, token) => {
                            return [...tokens, token];
                        })
                    );
                }).pipe(Effect.withSpan("atom.tokenUpdates"))
            ).pipe(Stream.retry(Schedule.exponential("1 second", 2))),
            { initialValue: [] as unknown[] }
        )
        .pipe(Atom.keepAlive);
}
