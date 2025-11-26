import { Effect, Stream, Fiber, pipe, Console } from "effect";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import {
    trace,
    type Span as OtelSpan,
    SpanStatusCode,
} from "@opentelemetry/api";
import type {
    Query,
    Clause,
    Entity,
    Entities,
    Token,
    Tokens,
    Transaction,
    Transactions,
    Controllers,
    ControllerQuery,
    TokenQuery,
    TokenBalanceQuery,
    TokenBalances,
    TokenContracts,
    TokenTransfers,
    TokenContractQuery,
    TokenTransferQuery,
    TransactionQuery,
    TransactionFilter,
    KeysClause,
    Message,
    WasmU256,
    Pagination,
    AggregationQuery as ToriiAggregationQuery,
    ActivityQuery as ToriiActivityQuery,
    AchievementQuery as ToriiAchievementQuery,
    PlayerAchievementQuery as ToriiPlayerAchievementQuery,
} from "@dojoengine/torii-wasm";

import type {
    AggregationsPage,
    ActivitiesPage,
    AchievementsPage,
    PlayerAchievementsPage,
    SqlQueryResponse,
    SearchQueryInput,
    SearchResultsView,
} from "./types";

import type { KeysClause as GrpcKeysClause } from "./generated/types";
import {
    PatternMatching as GrpcPatternMatching,
    ContractType,
} from "./generated/types";

import {
    createRetrieveEntitiesRequest,
    createRetrieveEventMessagesRequest,
    createRetrieveTokensRequest,
    createRetrieveTokenBalancesRequest,
    createRetrieveTokenContractsRequest,
    createRetrieveTokenTransfersRequest,
    createRetrieveControllersRequest,
    createRetrieveTransactionsRequest,
    createRetrieveEventsRequest,
    createRetrieveContractsRequest,
    createRetrieveAggregationsRequest,
    createRetrieveActivitiesRequest,
    createRetrieveAchievementsRequest,
    createRetrievePlayerAchievementsRequest,
    createSearchRequest,
    mapTransactionFilter,
    mapClause,
} from "./mappings/query";

import {
    mapEntitiesResponse,
    mapControllersResponse,
    mapTokensResponse,
    mapTokenBalancesResponse,
    mapTokenContractsResponse,
    mapTokenTransfersResponse,
    mapTransactionsResponse,
    mapMessage,
    mapTransaction,
    mapEntity,
    mapToken,
    mapTokenBalance,
    mapTokenTransfer,
    mapEventsResponse,
    mapContractsResponse,
    mapWorldMetadataResponse,
    mapWorldsResponse,
    mapEvent,
    mapContract,
    mapAggregationsResponse,
    mapAggregationEntry,
    mapActivitiesResponse,
    mapActivity,
    mapAchievementsResponse,
    mapPlayerAchievementsResponse,
    mapSqlQueryResponse,
    mapSearchResponse,
} from "./mappings/types";

import { addAddressPadding } from "starknet";
import { DojoGrpcClient } from "./client";
import type { PublishMessageBatchRequest } from "./generated/world";

import type { WorldClientEffect } from "./services/world-client-effect";
import { makeWorldClientEffect } from "./services/world-client-effect";
import * as Errors from "./services/errors";
import {
    mapGrpcError,
    mapTransformError,
    mapSubscriptionError,
} from "./services/error-mappers";

function serializeForTelemetry(obj: unknown, maxLen = 500): string {
    if (obj === null || obj === undefined) return "";
    try {
        const str = JSON.stringify(obj, (_, value) => {
            if (value instanceof Uint8Array) {
                return `<bytes:${value.length}>`;
            }
            return value;
        });
        return str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
    } catch {
        return "<non-serializable>";
    }
}

function hexToBuffer(hex: string): Uint8Array {
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
    }
    return bytes;
}

function bufferToHex(buffer: Uint8Array): string {
    return (
        "0x" +
        Array.from(buffer)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
    );
}

interface ToriiSubscription {
    readonly id: bigint;
    stream?: ServerStreamingCall<object, object>;
    readonly cancel: () => void;
    lastMessage?: object;
}

export class Subscription {
    constructor(private readonly _subscription: ToriiSubscription) {}

    cancel() {
        this._subscription.cancel();
    }

    free() {
        this._subscription.cancel();
    }

    [Symbol.dispose]() {
        this._subscription.cancel();
    }

    get id(): bigint {
        return this._subscription.id;
    }
}

export interface ToriiClientConfig {
    readonly toriiUrl: string;
    readonly worldAddress: string;
    readonly autoReconnect?: boolean;
    readonly maxReconnectAttempts?: number;
}

