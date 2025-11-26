import { Effect, Stream, Context, Layer, Schedule } from "effect";
import type { WorldClient } from "../generated/world.client";
import type {
    RetrieveEntitiesRequest,
    RetrieveEntitiesResponse,
    RetrieveTokensRequest,
    RetrieveTokensResponse,
    RetrieveTokenBalancesRequest,
    RetrieveTokenBalancesResponse,
    RetrieveTokenTransfersRequest,
    RetrieveTokenTransfersResponse,
    RetrieveTransactionsRequest,
    RetrieveTransactionsResponse,
    RetrieveControllersRequest,
    RetrieveControllersResponse,
    RetrieveEventsRequest,
    RetrieveEventsResponse,
    RetrieveContractsRequest,
    RetrieveContractsResponse,
    RetrieveTokenContractsRequest,
    RetrieveTokenContractsResponse,
    RetrieveAggregationsRequest,
    RetrieveAggregationsResponse,
    RetrieveActivitiesRequest,
    RetrieveActivitiesResponse,
    RetrieveAchievementsRequest,
    RetrieveAchievementsResponse,
    RetrievePlayerAchievementsRequest,
    RetrievePlayerAchievementsResponse,
    SubscribeEntitiesRequest,
    SubscribeEntityResponse,
    SubscribeTokensRequest,
    SubscribeTokensResponse,
    SubscribeTokenBalancesRequest,
    SubscribeTokenBalancesResponse,
    SubscribeTokenTransfersRequest,
    SubscribeTokenTransfersResponse,
    SubscribeEventsRequest,
    SubscribeEventsResponse,
    SubscribeTransactionsRequest,
    SubscribeTransactionsResponse,
    SubscribeContractsRequest,
    SubscribeContractsResponse,
    SubscribeAggregationsRequest,
    SubscribeAggregationsResponse,
    SubscribeActivitiesRequest,
    SubscribeActivitiesResponse,
    SubscribeAchievementProgressionsRequest,
    SubscribeAchievementProgressionsResponse,
    UpdateEntitiesSubscriptionRequest,
    UpdateTokenBalancesSubscriptionRequest,
    UpdateTokenSubscriptionRequest,
    UpdateTokenTransfersSubscriptionRequest,
    UpdateAggregationsSubscriptionRequest,
    UpdateActivitiesSubscriptionRequest,
    UpdateAchievementProgressionsSubscriptionRequest,
    PublishMessageRequest,
    PublishMessageResponse,
    PublishMessageBatchRequest,
    PublishMessageBatchResponse,
    WorldsRequest,
    WorldsResponse,
    SearchRequest,
    SearchResponse,
} from "../generated/world";
import type { SqlQueryRequest, SqlQueryResponse } from "../generated/types";
import type { Empty } from "../generated/google/protobuf/empty";
import type { GrpcError } from "./errors";
import { ToriiGrpcError } from "./errors";

export interface WorldClientEffect {
    retrieveEntities(
        request: RetrieveEntitiesRequest
    ): Effect.Effect<RetrieveEntitiesResponse, GrpcError>;

    retrieveEventMessages(
        request: RetrieveEntitiesRequest
    ): Effect.Effect<RetrieveEntitiesResponse, GrpcError>;

    retrieveTokens(
        request: RetrieveTokensRequest
    ): Effect.Effect<RetrieveTokensResponse, GrpcError>;

    retrieveTokenBalances(
        request: RetrieveTokenBalancesRequest
    ): Effect.Effect<RetrieveTokenBalancesResponse, GrpcError>;

    retrieveTokenTransfers(
        request: RetrieveTokenTransfersRequest
    ): Effect.Effect<RetrieveTokenTransfersResponse, GrpcError>;

    retrieveTransactions(
        request: RetrieveTransactionsRequest
    ): Effect.Effect<RetrieveTransactionsResponse, GrpcError>;

    retrieveControllers(
        request: RetrieveControllersRequest
    ): Effect.Effect<RetrieveControllersResponse, GrpcError>;

    retrieveEvents(
        request: RetrieveEventsRequest
    ): Effect.Effect<RetrieveEventsResponse, GrpcError>;

    retrieveContracts(
        request: RetrieveContractsRequest
    ): Effect.Effect<RetrieveContractsResponse, GrpcError>;

    retrieveTokenContracts(
        request: RetrieveTokenContractsRequest
    ): Effect.Effect<RetrieveTokenContractsResponse, GrpcError>;

