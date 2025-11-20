import { Atom } from "@effect-atom/atom-react";
import { Effect, Stream, Schedule, Duration } from "effect";
import type { ToriiGrpcClient as BaseToriiGrpcClient } from "@dojoengine/grpc";
import type { TokenBalanceQuery, TokenBalances } from "@dojoengine/torii-client";
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

export function createTokenBalanceQueryAtom(query: TokenBalanceQuery) {
    return toriiRuntime
        .atom(
            Effect.gen(function* () {
                const { use } = yield* ToriiGrpcClient;
                return yield* use((client: BaseToriiGrpcClient) =>
                    client.getTokenBalances(query)
                );
            })
        )
        .pipe(Atom.keepAlive);
}

export function createTokenBalanceUpdatesAtom(query: TokenBalanceQuery) {
    return toriiRuntime
        .atom(
            Stream.unwrap(
                Effect.gen(function* () {
                    const { use } = yield* ToriiGrpcClient;

                    return Stream.asyncScoped<TokenBalances, never>((emit) =>
                        Effect.gen(function* () {
                            const fetchBalances = (): Promise<void> =>
                                use((client: BaseToriiGrpcClient) =>
                                    client.getTokenBalances(query)
                                )
                                    .pipe(
                                        Effect.runPromise
                                    )
                                    .then((balances) => emit.single(balances));

                            yield* Effect.promise(fetchBalances);
                            const interval = setInterval(
                                fetchBalances,
                                5000
                            );
                            return yield* Effect.addFinalizer(() =>
                                Effect.sync(() => clearInterval(interval))
                            );
                        })
                    );
                })
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