export interface ToriiClient {
    readonly getEntities: (query: Query) => Promise<Entities>;
    readonly getAllEntities: (
        limit: number,
        cursor?: string | null
    ) => Promise<Entities>;
    readonly getEventMessages: (query: Query) => Promise<Entities>;
    readonly getControllers: (query: ControllerQuery) => Promise<Controllers>;
    readonly getTransactions: (
        query: TransactionQuery
    ) => Promise<Transactions>;
    readonly getTokens: (query: TokenQuery) => Promise<Tokens>;
    readonly getTokenBalances: (
        query: TokenBalanceQuery
    ) => Promise<TokenBalances>;
    readonly getTokenContracts: (
        query: TokenContractQuery
    ) => Promise<TokenContracts>;
    readonly getTokenTransfers: (
        query: TokenTransferQuery
    ) => Promise<TokenTransfers>;
    readonly getAchievements: (
        query: ToriiAchievementQuery
    ) => Promise<AchievementsPage>;
    readonly getPlayerAchievements: (
        query: ToriiPlayerAchievementQuery
    ) => Promise<PlayerAchievementsPage>;
    readonly getWorldMetadata: () => Promise<any>;
    readonly getWorlds: (worldAddresses?: string[]) => Promise<any[]>;
    readonly getEvents: (query: {
        keys?: KeysClause;
        pagination?: Pagination;
    }) => Promise<any>;
    readonly getContracts: (query?: {
        contract_addresses?: string[];
        contract_types?: ContractType[];
    }) => Promise<any>;
    readonly getAggregations: (
        query: ToriiAggregationQuery
    ) => Promise<AggregationsPage>;
    readonly getActivities: (
        query: ToriiActivityQuery
    ) => Promise<ActivitiesPage>;
    readonly search: (query: SearchQueryInput) => Promise<SearchResultsView>;
    readonly executeSql: (query: string) => Promise<SqlQueryResponse>;
    readonly publishMessage: (message: Message) => Promise<string>;
    readonly publishMessageBatch: (messages: Message[]) => Promise<string[]>;
    readonly onEntityUpdated: (
        clause: Clause | null | undefined,
        world_addresses: string[] | null | undefined,
        callback: Function,
        onError?: (error: Error) => void
    ) => Promise<Subscription>;
    readonly onTokenUpdated: (
        contract_addresses: string[] | null | undefined,
        token_ids: WasmU256[] | null | undefined,
        callback: Function,
        onError?: (error: Error) => void
    ) => Promise<Subscription>;
    readonly onTransaction: (
        filter: TransactionFilter | null | undefined,
        callback: Function
    ) => Promise<Subscription>;
    readonly onStarknetEvent: (
        clauses: KeysClause[],
        callback: Function,
        onError?: (error: Error) => void
    ) => Promise<Subscription>;
    readonly destroy: () => void;
}

