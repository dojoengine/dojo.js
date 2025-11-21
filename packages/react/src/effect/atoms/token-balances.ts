import { Atom } from "@effect-atom/atom-react";
import { Effect, Stream } from "effect";
import type { ToriiClient } from "@dojoengine/grpc";
import type { TokenBalanceQuery, TokenBalances } from "@dojoengine/torii-client";
import { ToriiGrpcClient } from "../services/torii";

export function createTokenBalanceQueryAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    query: TokenBalanceQuery
) {
    return runtime
        .atom(
            Effect.gen(function* () {
                const { use } = yield* ToriiGrpcClient;
                return yield* use((client: ToriiClient) =>
                    client.getTokenBalances(query)
                );
            }).pipe(Effect.withSpan("atom.tokenBalanceQuery"))
        )
        .pipe(Atom.keepAlive);
}

export function createTokenBalanceUpdatesAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    query: TokenBalanceQuery,
    pollingIntervalMs: number = 5000
) {
    return runtime
        .atom(
            Stream.unwrap(
                Effect.gen(function* () {
                    const { use } = yield* ToriiGrpcClient;

                    return Stream.asyncScoped<TokenBalances, never>((emit) =>
                        Effect.gen(function* () {
                            const fetchBalances = (): Promise<void> =>
                                use((client: ToriiClient) =>
                                    client.getTokenBalances(query)
                                )
                                    .pipe(Effect.runPromise)
                                    .then((balances) => emit.single(balances));

                            yield* Effect.promise(fetchBalances);
                            const interval = setInterval(
                                fetchBalances,
                                pollingIntervalMs
                            );
                            return yield* Effect.addFinalizer(() =>
                                Effect.sync(() => clearInterval(interval))
                            );
                        })
                    );
                }).pipe(Effect.withSpan("atom.tokenBalanceUpdates"))
            ),
            {
                initialValue: {
                    items: [],
                    next_cursor: undefined,
                } as TokenBalances,
            }
        )
        .pipe(Atom.keepAlive);
}