    retrieveAggregations(
        request: RetrieveAggregationsRequest
    ): Effect.Effect<RetrieveAggregationsResponse, GrpcError>;

    retrieveActivities(
        request: RetrieveActivitiesRequest
    ): Effect.Effect<RetrieveActivitiesResponse, GrpcError>;

    retrieveAchievements(
        request: RetrieveAchievementsRequest
    ): Effect.Effect<RetrieveAchievementsResponse, GrpcError>;

    retrievePlayerAchievements(
        request: RetrievePlayerAchievementsRequest
    ): Effect.Effect<RetrievePlayerAchievementsResponse, GrpcError>;

    worlds(request: WorldsRequest): Effect.Effect<WorldsResponse, GrpcError>;

    search(request: SearchRequest): Effect.Effect<SearchResponse, GrpcError>;

    executeSql(
        request: SqlQueryRequest
    ): Effect.Effect<SqlQueryResponse, GrpcError>;

    publishMessage(
        request: PublishMessageRequest
    ): Effect.Effect<PublishMessageResponse, GrpcError>;

    publishMessageBatch(
        request: PublishMessageBatchRequest
    ): Effect.Effect<PublishMessageBatchResponse, GrpcError>;

    subscribeEntities(
        request: SubscribeEntitiesRequest
    ): Stream.Stream<SubscribeEntityResponse, GrpcError>;

    subscribeEventMessages(
        request: SubscribeEntitiesRequest
    ): Stream.Stream<SubscribeEntityResponse, GrpcError>;

    subscribeTokens(
        request: SubscribeTokensRequest
    ): Stream.Stream<SubscribeTokensResponse, GrpcError>;

    subscribeTokenBalances(
        request: SubscribeTokenBalancesRequest
    ): Stream.Stream<SubscribeTokenBalancesResponse, GrpcError>;

    subscribeTokenTransfers(
        request: SubscribeTokenTransfersRequest
    ): Stream.Stream<SubscribeTokenTransfersResponse, GrpcError>;

    subscribeEvents(
        request: SubscribeEventsRequest
    ): Stream.Stream<SubscribeEventsResponse, GrpcError>;

    subscribeTransactions(
        request: SubscribeTransactionsRequest
    ): Stream.Stream<SubscribeTransactionsResponse, GrpcError>;

    subscribeContracts(
        request: SubscribeContractsRequest
    ): Stream.Stream<SubscribeContractsResponse, GrpcError>;

    subscribeAggregations(
        request: SubscribeAggregationsRequest
    ): Stream.Stream<SubscribeAggregationsResponse, GrpcError>;

    subscribeActivities(
        request: SubscribeActivitiesRequest
    ): Stream.Stream<SubscribeActivitiesResponse, GrpcError>;

    subscribeAchievementProgressions(
        request: SubscribeAchievementProgressionsRequest
    ): Stream.Stream<SubscribeAchievementProgressionsResponse, GrpcError>;

    updateEntitiesSubscription(
        request: UpdateEntitiesSubscriptionRequest
    ): Effect.Effect<Empty, GrpcError>;

    updateEventMessagesSubscription(
        request: UpdateEntitiesSubscriptionRequest
    ): Effect.Effect<Empty, GrpcError>;

    updateTokensSubscription(
        request: UpdateTokenSubscriptionRequest
    ): Effect.Effect<Empty, GrpcError>;

    updateTokenBalancesSubscription(
        request: UpdateTokenBalancesSubscriptionRequest
    ): Effect.Effect<Empty, GrpcError>;

    updateTokenTransfersSubscription(
        request: UpdateTokenTransfersSubscriptionRequest
    ): Effect.Effect<Empty, GrpcError>;

    updateAggregationsSubscription(
        request: UpdateAggregationsSubscriptionRequest
    ): Effect.Effect<Empty, GrpcError>;

    updateActivitiesSubscription(
        request: UpdateActivitiesSubscriptionRequest
    ): Effect.Effect<Empty, GrpcError>;

    updateAchievementProgressionsSubscription(
        request: UpdateAchievementProgressionsSubscriptionRequest
    ): Effect.Effect<Empty, GrpcError>;
}

export const WorldClientEffect = Context.GenericTag<WorldClientEffect>(
    "@services/WorldClientEffect"
);