export const makeToriiClient = (config: ToriiClientConfig): ToriiClient => {
    const grpcClient = new DojoGrpcClient({ url: config.toriiUrl });
    const baseWorldClientEffect = makeWorldClientEffect(grpcClient.worldClient);

    // Wrap worldClientEffect to map all errors to ToriiError
    const worldClientEffect = {
        ...baseWorldClientEffect,
        retrieveEntities: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveEntities(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveEntities", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveEventMessages: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveEventMessages(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveEventMessages", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveControllers: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveControllers(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveControllers", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveTransactions: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveTransactions(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveTransactions", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveTokens: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveTokens(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveTokens", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveTokenBalances: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveTokenBalances(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveTokenBalances", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveTokenContracts: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveTokenContracts(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveTokenContracts", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveTokenTransfers: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveTokenTransfers(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveTokenTransfers", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveEvents: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveEvents(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveEvents", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveContracts: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveContracts(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveContracts", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveAggregations: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveAggregations(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveAggregations", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveActivities: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveActivities(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveActivities", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrieveAchievements: (req: any) =>
            pipe(
                baseWorldClientEffect.retrieveAchievements(req),
                Effect.mapError((e) =>
                    mapGrpcError("retrieveAchievements", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        retrievePlayerAchievements: (req: any) =>
            pipe(
                baseWorldClientEffect.retrievePlayerAchievements(req),
                Effect.mapError((e) =>
                    mapGrpcError(
                        "retrievePlayerAchievements",
                        config.toriiUrl
                    )(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        worlds: (req: any) =>
            pipe(
                baseWorldClientEffect.worlds(req),
                Effect.mapError((e) =>
                    mapGrpcError("worlds", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        search: (req: any) =>
            pipe(
                baseWorldClientEffect.search(req),
                Effect.mapError((e) =>
                    mapGrpcError("search", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        executeSql: (req: any) =>
            pipe(
                baseWorldClientEffect.executeSql(req),
                Effect.mapError((e) =>
                    mapGrpcError("executeSql", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        publishMessage: (req: any) =>
            pipe(
                baseWorldClientEffect.publishMessage(req),
                Effect.mapError((e) =>
                    mapGrpcError("publishMessage", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
        publishMessageBatch: (req: any) =>
            pipe(
                baseWorldClientEffect.publishMessageBatch(req),
                Effect.mapError((e) =>
                    mapGrpcError("publishMessageBatch", config.toriiUrl)(e)
                )
            ) as Effect.Effect<any, Errors.ToriiError, never>,
    };

    const otelTracer = trace.getTracer("torii-client");

    const worldAddress = addAddressPadding(config.worldAddress) ?? undefined;
    const worldAddressBytes = worldAddress
        ? hexToBuffer(worldAddress)
        : undefined;
    const defaultWorldAddresses = worldAddressBytes ? [worldAddressBytes] : [];

    const state = {
        subscriptions: new Map<bigint, ToriiSubscription>(),
        nextId: 1n,
    };

    const cloneWorldAddresses = (addresses: Uint8Array[]): Uint8Array[] =>
        addresses.map((addr) => new Uint8Array(addr));

    const normalizeWorldAddresses = (
        addresses?: string[] | null
    ): Uint8Array[] => {
        if (addresses && addresses.length > 0) {
            return addresses.map((address) => hexToBuffer(address));
        }
        return cloneWorldAddresses(defaultWorldAddresses);
    };

    const ensureWorldAddressesList = (
        list?: Uint8Array[] | null
    ): Uint8Array[] => {
        if (list && list.length > 0) {
            return list;
        }
        return cloneWorldAddresses(defaultWorldAddresses);
    };

    const traceStreamMessage = <A>(
        operation: string,
        subscriptionId: number,
        getMessage: (data: A) => string
    ): (<E, R>(stream: Stream.Stream<A, E, R>) => Stream.Stream<A, E, R>) =>
        Stream.tap((data) =>
            Effect.sync(() => {
                const span = otelTracer.startSpan(`torii.${operation}.message`);
                span.setAttribute("torii.url", config.toriiUrl);
                span.setAttribute("torii.world_address", worldAddress || "");
                span.setAttribute("torii.operation", `${operation}.message`);
                span.setAttribute("torii.subscription.id", subscriptionId);
                span.setAttribute("torii.message", getMessage(data));
                span.setStatus({ code: SpanStatusCode.OK });
                span.end();
            })
        );

    const isNetworkError = (error: unknown): boolean => {
        if (!(error instanceof Error)) return false;
        const message = error.message.toLowerCase();
        return (
            message.includes("network") ||
            message.includes("fetch") ||
            message.includes("body stream") ||
            message.includes("connection")
        );
    };

    const createStreamSubscription = <
        TReq extends object,
        TRes extends object,
    >(options: {
        createStream: () => ServerStreamingCall<TReq, TRes>;
        onMessage: (data: TRes) => void;
        onError?: (error: Error) => void;
        onReconnect?: () => void;
        subscriptionId: bigint;
        operation: string;
    }): Effect.Effect<Fiber.RuntimeFiber<void, never>, never, never> => {
        const autoReconnect = config.autoReconnect ?? true;
        const maxReconnectAttempts = config.maxReconnectAttempts ?? 5;

        let reconnectAttempts = 0;
        let lastMessage: TRes | undefined = undefined;
        let currentCall: ServerStreamingCall<TReq, TRes> | null = null;

        const setupStream = (isReconnect: boolean) => {
            const call = options.createStream();
            currentCall = call;

            call.responses.onMessage((message: TRes) => {
                reconnectAttempts = 0;
                lastMessage = message;
                options.onMessage(message);
            });

            call.responses.onError((error: Error) => {
                const isNetwork = isNetworkError(error);

                const errorSpan = otelTracer.startSpan(
                    `torii.${options.operation}.error`
                );
                errorSpan.setAttribute(
                    "torii.subscription.id",
                    Number(options.subscriptionId)
                );
                errorSpan.setAttribute("torii.url", config.toriiUrl);
                errorSpan.setAttribute(
                    "torii.world_address",
                    worldAddress || ""
                );
                errorSpan.setAttribute("torii.operation", options.operation);
                errorSpan.setAttribute("torii.error.message", error.message);
                errorSpan.setAttribute("torii.error.is_network", isNetwork);
                errorSpan.setAttribute(
                    "torii.reconnect.attempt",
                    reconnectAttempts
                );
                errorSpan.setAttribute(
                    "torii.reconnect.max_attempts",
                    maxReconnectAttempts
                );

                if (
                    isNetwork &&
                    autoReconnect &&
                    reconnectAttempts < maxReconnectAttempts
                ) {
                    reconnectAttempts++;
                    const delay = Math.pow(2, reconnectAttempts) * 1000;

                    errorSpan.setAttribute("torii.reconnect.delay_ms", delay);
                    errorSpan.setAttribute("torii.reconnect.will_retry", true);
                    errorSpan.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: "Network error, will retry",
                    });
                    errorSpan.end();

                    setTimeout(() => {
                        const reconnectSpan = otelTracer.startSpan(
                            `torii.${options.operation}.reconnect`
                        );
                        reconnectSpan.setAttribute(
                            "torii.subscription.id",
                            Number(options.subscriptionId)
                        );
                        reconnectSpan.setAttribute(
                            "torii.operation",
                            options.operation
                        );
                        reconnectSpan.setAttribute(
                            "torii.reconnect.attempt",
                            reconnectAttempts
                        );
                        reconnectSpan.setAttribute(
                            "torii.reconnect.replaying_last_message",
                            !!lastMessage
                        );

                        if (options.onReconnect) {
                            options.onReconnect();
                        }
                        if (lastMessage) {
                            options.onMessage(lastMessage);
                        }
                        setupStream(true);

                        reconnectSpan.setStatus({ code: SpanStatusCode.OK });
                        reconnectSpan.end();
                    }, delay);
                } else {
                    errorSpan.setAttribute("torii.reconnect.will_retry", false);
                    errorSpan.setAttribute("torii.error.final", true);
                    errorSpan.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: error.message,
                    });
                    errorSpan.end();

                    if (options.onError) {
                        options.onError(error);
                    } else {
                        console.error(
                            `[torii] Stream error (subscription ${options.subscriptionId}):`,
                            error
                        );
                    }
                }
            });

            call.responses.onComplete(() => {});
        };

        return Effect.gen(function* () {
            setupStream(false);
            // Keep the fiber alive indefinitely
            yield* Effect.never;
        }).pipe(Effect.forkDaemon);
    };

    const runQuery = <A, E extends Errors.ToriiError>(
        createEffect: (span: OtelSpan) => Effect.Effect<A, E>,
        method: string
    ): Promise<A> =>
        otelTracer.startActiveSpan(
            `torii.${method}`,
            async (span: OtelSpan) => {
                try {
                    span.setAttribute("torii.url", config.toriiUrl);
                    span.setAttribute(
                        "torii.world_address",
                        worldAddress || ""
                    );
                    span.setAttribute("torii.operation", method);
                    const result = await pipe(
                        createEffect(span),
                        Effect.mapError((error) =>
                            error instanceof Error
                                ? mapGrpcError(method, config.toriiUrl)(error)
                                : error
                        ),
                        Effect.runPromise
                    );
                    span.setStatus({ code: SpanStatusCode.OK });
                    return result;
                } catch (error) {
                    const errorMessage =
                        error instanceof Error ? error.message : String(error);
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message: errorMessage,
                    });

                    span.setAttribute("torii.error.message", errorMessage);

                    // Add detailed error attributes
                    if (error && typeof error === "object" && "_tag" in error) {
                        span.setAttribute(
                            "torii.error.type",
                            String(error._tag)
                        );
                    } else {
                        span.setAttribute("torii.error.type", "Unknown");
                    }

                    if (
                        error instanceof Errors.ToriiGrpcError &&
                        error.code !== undefined
                    ) {
                        span.setAttribute("torii.error.grpc_code", error.code);
                    }

                    if (error instanceof Errors.ToriiNetworkError) {
                        span.setAttribute(
                            "torii.error.retryable",
                            error.retryable
                        );
                        span.setAttribute("torii.error.url", error.url);
                    }

                    if (error instanceof Errors.ToriiTransformError) {
                        span.setAttribute(
                            "torii.error.transformer",
                            error.transformer
                        );
                    }

                    throw error;
                } finally {
                    span.end();
                }
            }
        );

    return {
        getEntities: (query: Query) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => createRetrieveEntitiesRequest(query)),
                        Effect.tap((req) =>
                            Effect.sync(() => {
                                if (req.query) {
                                    req.query.world_addresses =
                                        ensureWorldAddressesList(
                                            req.query.world_addresses
                                        );
                                }
                                span.setAttributes({
                                    "torii.input.clause": serializeForTelemetry(
                                        query.clause
                                    ),
                                    "torii.input.models": serializeForTelemetry(
                                        query.models
                                    ),
                                    "torii.input.pagination.limit":
                                        query.pagination?.limit ?? 0,
                                    "torii.input.pagination.cursor":
                                        query.pagination?.cursor ?? "",
                                    "torii.input.historical":
                                        query.historical ?? false,
                                });
                            })
                        ),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveEntities(req)
                        ),
                        Effect.flatMap((response) =>
                            Effect.try({
                                try: () => mapEntitiesResponse(response),
                                catch: mapTransformError("mapEntitiesResponse"),
                            })
                        ),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttribute(
                                    "torii.response.count",
                                    Object.keys(result).length
                                );
                            })
                        )
                    ),
                "getEntities"
            ),

        getAllEntities: (limit: number, cursor?: string | null) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttributes({
                                "torii.input.pagination.limit": limit,
                                "torii.input.pagination.cursor": cursor ?? "",
                            });
                            return {
                                pagination: {
                                    limit,
                                    cursor: cursor || undefined,
                                    direction: "Forward" as const,
                                    order_by: [],
                                },
                                clause: undefined,
                                no_hashed_keys: true,
                                models: [],
                                historical: false,
                                world_addresses: [],
                            };
                        }),
                        Effect.flatMap((query: Query) =>
                            pipe(
                                Effect.sync(() =>
                                    createRetrieveEntitiesRequest(query)
                                ),
                                Effect.tap((req) =>
                                    Effect.sync(() => {
                                        if (req.query) {
                                            req.query.world_addresses =
                                                ensureWorldAddressesList(
                                                    req.query.world_addresses
                                                );
                                        }
                                    })
                                ),
                                Effect.flatMap((req) =>
                                    worldClientEffect.retrieveEntities(req)
                                ),
                                Effect.map(mapEntitiesResponse)
                            )
                        ),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttribute(
                                    "torii.response.count",
                                    Object.keys(result).length
                                );
                            })
                        )
                    ),
                "getAllEntities"
            ),

        getEventMessages: (query: Query) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() =>
                            createRetrieveEventMessagesRequest(query)
                        ),
                        Effect.tap((req) =>
                            Effect.sync(() => {
                                if (req.query) {
                                    req.query.world_addresses =
                                        ensureWorldAddressesList(
                                            req.query.world_addresses
                                        );
                                }
                                span.setAttributes({
                                    "torii.input.clause": serializeForTelemetry(
                                        query.clause
                                    ),
                                    "torii.input.models": serializeForTelemetry(
                                        query.models
                                    ),
                                    "torii.input.pagination.limit":
                                        query.pagination?.limit ?? 0,
                                    "torii.input.pagination.cursor":
                                        query.pagination?.cursor ?? "",
                                    "torii.input.historical":
                                        query.historical ?? false,
                                });
                            })
                        ),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveEventMessages(req)
                        ),
                        Effect.map(mapEntitiesResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttribute(
                                    "torii.response.count",
                                    Object.keys(result).length
                                );
                            })
                        )
                    ),
                "getEventMessages"
            ),

        getControllers: (query: ControllerQuery) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrieveControllersRequest(query);
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveControllers(req)
                        ),
                        Effect.map(mapControllersResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttribute(
                                    "torii.response.count",
                                    Object.keys(result).length
                                );
                            })
                        )
                    ),
                "getControllers"
            ),

        getTransactions: (query: TransactionQuery) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrieveTransactionsRequest(query);
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveTransactions(req)
                        ),
                        Effect.map(mapTransactionsResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttributes({
                                    "torii.response.count": result.items.length,
                                    "torii.response.cursor":
                                        result.next_cursor ?? "",
                                });
                            })
                        )
                    ),
                "getTransactions"
            ),

        getTokens: (query: TokenQuery) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return {
                                ...query,
                                attribute_filters:
                                    query.attribute_filters ?? [],
                            };
                        }),
                        Effect.map(createRetrieveTokensRequest),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveTokens(req)
                        ),
                        Effect.map(mapTokensResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttributes({
                                    "torii.response.count": result.items.length,
                                    "torii.response.cursor":
                                        result.next_cursor ?? "",
                                });
                            })
                        )
                    ),
                "getTokens"
            ),

        getTokenBalances: (query: TokenBalanceQuery) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrieveTokenBalancesRequest(query);
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveTokenBalances(req)
                        ),
                        Effect.map(mapTokenBalancesResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttributes({
                                    "torii.response.count": result.items.length,
                                    "torii.response.cursor":
                                        result.next_cursor ?? "",
                                });
                            })
                        )
                    ),
                "getTokenBalances"
            ),

        getTokenContracts: (query: TokenContractQuery) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrieveTokenContractsRequest(query);
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveTokenContracts(req)
                        ),
                        Effect.map(mapTokenContractsResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttributes({
                                    "torii.response.count": result.items.length,
                                    "torii.response.cursor":
                                        result.next_cursor ?? "",
                                });
                            })
                        )
                    ),
                "getTokenContracts"
            ),

        getTokenTransfers: (query: TokenTransferQuery) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrieveTokenTransfersRequest(query);
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveTokenTransfers(req)
                        ),
                        Effect.map(mapTokenTransfersResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttributes({
                                    "torii.response.count": result.items.length,
                                    "torii.response.cursor":
                                        result.next_cursor ?? "",
                                });
                            })
                        )
                    ),
                "getTokenTransfers"
            ),

        getAchievements: (query: ToriiAchievementQuery) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrieveAchievementsRequest(query);
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveAchievements(req)
                        ),
                        Effect.map(mapAchievementsResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttributes({
                                    "torii.response.count": result.items.length,
                                    "torii.response.cursor":
                                        result.nextCursor ?? "",
                                });
                            })
                        )
                    ),
                "getAchievements"
            ),

        getPlayerAchievements: (query: ToriiPlayerAchievementQuery) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrievePlayerAchievementsRequest(
                                query
                            );
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrievePlayerAchievements(req)
                        ),
                        Effect.map(mapPlayerAchievementsResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttributes({
                                    "torii.response.count": result.items.length,
                                    "torii.response.cursor":
                                        result.nextCursor ?? "",
                                });
                            })
                        )
                    ),
                "getPlayerAchievements"
            ),

        getWorldMetadata: () =>
            runQuery(
                () =>
                    pipe(
                        Effect.sync(() => ({
                            world_addresses: cloneWorldAddresses(
                                defaultWorldAddresses
                            ),
                        })),
                        Effect.flatMap((req) => worldClientEffect.worlds(req)),
                        Effect.map((response) =>
                            mapWorldMetadataResponse(response, worldAddress)
                        )
                    ),
                "getWorldMetadata"
            ),

        getWorlds: (worldAddresses?: string[]) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.world_addresses",
                                serializeForTelemetry(worldAddresses)
                            );
                            return {
                                world_addresses: worldAddresses
                                    ? worldAddresses.map((address) =>
                                          hexToBuffer(
                                              addAddressPadding(address)
                                          )
                                      )
                                    : [],
                            };
                        }),
                        Effect.flatMap((req) => worldClientEffect.worlds(req)),
                        Effect.map(mapWorldsResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttribute(
                                    "torii.response.count",
                                    result.length
                                );
                            })
                        )
                    ),
                "getWorlds"
            ),

        getEvents: (query: { keys?: KeysClause; pagination?: Pagination }) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrieveEventsRequest(query);
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveEvents(req)
                        ),
                        Effect.map(mapEventsResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttributes({
                                    "torii.response.count":
                                        result.events?.length ?? 0,
                                    "torii.response.cursor":
                                        result.cursor ?? "",
                                });
                            })
                        )
                    ),
                "getEvents"
            ),

        getContracts: (query?: {
            contract_addresses?: string[];
            contract_types?: ContractType[];
        }) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrieveContractsRequest(query || {});
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveContracts(req)
                        ),
                        Effect.map(mapContractsResponse),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttribute(
                                    "torii.response.count",
                                    result.length
                                );
                            })
                        )
                    ),
                "getContracts"
            ),

        getAggregations: (query: ToriiAggregationQuery) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrieveAggregationsRequest(query);
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveAggregations(req)
                        ),
                        Effect.map(
                            (response) =>
                                mapAggregationsResponse(
                                    response
                                ) as AggregationsPage
                        ),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttributes({
                                    "torii.response.count": result.items.length,
                                    "torii.response.cursor":
                                        result.nextCursor ?? "",
                                });
                            })
                        )
                    ),
                "getAggregations"
            ),

        getActivities: (query: ToriiActivityQuery) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                serializeForTelemetry(query)
                            );
                            return createRetrieveActivitiesRequest(query);
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.retrieveActivities(req)
                        ),
                        Effect.flatMap((response) =>
                            Effect.try({
                                try: () =>
                                    mapActivitiesResponse(
                                        response
                                    ) as ActivitiesPage,
                                catch: mapTransformError(
                                    "mapActivitiesResponse"
                                ),
                            })
                        ),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttributes({
                                    "torii.response.count": result.items.length,
                                    "torii.response.cursor":
                                        result.nextCursor ?? "",
                                });
                            })
                        )
                    ),
                "getActivities"
            ),

        search: (query: SearchQueryInput) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttributes({
                                "torii.input.query": query.query,
                                "torii.input.limit": query.limit ?? 0,
                            });
                            return createSearchRequest(
                                query.query,
                                query.limit
                            );
                        }),
                        Effect.flatMap((req) => worldClientEffect.search(req)),
                        Effect.flatMap((response) =>
                            Effect.try({
                                try: () => mapSearchResponse(response),
                                catch: mapTransformError("mapSearchResponse"),
                            })
                        ),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttribute(
                                    "torii.response.count",
                                    result.results?.length ?? 0
                                );
                            })
                        )
                    ),
                "search"
            ),

        executeSql: (query: string) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            span.setAttribute(
                                "torii.input.query",
                                query.length > 500
                                    ? query.slice(0, 500) + "..."
                                    : query
                            );
                            return { query };
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.executeSql(req)
                        ),
                        Effect.flatMap((response) =>
                            Effect.try({
                                try: () => mapSqlQueryResponse(response),
                                catch: mapTransformError("mapSqlQueryResponse"),
                            })
                        ),
                        Effect.tap((result) =>
                            Effect.sync(() => {
                                span.setAttribute(
                                    "torii.response.row_count",
                                    result.length
                                );
                            })
                        )
                    ),
                "executeSql"
            ),

        publishMessage: (message: Message) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            if (!worldAddressBytes) {
                                throw new Errors.ToriiValidationError({
                                    message:
                                        "World address is required to publish messages",
                                    field: "worldAddress",
                                    expected: "valid world address",
                                });
                            }
                            span.setAttribute(
                                "torii.input.message",
                                serializeForTelemetry(message)
                            );
                            return {
                                ...mapMessage(message),
                                world_address: new Uint8Array(
                                    worldAddressBytes
                                ),
                            };
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.publishMessage(req)
                        ),
                        Effect.flatMap((response: any) =>
                            Effect.succeed(response.id as string)
                        ),
                        Effect.tap((id) =>
                            Effect.sync(() => {
                                span.setAttribute(
                                    "torii.response.message_id",
                                    id
                                );
                            })
                        )
                    ),
                "publishMessage"
            ),

        publishMessageBatch: (messages: Message[]) =>
            runQuery(
                (span) =>
                    pipe(
                        Effect.sync(() => {
                            if (!worldAddressBytes) {
                                throw new Errors.ToriiValidationError({
                                    message:
                                        "World address is required to publish messages",
                                    field: "worldAddress",
                                    expected: "valid world address",
                                });
                            }
                            span.setAttribute(
                                "torii.input.message_count",
                                messages.length
                            );
                            return {
                                messages: messages.map((message) => ({
                                    ...mapMessage(message),
                                    world_address: new Uint8Array(
                                        worldAddressBytes
                                    ),
                                })),
                            } as PublishMessageBatchRequest;
                        }),
                        Effect.flatMap((req) =>
                            worldClientEffect.publishMessageBatch(req)
                        ),
                        Effect.flatMap((response: any) =>
                            Effect.succeed(
                                response.responses.map(
                                    (r: any) => r.id as string
                                )
                            )
                        ),
                        Effect.tap((ids) =>
                            Effect.sync(() => {
                                span.setAttribute(
                                    "torii.response.message_count",
                                    ids.length
                                );
                            })
                        )
                    ),
                "publishMessageBatch"
            ),

        onEntityUpdated: (clause, world_addresses, callback, onError) => {
            const subscriptionId = state.nextId++;
            const worldAddressesBytes =
                normalizeWorldAddresses(world_addresses);

            const program = createStreamSubscription({
                createStream: () =>
                    grpcClient.worldClient.subscribeEntities({
                        clause: clause ? mapClause(clause) : undefined,
                        world_addresses: worldAddressesBytes,
                    }),
                onMessage: (response) => {
                    if (response.entity) {
                        try {
                            const entity = mapEntity(response.entity);
                            callback(entity);
                        } catch (error) {
                            const mappedError = mapSubscriptionError(
                                "update",
                                subscriptionId
                            )(error);

                            const span = otelTracer.startSpan(
                                "torii.subscribeEntities.mapping_error"
                            );
                            span.setAttribute(
                                "torii.subscription.id",
                                Number(subscriptionId)
                            );
                            span.setAttribute(
                                "torii.operation",
                                "subscribeEntities"
                            );
                            span.setAttribute(
                                "torii.error.type",
                                mappedError._tag
                            );
                            span.setAttribute(
                                "torii.error.message",
                                mappedError.message
                            );
                            span.setAttribute(
                                "torii.error.transformer",
                                "mapEntity"
                            );
                            span.setStatus({
                                code: SpanStatusCode.ERROR,
                                message: mappedError.message,
                            });
                            span.end();

                            if (onError) {
                                onError(mappedError);
                            }
                        }
                    }
                },
                onError,
                subscriptionId,
                operation: "subscribeEntities",
            });

            return pipe(
                program,
                Effect.map((fiber) => {
                    const subscription = new Subscription({
                        id: subscriptionId,
                        cancel: () => {
                            Effect.runFork(Fiber.interrupt(fiber));
                            state.subscriptions.delete(subscriptionId);
                        },
                    });
                    state.subscriptions.set(subscriptionId, subscription);
                    return subscription;
                }),
                Effect.withSpan("torii.subscribeEntities", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "subscribeEntities",
                        "torii.subscription.id": Number(subscriptionId),
                    },
                }),
                Effect.runPromise
            );
        },

        onTokenUpdated: (contract_addresses, token_ids, callback, onError) => {
            const subscriptionId = state.nextId++;

            const program = createStreamSubscription({
                createStream: () =>
                    grpcClient.worldClient.subscribeTokens({
                        contract_addresses:
                            contract_addresses?.map(hexToBuffer) || [],
                        token_ids: token_ids?.map(hexToBuffer) || [],
                    }),
                onMessage: (response) => {
                    if (response.token) {
                        try {
                            const token = mapToken(response.token);
                            callback(token);
                        } catch (error) {
                            const mappedError = mapSubscriptionError(
                                "update",
                                subscriptionId
                            )(error);

                            const span = otelTracer.startSpan(
                                "torii.subscribeTokens.mapping_error"
                            );
                            span.setAttribute(
                                "torii.subscription.id",
                                Number(subscriptionId)
                            );
                            span.setAttribute(
                                "torii.operation",
                                "subscribeTokens"
                            );
                            span.setAttribute(
                                "torii.error.type",
                                mappedError._tag
                            );
                            span.setAttribute(
                                "torii.error.message",
                                mappedError.message
                            );
                            span.setAttribute(
                                "torii.error.transformer",
                                "mapToken"
                            );
                            span.setStatus({
                                code: SpanStatusCode.ERROR,
                                message: mappedError.message,
                            });
                            span.end();

                            if (onError) {
                                onError(mappedError);
                            }
                        }
                    }
                },
                onError,
                subscriptionId,
                operation: "subscribeTokens",
            });

            return pipe(
                program,
                Effect.map((fiber) => {
                    const subscription = new Subscription({
                        id: subscriptionId,
                        cancel: () => {
                            Effect.runFork(Fiber.interrupt(fiber));
                            state.subscriptions.delete(subscriptionId);
                        },
                    });
                    state.subscriptions.set(subscriptionId, subscription);
                    return subscription;
                }),
                Effect.withSpan("torii.subscribeTokens", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "subscribeTokens",
                        "torii.subscription.id": Number(subscriptionId),
                    },
                }),
                Effect.runPromise
            );
        },

        onTransaction: (filter, callback) => {
            const subscriptionId = state.nextId++;

            const program = createStreamSubscription({
                createStream: () =>
                    grpcClient.worldClient.subscribeTransactions({
                        filter: filter
                            ? mapTransactionFilter(filter)
                            : undefined,
                    }),
                onMessage: (response) => {
                    if (response.transaction) {
                        try {
                            const transaction = mapTransaction(
                                response.transaction
                            );
                            callback(transaction);
                        } catch (error) {
                            const mappedError = mapSubscriptionError(
                                "update",
                                subscriptionId
                            )(error);

                            const span = otelTracer.startSpan(
                                "torii.subscribeTransactions.mapping_error"
                            );
                            span.setAttribute(
                                "torii.subscription.id",
                                Number(subscriptionId)
                            );
                            span.setAttribute(
                                "torii.operation",
                                "subscribeTransactions"
                            );
                            span.setAttribute(
                                "torii.error.type",
                                mappedError._tag
                            );
                            span.setAttribute(
                                "torii.error.message",
                                mappedError.message
                            );
                            span.setAttribute(
                                "torii.error.transformer",
                                "mapTransaction"
                            );
                            span.setStatus({
                                code: SpanStatusCode.ERROR,
                                message: mappedError.message,
                            });
                            span.end();
                        }
                    }
                },
                subscriptionId,
                operation: "subscribeTransactions",
            });

            return pipe(
                program,
                Effect.map((fiber) => {
                    const subscription = new Subscription({
                        id: subscriptionId,
                        cancel: () => {
                            Effect.runFork(Fiber.interrupt(fiber));
                            state.subscriptions.delete(subscriptionId);
                        },
                    });
                    state.subscriptions.set(subscriptionId, subscription);
                    return subscription;
                }),
                Effect.withSpan("torii.subscribeTransactions", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "subscribeTransactions",
                        "torii.subscription.id": Number(subscriptionId),
                    },
                }),
                Effect.runPromise
            );
        },

        onStarknetEvent: (clauses, callback, onError) => {
            const subscriptionId = state.nextId++;

            const grpcClauses: GrpcKeysClause[] = clauses.map((clause) => ({
                keys: clause.keys.map((k) =>
                    k ? hexToBuffer(k) : new Uint8Array()
                ),
                pattern_matching:
                    clause.pattern_matching === "FixedLen"
                        ? GrpcPatternMatching.FixedLen
                        : GrpcPatternMatching.VariableLen,
                models: clause.models,
            }));

            const program = createStreamSubscription({
                createStream: () =>
                    grpcClient.worldClient.subscribeEvents({
                        keys: grpcClauses,
                    }),
                onMessage: (response) => {
                    if (response.event) {
                        try {
                            const event = {
                                keys: response.event.keys.map(bufferToHex),
                                data: response.event.data.map(bufferToHex),
                                transaction_hash: bufferToHex(
                                    response.event.transaction_hash
                                ),
                            };
                            callback(event);
                        } catch (error) {
                            const mappedError = mapSubscriptionError(
                                "update",
                                subscriptionId
                            )(error);

                            const span = otelTracer.startSpan(
                                "torii.subscribeEvents.mapping_error"
                            );
                            span.setAttribute(
                                "torii.subscription.id",
                                Number(subscriptionId)
                            );
                            span.setAttribute(
                                "torii.operation",
                                "subscribeEvents"
                            );
                            span.setAttribute(
                                "torii.error.type",
                                mappedError._tag
                            );
                            span.setAttribute(
                                "torii.error.message",
                                mappedError.message
                            );
                            span.setAttribute(
                                "torii.error.transformer",
                                "bufferToHex"
                            );
                            span.setStatus({
                                code: SpanStatusCode.ERROR,
                                message: mappedError.message,
                            });
                            span.end();

                            if (onError) {
                                onError(mappedError);
                            }
                        }
                    }
                },
                onError,
                subscriptionId,
                operation: "subscribeEvents",
            });

            return pipe(
                program,
                Effect.map((fiber) => {
                    const subscription = new Subscription({
                        id: subscriptionId,
                        cancel: () => {
                            Effect.runFork(Fiber.interrupt(fiber));
                            state.subscriptions.delete(subscriptionId);
                        },
                    });
                    state.subscriptions.set(subscriptionId, subscription);
                    return subscription;
                }),
                Effect.withSpan("torii.subscribeEvents", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "subscribeEvents",
                        "torii.subscription.id": Number(subscriptionId),
                    },
                }),
                Effect.runPromise
            );
        },

        destroy: () => {
            state.subscriptions.forEach((sub) => sub.cancel());
            state.subscriptions.clear();
            grpcClient.destroy();
        },
    };
};
