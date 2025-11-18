import { Effect, Stream, Chunk, Context } from "effect";
import type { ToriiGrpcClient as BaseToriiGrpcClient, Subscription } from "@dojoengine/grpc";
import type { Clause, TransactionFilter, WasmU256 } from "@dojoengine/torii-client";

type ToriiGrpcClientService = {
    use: <T>(
        fn: (client: BaseToriiGrpcClient) => T
    ) => Effect.Effect<T, unknown>;
};

export const createEntityUpdateStream = <I, S extends ToriiGrpcClientService>(
    ToriiGrpcClient: Context.Tag<I, S>,
    clause: Clause | null | undefined,
    worldAddresses: string[] | null | undefined
): Effect.Effect<Stream.Stream<{ entity: unknown; subscriptionId: bigint }, never, never>, unknown, I> =>
    Effect.gen(function* () {
        const { use } = yield* ToriiGrpcClient;

        return Stream.async<{ entity: unknown; subscriptionId: bigint }, never, never>(
            (emit) => {
                let subscription: Subscription | null = null;

                Effect.runPromise(
                    use((client: BaseToriiGrpcClient) =>
                        client.onEntityUpdated(clause, worldAddresses, (entity: unknown, subscriptionId: bigint) => {
                            emit(Effect.succeed(Chunk.of({ entity, subscriptionId })));
                        })
                    )
                ).then(async (sub) => {
                    subscription = (await sub) as Subscription;
                });

                return Effect.sync(() => {
                    subscription?.cancel();
                });
            }
        );
    });

export const createEventMessageStream = <I, S extends ToriiGrpcClientService>(
    ToriiGrpcClient: Context.Tag<I, S>,
    clause: Clause | null | undefined,
    worldAddresses: string[] | null | undefined
): Effect.Effect<Stream.Stream<{ entity: unknown; subscriptionId: bigint }, never, never>, unknown, I> =>
    Effect.gen(function* () {
        const { use } = yield* ToriiGrpcClient;

        return Stream.async<{ entity: unknown; subscriptionId: bigint }, never, never>(
            (emit) => {
                let subscription: Subscription | null = null;

                Effect.runPromise(
                    use((client: BaseToriiGrpcClient) =>
                        client.onEventMessageUpdated(clause, worldAddresses, (entity: unknown, subscriptionId: bigint) => {
                            emit(Effect.succeed(Chunk.of({ entity, subscriptionId })));
                        })
                    )
                ).then(async (sub) => {
                    subscription = (await sub) as Subscription;
                });

                return Effect.sync(() => {
                    subscription?.cancel();
                });
            }
        );
    });

export const createTokenUpdateStream = <I, S extends ToriiGrpcClientService>(
    ToriiGrpcClient: Context.Tag<I, S>,
    contractAddresses: string[] | null | undefined,
    tokenIds: WasmU256[] | null | undefined
): Effect.Effect<Stream.Stream<{ token: unknown; subscriptionId: bigint }, never, never>, unknown, I> =>
    Effect.gen(function* () {
        const { use } = yield* ToriiGrpcClient;

        return Stream.async<{ token: unknown; subscriptionId: bigint }, never, never>(
            (emit) => {
                let subscription: Subscription | null = null;

                Effect.runPromise(
                    use((client: BaseToriiGrpcClient) =>
                        client.onTokenUpdated(contractAddresses, tokenIds, (token: unknown, subscriptionId: bigint) => {
                            emit(Effect.succeed(Chunk.of({ token, subscriptionId })));
                        })
                    )
                ).then(async (sub) => {
                    subscription = (await sub) as Subscription;
                });

                return Effect.sync(() => {
                    subscription?.cancel();
                });
            }
        );
    });

export const createTransactionStream = <I, S extends ToriiGrpcClientService>(
    ToriiGrpcClient: Context.Tag<I, S>,
    filter: TransactionFilter | null | undefined
): Effect.Effect<Stream.Stream<{ transaction: unknown; subscriptionId: bigint }, never, never>, unknown, I> =>
    Effect.gen(function* () {
        const { use } = yield* ToriiGrpcClient;

        return Stream.async<{ transaction: unknown; subscriptionId: bigint }, never, never>(
            (emit) => {
                let subscription: Subscription | null = null;

                Effect.runPromise(
                    use((client: BaseToriiGrpcClient) =>
                        client.onTransaction(filter, (transaction: unknown, subscriptionId: bigint) => {
                            emit(Effect.succeed(Chunk.of({ transaction, subscriptionId })));
                        })
                    )
                ).then(async (sub) => {
                    subscription = (await sub) as Subscription;
                });

                return Effect.sync(() => {
                    subscription?.cancel();
                });
            }
        );
    });
