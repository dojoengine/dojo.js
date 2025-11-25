import { Atom } from "@effect-atom/atom-react";
import { Effect, Stream, Schedule } from "effect";
import type { ToriiClient } from "@dojoengine/grpc";
import type { KeysClause, Pagination } from "@dojoengine/torii-client";
import { ToriiGrpcClient, ToriiGrpcClientError } from "../services/torii";

export function createEventQueryAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    query: {
        keys?: KeysClause;
        pagination?: Pagination;
    }
) {
    return runtime
        .atom(
            Effect.gen(function* () {
                const { use } = yield* ToriiGrpcClient;
                return yield* use((client: ToriiClient) =>
                    client.getEvents(query)
                );
            }).pipe(Effect.withSpan("atom.eventQuery"))
        )
        .pipe(Atom.keepAlive);
}

export function createEventUpdatesAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    clauses: KeysClause[]
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
                                    client.onStarknetEvent(
                                        clauses,
                                        (event: unknown) => {
                                            emit.single(event);
                                        },
                                        (error) => {
                                            emit.fail(
                                                new ToriiGrpcClientError({
                                                    cause: error,
                                                    message:
                                                        "Event subscription stream error",
                                                })
                                            );
                                        }
                                    ),
                                catch: (error) =>
                                    new ToriiGrpcClientError({
                                        cause: error,
                                        message:
                                            "Failed to subscribe to events",
                                    }),
                            });
                            yield* Effect.addFinalizer(() =>
                                Effect.sync(() => subscription.cancel())
                            );
                        })
                    );

                    return stream.pipe(
                        Stream.scan([] as unknown[], (events, event) => {
                            return [...events, event];
                        })
                    );
                }).pipe(Effect.withSpan("atom.eventUpdates"))
            ).pipe(Stream.retry(Schedule.exponential("1 second", 2))),
            { initialValue: [] as unknown[] }
        )
        .pipe(Atom.keepAlive);
}

export interface EventsInfiniteState {
    items: any[];
    cursor?: string;
    hasMore: boolean;
    isLoading: boolean;
    error?: ToriiGrpcClientError;
}

/**
 * Creates an infinite scroll atom for events with cursor-based pagination.
 *
 * @example
 * ```tsx
 * const { stateAtom, loadMoreAtom } = createEventsInfiniteScrollAtom(
 *   toriiRuntime,
 *   { keys: KeysClause([], [], "VariableLen").build() },
 *   20
 * );
 *
 * function EventsList() {
 *   const state = useAtomValue(stateAtom);
 *   const loadMore = useAtomSet(loadMoreAtom);
 *
 *   return (
 *     <div>
 *       {state.items.map((event, i) => <div key={i}>{JSON.stringify(event)}</div>)}
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
export function createEventsInfiniteScrollAtom(
    runtime: Atom.AtomRuntime<ToriiGrpcClient>,
    baseQuery: { keys?: KeysClause },
    limit = 20
) {
    const initialState: EventsInfiniteState = {
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
                const { use } = yield* ToriiGrpcClient;

                return yield* use((client: ToriiClient) =>
                    client.getEvents({
                        ...baseQuery,
                        pagination: {
                            limit,
                            cursor: currentState.cursor,
                            direction: "Forward",
                            order_by: [],
                        },
                    })
                );
            }).pipe(
                Effect.catchAll((error) =>
                    Effect.gen(function* () {
                        const clientError =
                            error instanceof ToriiGrpcClientError
                                ? error
                                : new ToriiGrpcClientError({
                                      cause: error,
                                      message: "Failed to load more events",
                                  });

                        yield* Atom.set(stateAtom, {
                            ...currentState,
                            isLoading: false,
                            error: clientError,
                        });

                        return yield* Effect.fail(clientError);
                    })
                ),
                Effect.withSpan("atom.eventsInfiniteScroll.loadMore")
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