const isNetworkError = (error: unknown): boolean => {
    if (error instanceof ToriiGrpcError && error.details) {
        const details = error.details;
        if (details instanceof Error) {
            const msg = details.message.toLowerCase();
            return (
                msg.includes("network") ||
                msg.includes("fetch") ||
                msg.includes("body stream") ||
                msg.includes("connection") ||
                msg.includes("timeout")
            );
        }
    }
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        return (
            msg.includes("network") ||
            msg.includes("fetch") ||
            msg.includes("body stream") ||
            msg.includes("connection") ||
            msg.includes("timeout")
        );
    }
    return false;
};

const mapError = (error: unknown): GrpcError => {
    if (error instanceof Error) {
        return new ToriiGrpcError({
            message: error.message,
            method: "unknown",
            details: error,
        });
    }
    return new ToriiGrpcError({
        message: String(error),
        method: "unknown",
        details: error,
    });
};

const retryPolicy = Schedule.exponential("1 seconds").pipe(
    Schedule.compose(Schedule.recurs(5)),
    Schedule.whileInput((error: GrpcError) => isNetworkError(error.details))
);

const wrapUnary =
    <TReq, TRes>(
        fn: (req: TReq) => { response: Promise<TRes> },
        methodName: string
    ) =>
    (request: TReq): Effect.Effect<TRes, GrpcError> =>
        Effect.tryPromise({
            try: () => fn(request).response,
            catch: mapError,
        }).pipe(
            Effect.retry(retryPolicy),
            Effect.withSpan(`dojo.world.v1.WorldService/${methodName}`, {
                attributes: {
                    "rpc.system": "grpc",
                    "rpc.service": "dojo.world.v1.WorldService",
                    "rpc.method": methodName,
                    "network.protocol.name": "grpc",
                },
            })
        );

const wrapStream =
    <TReq, TRes>(
        fn: (req: TReq) => {
            responses: {
                onMessage: (fn: (msg: TRes) => void) => void;
                onError: (fn: (error: Error) => void) => void;
                onComplete: (fn: () => void) => void;
            };
            headers: Promise<any>;
        },
        methodName: string
    ) =>
    (request: TReq): Stream.Stream<TRes, GrpcError> =>
        Stream.asyncScoped<TRes, GrpcError>((emit) =>
            Effect.gen(function* () {
                const call = fn(request);

                call.responses.onMessage((message) => {
                    emit.single(message);
                });

                call.responses.onError((error) => {
                    emit.fail(mapError(error));
                });

                call.responses.onComplete(() => {
                    emit.end();
                });

                return yield* Effect.addFinalizer(() => Effect.sync(() => {}));
            })
        ).pipe(
            Stream.mapEffect((value) =>
                Effect.succeed(value).pipe(
                    Effect.withSpan(
                        `dojo.world.v1.WorldService/${methodName}`,
                        {
                            attributes: {
                                "rpc.system": "grpc",
                                "rpc.service": "dojo.world.v1.WorldService",
                                "rpc.method": methodName,
                                "network.protocol.name": "grpc",
                            },
                        }
                    )
                )
            ),
            Stream.tapError((error) =>
                Effect.withSpan(
                    `dojo.world.v1.WorldService/${methodName}.error`,
                    {
                        kind: 1,
                        attributes: {
                            "rpc.system": "grpc",
                            "rpc.service": "dojo.world.v1.WorldService",
                            "rpc.method": methodName,
                            "error.message":
                                error.details instanceof Error
                                    ? error.details.message
                                    : String(error.details),
                            "error.type":
                                error.details instanceof Error
                                    ? error.details.name
                                    : "GrpcError",
                        },
                    }
                )(Effect.void)
            )
        );

