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
                                        message: "Failed to subscribe to events",
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
