import { Atom } from "@effect-atom/atom-react";
import { Effect, Stream, Schedule } from "effect";
import type { ToriiClient } from "@dojoengine/grpc";
import type { TokenQuery, Token } from "@dojoengine/torii-client";
import { ToriiGrpcClient, ToriiGrpcClientError } from "../services/torii";
import type { DataFormatters } from "../formatters";
import { mergeFormatters } from "../formatters";

export interface TokensInfiniteState {
    items: Token[];
    cursor?: string;
    hasMore: boolean;
    isLoading: boolean;
    error?: ToriiGrpcClientError;
}

function applyTokenFormatters(
    tokens: Token[],
    formatters: DataFormatters | undefined
) {
    if (!formatters || !formatters.tokens) {
        return tokens;
    }

    return tokens.map((token) => {
        const formatter = formatters.tokens![token.contract_address];
        if (!formatter) {
            return token;
        }

        try {
            return formatter(token);
        } catch (error) {
            console.error(
                `[DataFormatter] Token formatter error for ${token.contract_address}:`,
                error
            );
            return token;
        }
    });
}

export function createTokenQueryAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    query: TokenQuery,
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
                const tokens = yield* use((client: ToriiClient) =>
                    client.getTokens(query)
                );
                return {
                    ...tokens,
                    items: applyTokenFormatters(tokens.items, mergedFormatters),
                };
            }).pipe(Effect.withSpan("atom.tokenQuery"))
        )
        .pipe(Atom.keepAlive);
}

export function createTokenUpdatesAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    contractAddresses: string[] | null | undefined = null,
    tokenIds: string[] | null | undefined = null
): ReturnType<Atom.AtomRuntime<ToriiGrpcClient>["atom"]> {
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

/**
 * Creates an infinite scroll atom for tokens with cursor-based pagination.
 *
 * @example
 * ```tsx
 * const { stateAtom, loadMoreAtom } = createTokensInfiniteScrollAtom(
 *   toriiRuntime,
 *   { contract_addresses: ["0x123"] },
 *   20
 * );
 *
 * function TokensList() {
 *   const state = useAtomValue(stateAtom);
 *   const loadMore = useAtomSet(loadMoreAtom);
 *
 *   return (
 *     <div>
 *       {state.items.map(token => <div key={token.token_id}>{token.name}</div>)}
 *       {state.hasMore && (
 *         <button onClick={loadMore} disabled={state.isLoading}>
 *           {state.isLoading ? "Loading..." : "Load More"}
 *         </button>
 *       )}
 *       {state.error && <div>Error: {state.error.message}</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function createTokensInfiniteScrollAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    baseQuery: Omit<TokenQuery, "pagination">,
    limit = 20,
    formatters?: DataFormatters
) {
    const initialState: TokensInfiniteState = {
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

                const tokens = yield* use((client: ToriiClient) =>
                    client.getTokens({
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
                    ...tokens,
                    items: applyTokenFormatters(tokens.items, mergedFormatters),
                };
            }).pipe(
                Effect.catchAll((error) =>
                    Effect.gen(function* () {
                        const clientError =
                            error instanceof ToriiGrpcClientError
                                ? error
                                : new ToriiGrpcClientError({
                                      cause: error,
                                      message: "Failed to load more tokens",
                                  });

                        yield* Atom.set(stateAtom, {
                            ...currentState,
                            isLoading: false,
                            error: clientError,
                        });

                        return yield* Effect.fail(clientError);
                    })
                ),
                Effect.withSpan("atom.tokensInfiniteScroll.loadMore")
            );

            yield* Atom.set(stateAtom, {
                items: [...currentState.items, ...result.items] as Token[],
                cursor: result.next_cursor,
                hasMore: !!result.next_cursor,
                isLoading: false,
                error: undefined,
            });
        })
    );

    return { stateAtom, loadMoreAtom };
}
