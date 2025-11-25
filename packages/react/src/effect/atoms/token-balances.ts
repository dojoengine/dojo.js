import { Atom } from "@effect-atom/atom-react";
import { Effect, Stream } from "effect";
import type { ToriiClient } from "@dojoengine/grpc";
import type {
    TokenBalanceQuery,
    TokenBalances,
    TokenBalance,
} from "@dojoengine/torii-client";
import { ToriiGrpcClient, ToriiGrpcClientError } from "../services/torii";
import type { DataFormatters } from "../formatters";
import { mergeFormatters } from "../formatters";

function applyTokenBalanceFormatters(
    balances: TokenBalance[],
    formatters: DataFormatters | undefined
): TokenBalance[] {
    if (!formatters || !formatters.tokenBalances) {
        return balances;
    }

    return balances.map((balance) => {
        const formatter = formatters.tokenBalances![balance.contract_address];
        if (!formatter) {
            return balance;
        }

        try {
            return formatter(balance);
        } catch (error) {
            console.error(
                `[DataFormatter] Token balance formatter error for ${balance.contract_address}:`,
                error
            );
            return balance;
        }
    });
}

export function createTokenBalanceQueryAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    query: TokenBalanceQuery,
    formatters?: DataFormatters
): ReturnType<Atom.AtomRuntime<ToriiGrpcClient>["atom"]> {
    return runtime
        .atom(
            Effect.gen(function* () {
                const { use, formatters: runtimeFormatters } =
                    yield* ToriiGrpcClient;
                const mergedFormatters = mergeFormatters(
                    runtimeFormatters,
                    formatters
                );
                const balances = yield* use((client: ToriiClient) =>
                    client.getTokenBalances(query)
                );
                return {
                    ...balances,
                    items: applyTokenBalanceFormatters(
                        balances.items,
                        mergedFormatters
                    ),
                };
            }).pipe(Effect.withSpan("atom.tokenBalanceQuery"))
        )
        .pipe(Atom.keepAlive);
}

export function createTokenBalanceUpdatesAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    query: TokenBalanceQuery,
    pollingIntervalMs: number = 5000,
    formatters?: DataFormatters
): ReturnType<Atom.AtomRuntime<ToriiGrpcClient>["atom"]> {
    return runtime
        .atom(
            Stream.unwrap(
                Effect.gen(function* () {
                    const { use, formatters: runtimeFormatters } =
                        yield* ToriiGrpcClient;
                    const mergedFormatters = mergeFormatters(
                        runtimeFormatters,
                        formatters
                    );

                    return Stream.asyncScoped<
                        TokenBalances,
                        ToriiGrpcClientError
                    >((emit) =>
                        Effect.gen(function* () {
                            const fetchBalances = () =>
                                use((client: ToriiClient) =>
                                    client.getTokenBalances(query)
                                ).pipe(
                                    Effect.map((balances) => {
                                        emit.single({
                                            ...balances,
                                            items: applyTokenBalanceFormatters(
                                                balances.items,
                                                mergedFormatters
                                            ),
                                        });
                                    })
                                );

                            yield* fetchBalances();
                            const interval = setInterval(
                                () => Effect.runPromise(fetchBalances()),
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

export interface TokenBalancesInfiniteState {
    items: TokenBalance[];
    cursor?: string;
    hasMore: boolean;
    isLoading: boolean;
    error?: ToriiGrpcClientError;
}

/**
 * Creates an infinite scroll atom for token balances with cursor-based pagination.
 *
 * @example
 * ```tsx
 * const { stateAtom, loadMoreAtom } = createTokenBalancesInfiniteScrollAtom(
 *   toriiRuntime,
 *   { account_addresses: ["0x123"], contract_addresses: ["0x456"] },
 *   20
 * );
 *
 * function TokenBalancesList() {
 *   const state = useAtomValue(stateAtom);
 *   const loadMore = useAtomSet(loadMoreAtom);
 *
 *   return (
 *     <div>
 *       {state.items.map((balance, i) => (
 *         <div key={i}>{balance.account_address}: {balance.balance}</div>
 *       ))}
 *       {state.hasMore && (
 *         <button onClick={loadMore} disabled={state.isLoading}>
 *           {state.isLoading ? "Loading..." : "Load More"}
 *         </button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function createTokenBalancesInfiniteScrollAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    baseQuery: Omit<TokenBalanceQuery, "pagination">,
    limit = 20,
    formatters?: DataFormatters
) {
    const initialState: TokenBalancesInfiniteState = {
        items: [],
        cursor: undefined,
        hasMore: true,
        isLoading: false,
        error: undefined,
    };

    const stateAtom = Atom.make(initialState).pipe(Atom.keepAlive);

    const loadMoreAtom = runtime.fn(
        Effect.fnUntraced(function* () {
            const currentState = yield* Atom.get(stateAtom);

            if (!currentState.hasMore || currentState.isLoading) {
                return;
            }

            yield* Atom.set(stateAtom, {
                ...currentState,
                isLoading: true,
                error: undefined,
            });

            const result = yield* Effect.gen(function* () {
                const { use, formatters: runtimeFormatters } =
                    yield* ToriiGrpcClient;
                const mergedFormatters = mergeFormatters(
                    runtimeFormatters,
                    formatters
                );

                const balances = yield* use((client: ToriiClient) =>
                    client.getTokenBalances({
                        ...baseQuery,
                        pagination: {
                            limit,
                            cursor: currentState.cursor,
                            direction: "Forward",
                            order_by: [],
                        },
                    })
                );

                return {
                    ...balances,
                    items: applyTokenBalanceFormatters(
                        balances.items,
                        mergedFormatters
                    ),
                };
            }).pipe(
                Effect.catchAll((error) =>
                    Effect.gen(function* () {
                        const clientError =
                            error instanceof ToriiGrpcClientError
                                ? error
                                : new ToriiGrpcClientError({
                                      cause: error,
                                      message:
                                          "Failed to load more token balances",
                                  });

                        yield* Atom.set(stateAtom, {
                            ...currentState,
                            isLoading: false,
                            error: clientError,
                        });

                        return yield* Effect.fail(clientError);
                    })
                ),
                Effect.withSpan("atom.tokenBalancesInfiniteScroll.loadMore")
            );

            yield* Atom.set(stateAtom, {
                items: [...currentState.items, ...result.items],
                cursor: result.next_cursor,
                hasMore: !!result.next_cursor,
                isLoading: false,
                error: undefined,
            });
        })
    );

    return { stateAtom, loadMoreAtom };
}
