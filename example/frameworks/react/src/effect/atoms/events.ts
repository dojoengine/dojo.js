import { Atom } from "@effect-atom/atom-react";
import { Effect, Stream, Schedule } from "effect";
import type { ToriiGrpcClient as BaseToriiGrpcClient } from "@dojoengine/grpc";
import type { KeysClause, Pagination } from "@dojoengine/torii-client";
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

export function createEventQueryAtom(query: {
    keys?: KeysClause;
    pagination?: Pagination;
}) {
    return toriiRuntime
        .atom(
            Effect.gen(function* () {
                const { use } = yield* ToriiGrpcClient;
                return yield* use((client: BaseToriiGrpcClient) =>
                    client.getEvents(query)
                );
            })
        )
        .pipe(Atom.keepAlive);
}

export function createEventUpdatesAtom(clauses: KeysClause[]) {
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
                            }),
                            (subscription: unknown) =>
                                Effect.sync(() =>
                                    (
                                        subscription as { cancel: () => void }
                                    ).cancel()
                                )
                        )
                    );

                    return stream.pipe(
                        Stream.scan([] as unknown[], (events, event) => {
                            return [...events, event];
                        })
                    );
                })
            ).pipe(Stream.retry(Schedule.exponential("1 second", 2))),
            { initialValue: [] as unknown[] }
        )
        .pipe(Atom.keepAlive);
}
