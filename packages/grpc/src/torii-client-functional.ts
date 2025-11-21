import { Effect, Stream, Fiber, pipe } from "effect";
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
    readonly cancel: () => void;
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
    const worldClientEffect = makeWorldClientEffect(grpcClient.worldClient);
    const otelTracer = trace.getTracer("torii-client");

    const worldAddress = addAddressPadding(config.worldAddress) ?? undefined;
    const worldAddressBytes = worldAddress
        ? hexToBuffer(worldAddress)
        : undefined;
    const defaultWorldAddresses = worldAddressBytes ? [worldAddressBytes] : [];

    const state = {
        subscriptions: new Map<bigint, Subscription>(),
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

    const createStreamSubscription = <A, E>(options: {
        createStream: () => Stream.Stream<A, E>;
        onMessage: (data: A) => void;
        onError?: (error: Error) => void;
        onReconnect?: () => void;
        subscriptionId: bigint;
    }): Effect.Effect<Fiber.RuntimeFiber<void, never>, never, never> => {
        const autoReconnect = config.autoReconnect ?? true;
        const maxReconnectAttempts = config.maxReconnectAttempts ?? 5;

        let reconnectAttempts = 0;
        let lastMessage: A | undefined = undefined;

        const setupStream = (
            isReconnect: boolean
        ): Stream.Stream<A, never> => {
            return pipe(
                options.createStream(),
                Stream.tap((data) =>
                    Effect.sync(() => {
                        reconnectAttempts = 0;
                        lastMessage = data;
                        options.onMessage(data);
                    })
                ),
                Stream.catchAll((error): Stream.Stream<A, never> => {
                    const err =
                        error instanceof Error ? error : new Error(String(error));
                    const isNetwork = isNetworkError(err);

                    if (
                        isNetwork &&
                        autoReconnect &&
                        reconnectAttempts < maxReconnectAttempts
                    ) {
                        reconnectAttempts++;
                        const delay = Math.pow(2, reconnectAttempts) * 1000;

                        return pipe(
                            Effect.sync(() => {
                                console.log(
                                    `[torii] Reconnecting subscription ${options.subscriptionId} (attempt ${reconnectAttempts}/${maxReconnectAttempts}) after ${delay}ms`
                                );
                            }),
                            Effect.flatMap(() => Effect.sleep(delay)),
                            Effect.flatMap(() =>
                                options.onReconnect
                                    ? Effect.sync(options.onReconnect)
                                    : Effect.void
                            ),
                            Effect.flatMap(() =>
                                lastMessage
                                    ? Effect.sync(() =>
                                          options.onMessage(lastMessage!)
                                      )
                                    : Effect.void
                            ),
                            Effect.as(setupStream(true)),
                            Stream.unwrap
                        );
                    } else {
                        if (options.onError) {
                            options.onError(err);
                        } else {
                            console.error(
                                `[torii] Stream error (subscription ${options.subscriptionId}):`,
                                err
                            );
                        }
                        return Stream.empty;
                    }
                })
            );
        };

        return pipe(
            setupStream(false),
            Stream.runDrain,
            Effect.forkDaemon
        );
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
                    span.setStatus({
                        code: SpanStatusCode.ERROR,
                        message:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    });
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
                        Effect.map(
                            (response) =>
                                mapActivitiesResponse(
                                    response
                                ) as ActivitiesPage
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
                        Effect.map(mapSearchResponse),
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
                        Effect.map(mapSqlQueryResponse),
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
                        Effect.map((response) => response.id),
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
                        Effect.map((response) =>
                            response.responses.map((r) => r.id)
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
                    pipe(
                        worldClientEffect.subscribeEntities({
                            clause: clause ? mapClause(clause) : undefined,
                            world_addresses: worldAddressesBytes,
                        }),
                        Stream.mapEffect((response) =>
                            response.entity
                                ? pipe(
                                      Effect.try({
                                          try: () => mapEntity(response.entity!),
                                          catch: mapTransformError("mapEntity"),
                                      }),
                                      Effect.map((entity) => ({
                                          entity,
                                          subscriptionId: response.subscription_id,
                                      })),
                                      Effect.mapError((error) =>
                                          mapSubscriptionError(
                                              "update",
                                              subscriptionId
                                          )(error)
                                      )
                                  )
                                : Effect.fail(
                                      mapSubscriptionError(
                                          "update",
                                          subscriptionId
                                      )(new Error("No entity in response"))
                                  )
                        ),
                        traceStreamMessage<{
                            entity: Entity;
                            subscriptionId: bigint;
                        }>(
                            "subscribeEntities",
                            Number(subscriptionId),
                            (data) => serializeForTelemetry(data.entity)
                        )
                    ),
                onMessage: (data: { entity: Entity; subscriptionId: bigint }) =>
                    callback(data.entity, data.subscriptionId),
                onError,
                subscriptionId,
            });

            return pipe(
                Effect.scoped(program),
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
                    pipe(
                        worldClientEffect.subscribeTokens({
                            contract_addresses:
                                contract_addresses?.map(hexToBuffer) || [],
                            token_ids: token_ids?.map(hexToBuffer) || [],
                        }),
                        Stream.mapEffect((response) =>
                            response.token
                                ? pipe(
                                      Effect.try({
                                          try: () => mapToken(response.token!),
                                          catch: mapTransformError("mapToken"),
                                      }),
                                      Effect.mapError((error) =>
                                          mapSubscriptionError(
                                              "update",
                                              subscriptionId
                                          )(error)
                                      )
                                  )
                                : Effect.fail(
                                      mapSubscriptionError(
                                          "update",
                                          subscriptionId
                                      )(new Error("No token in response"))
                                  )
                        ),
                        traceStreamMessage<Token>(
                            "subscribeTokens",
                            Number(subscriptionId),
                            (token) => serializeForTelemetry(token)
                        )
                    ),
                onMessage: (token: Token) => callback(token),
                onError,
                subscriptionId,
            });

            return pipe(
                Effect.scoped(program),
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
                    pipe(
                        worldClientEffect.subscribeTransactions({
                            filter: filter
                                ? mapTransactionFilter(filter)
                                : undefined,
                        }),
                        Stream.mapEffect((response) =>
                            response.transaction
                                ? pipe(
                                      Effect.try({
                                          try: () =>
                                              mapTransaction(response.transaction!),
                                          catch: mapTransformError("mapTransaction"),
                                      }),
                                      Effect.mapError((error) =>
                                          mapSubscriptionError(
                                              "update",
                                              subscriptionId
                                          )(error)
                                      )
                                  )
                                : Effect.fail(
                                      mapSubscriptionError(
                                          "update",
                                          subscriptionId
                                      )(new Error("No transaction in response"))
                                  )
                        ),
                        traceStreamMessage<Transaction>(
                            "subscribeTransactions",
                            Number(subscriptionId),
                            (tx) => serializeForTelemetry(tx)
                        )
                    ),
                onMessage: (transaction: Transaction) => callback(transaction),
                subscriptionId,
            });

            return pipe(
                Effect.scoped(program),
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
                    pipe(
                        worldClientEffect.subscribeEvents({
                            keys: grpcClauses,
                        }),
                        Stream.mapEffect((response) =>
                            response.event
                                ? Effect.succeed({
                                      keys: response.event.keys.map(bufferToHex),
                                      data: response.event.data.map(bufferToHex),
                                      transaction_hash: bufferToHex(
                                          response.event.transaction_hash
                                      ),
                                  })
                                : Effect.fail(
                                      mapSubscriptionError(
                                          "update",
                                          subscriptionId
                                      )(new Error("No event in response"))
                                  )
                        ),
                        traceStreamMessage<{
                            keys: string[];
                            data: string[];
                            transaction_hash: string;
                        }>("subscribeEvents", Number(subscriptionId), (event) =>
                            serializeForTelemetry(event)
                        )
                    ),
                onMessage: (event) => callback(event),
                onError,
                subscriptionId,
            });

            return pipe(
                Effect.scoped(program),
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