export const makeWorldClientEffect = (
    client: WorldClient
): WorldClientEffect => ({
    retrieveEntities: wrapUnary(
        client.retrieveEntities.bind(client),
        "RetrieveEntities"
    ),
    retrieveEventMessages: wrapUnary(
        client.retrieveEventMessages.bind(client),
        "RetrieveEventMessages"
    ),
    retrieveTokens: wrapUnary(
        client.retrieveTokens.bind(client),
        "RetrieveTokens"
    ),
    retrieveTokenBalances: wrapUnary(
        client.retrieveTokenBalances.bind(client),
        "RetrieveTokenBalances"
    ),
    retrieveTokenTransfers: wrapUnary(
        client.retrieveTokenTransfers.bind(client),
        "RetrieveTokenTransfers"
    ),
    retrieveTransactions: wrapUnary(
        client.retrieveTransactions.bind(client),
        "RetrieveTransactions"
    ),
    retrieveControllers: wrapUnary(
        client.retrieveControllers.bind(client),
        "RetrieveControllers"
    ),
    retrieveEvents: wrapUnary(
        client.retrieveEvents.bind(client),
        "RetrieveEvents"
    ),
    retrieveContracts: wrapUnary(
        client.retrieveContracts.bind(client),
        "RetrieveContracts"
    ),
    retrieveTokenContracts: wrapUnary(
        client.retrieveTokenContracts.bind(client),
        "RetrieveTokenContracts"
    ),
    retrieveAggregations: wrapUnary(
        client.retrieveAggregations.bind(client),
        "RetrieveAggregations"
    ),
    retrieveActivities: wrapUnary(
        client.retrieveActivities.bind(client),
        "RetrieveActivities"
    ),
    retrieveAchievements: wrapUnary(
        client.retrieveAchievements.bind(client),
        "RetrieveAchievements"
    ),
    retrievePlayerAchievements: wrapUnary(
        client.retrievePlayerAchievements.bind(client),
        "RetrievePlayerAchievements"
    ),
    worlds: wrapUnary(client.worlds.bind(client), "Worlds"),
    search: wrapUnary(client.search.bind(client), "Search"),
    executeSql: wrapUnary(client.executeSql.bind(client), "ExecuteSql"),
    publishMessage: wrapUnary(
        client.publishMessage.bind(client),
        "PublishMessage"
    ),
    publishMessageBatch: wrapUnary(
        client.publishMessageBatch.bind(client),
        "PublishMessageBatch"
    ),
    subscribeEntities: wrapStream(
        client.subscribeEntities.bind(client),
        "SubscribeEntities"
    ),
    subscribeEventMessages: wrapStream(
        client.subscribeEventMessages.bind(client),
        "SubscribeEventMessages"
    ),
    subscribeTokens: wrapStream(
        client.subscribeTokens.bind(client),
        "SubscribeTokens"
    ),
    subscribeTokenBalances: wrapStream(
        client.subscribeTokenBalances.bind(client),
        "SubscribeTokenBalances"
    ),
    subscribeTokenTransfers: wrapStream(
        client.subscribeTokenTransfers.bind(client),
        "SubscribeTokenTransfers"
    ),
    subscribeEvents: wrapStream(
        client.subscribeEvents.bind(client),
        "SubscribeEvents"
    ),
    subscribeTransactions: wrapStream(
        client.subscribeTransactions.bind(client),
        "SubscribeTransactions"
    ),
    subscribeContracts: wrapStream(
        client.subscribeContracts.bind(client),
        "SubscribeContracts"
    ),
    subscribeAggregations: wrapStream(
        client.subscribeAggregations.bind(client),
        "SubscribeAggregations"
    ),
    subscribeActivities: wrapStream(
        client.subscribeActivities.bind(client),
        "SubscribeActivities"
    ),
    subscribeAchievementProgressions: wrapStream(
        client.subscribeAchievementProgressions.bind(client),
        "SubscribeAchievementProgressions"
    ),
    updateEntitiesSubscription: wrapUnary(
        client.updateEntitiesSubscription.bind(client),
        "UpdateEntitiesSubscription"
    ),
    updateEventMessagesSubscription: wrapUnary(
        client.updateEventMessagesSubscription.bind(client),
        "UpdateEventMessagesSubscription"
    ),
    updateTokensSubscription: wrapUnary(
        client.updateTokensSubscription.bind(client),
        "UpdateTokensSubscription"
    ),
    updateTokenBalancesSubscription: wrapUnary(
        client.updateTokenBalancesSubscription.bind(client),
        "UpdateTokenBalancesSubscription"
    ),
    updateTokenTransfersSubscription: wrapUnary(
        client.updateTokenTransfersSubscription.bind(client),
        "UpdateTokenTransfersSubscription"
    ),
    updateAggregationsSubscription: wrapUnary(
        client.updateAggregationsSubscription.bind(client),
        "UpdateAggregationsSubscription"
    ),
    updateActivitiesSubscription: wrapUnary(
        client.updateActivitiesSubscription.bind(client),
        "UpdateActivitiesSubscription"
    ),
    updateAchievementProgressionsSubscription: wrapUnary(
        client.updateAchievementProgressionsSubscription.bind(client),
        "UpdateAchievementProgressionsSubscription"
    ),
});

export const WorldClientEffectLive = Layer.effect(
    WorldClientEffect,
    Effect.gen(function* () {
        const client = yield* Effect.sync(() => {
            throw new Error("WorldClient must be provided");
        });
        return makeWorldClientEffect(client);
    })
);
