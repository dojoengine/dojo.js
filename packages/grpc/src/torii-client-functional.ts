import { Effect, Stream, Fiber, pipe } from "effect";
import { Tracer } from "@effect/opentelemetry";
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
import { mapGrpcError, mapTransformError, mapSubscriptionError } from "./services/error-mappers";

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
    readonly getAllEntities: (limit: number, cursor?: string | null) => Promise<Entities>;
    readonly getEventMessages: (query: Query) => Promise<Entities>;
    readonly getControllers: (query: ControllerQuery) => Promise<Controllers>;
    readonly getTransactions: (query: TransactionQuery) => Promise<Transactions>;
    readonly getTokens: (query: TokenQuery) => Promise<Tokens>;
    readonly getTokenBalances: (query: TokenBalanceQuery) => Promise<TokenBalances>;
    readonly getTokenContracts: (query: TokenContractQuery) => Promise<TokenContracts>;
    readonly getTokenTransfers: (query: TokenTransferQuery) => Promise<TokenTransfers>;
    readonly getAchievements: (query: ToriiAchievementQuery) => Promise<AchievementsPage>;
    readonly getPlayerAchievements: (query: ToriiPlayerAchievementQuery) => Promise<PlayerAchievementsPage>;
    readonly getWorldMetadata: () => Promise<any>;
    readonly getWorlds: (worldAddresses?: string[]) => Promise<any[]>;
    readonly getEvents: (query: { keys?: KeysClause; pagination?: Pagination }) => Promise<any>;
    readonly getContracts: (query?: { contract_addresses?: string[]; contract_types?: ContractType[] }) => Promise<any>;
    readonly getAggregations: (query: ToriiAggregationQuery) => Promise<AggregationsPage>;
    readonly getActivities: (query: ToriiActivityQuery) => Promise<ActivitiesPage>;
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

    const worldAddress = addAddressPadding(config.worldAddress) ?? undefined;
    const worldAddressBytes = worldAddress ? hexToBuffer(worldAddress) : undefined;
    const defaultWorldAddresses = worldAddressBytes ? [worldAddressBytes] : [];

    const state = {
        subscriptions: new Map<bigint, Subscription>(),
        nextId: 1n,
    };

    const cloneWorldAddresses = (addresses: Uint8Array[]): Uint8Array[] =>
        addresses.map((addr) => new Uint8Array(addr));

    const normalizeWorldAddresses = (addresses?: string[] | null): Uint8Array[] => {
        if (addresses && addresses.length > 0) {
            return addresses.map((address) => hexToBuffer(address));
        }
        return cloneWorldAddresses(defaultWorldAddresses);
    };

    const ensureWorldAddressesList = (list?: Uint8Array[] | null): Uint8Array[] => {
        if (list && list.length > 0) {
            return list;
        }
        return cloneWorldAddresses(defaultWorldAddresses);
    };

    const runQuery = <A, E extends Errors.ToriiError>(
        effect: Effect.Effect<A, E>,
        method: string
    ): Promise<A> =>
        pipe(
            effect,
            Effect.mapError((error) =>
                error instanceof Error
                    ? mapGrpcError(method, config.toriiUrl)(error)
                    : error
            ),
            Effect.runPromise
        );

    return {
        getEntities: (query: Query) =>
            pipe(
                Effect.sync(() => createRetrieveEntitiesRequest(query)),
                Effect.tap((req) =>
                    Effect.sync(() => {
                        if (req.query) {
                            req.query.world_addresses = ensureWorldAddressesList(
                                req.query.world_addresses
                            );
                        }
                    })
                ),
                Effect.flatMap((req) => worldClientEffect.retrieveEntities(req)),
                Effect.flatMap((response) =>
                    Effect.try({
                        try: () => mapEntitiesResponse(response),
                        catch: mapTransformError("mapEntitiesResponse"),
                    })
                ),
                Effect.withSpan("torii.getEntities", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getEntities",
                    },
                }),
                (effect) => runQuery(effect, "getEntities")
            ),

        getAllEntities: (limit: number, cursor?: string | null) =>
            pipe(
                Effect.sync(() => ({
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
                })),
                Effect.flatMap((query: Query) =>
                    pipe(
                        Effect.sync(() => createRetrieveEntitiesRequest(query)),
                        Effect.tap((req) =>
                            Effect.sync(() => {
                                if (req.query) {
                                    req.query.world_addresses = ensureWorldAddressesList(
                                        req.query.world_addresses
                                    );
                                }
                            })
                        ),
                        Effect.flatMap((req) => worldClientEffect.retrieveEntities(req)),
                        Effect.map(mapEntitiesResponse)
                    )
                ),
                Effect.withSpan("torii.getAllEntities", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getAllEntities",
                        "torii.query.pagination.limit": limit,
                    },
                }),
                (effect) => runQuery(effect, "getAllEntities")
            ),

        getEventMessages: (query: Query) =>
            pipe(
                Effect.sync(() => createRetrieveEventMessagesRequest(query)),
                Effect.tap((req) =>
                    Effect.sync(() => {
                        if (req.query) {
                            req.query.world_addresses = ensureWorldAddressesList(
                                req.query.world_addresses
                            );
                        }
                    })
                ),
                Effect.flatMap((req) => worldClientEffect.retrieveEventMessages(req)),
                Effect.map(mapEntitiesResponse),
                Effect.withSpan("torii.getEventMessages", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getEventMessages",
                    },
                }),
                (effect) => runQuery(effect, "getEventMessages")
            ),

        getControllers: (query: ControllerQuery) =>
            pipe(
                Effect.sync(() => createRetrieveControllersRequest(query)),
                Effect.flatMap((req) => worldClientEffect.retrieveControllers(req)),
                Effect.map(mapControllersResponse),
                Effect.withSpan("torii.getControllers", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getControllers",
                    },
                }),
                (effect) => runQuery(effect, "getControllers")
            ),

        getTransactions: (query: TransactionQuery) =>
            pipe(
                Effect.sync(() => createRetrieveTransactionsRequest(query)),
                Effect.flatMap((req) => worldClientEffect.retrieveTransactions(req)),
                Effect.map(mapTransactionsResponse),
                Effect.withSpan("torii.getTransactions", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getTransactions",
                    },
                }),
                (effect) => runQuery(effect, "getTransactions")
            ),

        getTokens: (query: TokenQuery) =>
            pipe(
                Effect.sync(() => ({
                    ...query,
                    attribute_filters: query.attribute_filters ?? [],
                })),
                Effect.map(createRetrieveTokensRequest),
                Effect.flatMap((req) => worldClientEffect.retrieveTokens(req)),
                Effect.map(mapTokensResponse),
                Effect.withSpan("torii.getTokens", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getTokens",
                    },
                }),
                (effect) => runQuery(effect, "getTokens")
            ),

        getTokenBalances: (query: TokenBalanceQuery) =>
            pipe(
                Effect.sync(() => createRetrieveTokenBalancesRequest(query)),
                Effect.flatMap((req) => worldClientEffect.retrieveTokenBalances(req)),
                Effect.map(mapTokenBalancesResponse),
                Effect.withSpan("torii.getTokenBalances", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getTokenBalances",
                    },
                }),
                (effect) => runQuery(effect, "getTokenBalances")
            ),

        getTokenContracts: (query: TokenContractQuery) =>
            pipe(
                Effect.sync(() => createRetrieveTokenContractsRequest(query)),
                Effect.flatMap((req) => worldClientEffect.retrieveTokenContracts(req)),
                Effect.map(mapTokenContractsResponse),
                Effect.withSpan("torii.getTokenContracts", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getTokenContracts",
                    },
                }),
                (effect) => runQuery(effect, "getTokenContracts")
            ),

        getTokenTransfers: (query: TokenTransferQuery) =>
            pipe(
                Effect.sync(() => createRetrieveTokenTransfersRequest(query)),
                Effect.flatMap((req) => worldClientEffect.retrieveTokenTransfers(req)),
                Effect.map(mapTokenTransfersResponse),
                Effect.withSpan("torii.getTokenTransfers", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getTokenTransfers",
                    },
                }),
                (effect) => runQuery(effect, "getTokenTransfers")
            ),

        getAchievements: (query: ToriiAchievementQuery) =>
            pipe(
                Effect.sync(() => createRetrieveAchievementsRequest(query)),
                Effect.flatMap((req) => worldClientEffect.retrieveAchievements(req)),
                Effect.map(mapAchievementsResponse),
                Effect.withSpan("torii.getAchievements", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getAchievements",
                    },
                }),
                (effect) => runQuery(effect, "getAchievements")
            ),

        getPlayerAchievements: (query: ToriiPlayerAchievementQuery) =>
            pipe(
                Effect.sync(() => createRetrievePlayerAchievementsRequest(query)),
                Effect.flatMap((req) => worldClientEffect.retrievePlayerAchievements(req)),
                Effect.map(mapPlayerAchievementsResponse),
                Effect.withSpan("torii.getPlayerAchievements", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getPlayerAchievements",
                    },
                }),
                (effect) => runQuery(effect, "getPlayerAchievements")
            ),

        getWorldMetadata: () =>
            pipe(
                Effect.sync(() => ({
                    world_addresses: cloneWorldAddresses(defaultWorldAddresses),
                })),
                Effect.flatMap((req) => worldClientEffect.worlds(req)),
                Effect.map((response) => mapWorldMetadataResponse(response, worldAddress)),
                Effect.withSpan("torii.getWorldMetadata", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getWorldMetadata",
                    },
                }),
                (effect) => runQuery(effect, "getWorldMetadata")
            ),

        getWorlds: (worldAddresses?: string[]) =>
            pipe(
                Effect.sync(() => ({
                    world_addresses: worldAddresses
                        ? worldAddresses.map((address) =>
                              hexToBuffer(addAddressPadding(address))
                          )
                        : [],
                })),
                Effect.flatMap((req) => worldClientEffect.worlds(req)),
                Effect.map(mapWorldsResponse),
                Effect.withSpan("torii.getWorlds", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getWorlds",
                    },
                }),
                (effect) => runQuery(effect, "getWorlds")
            ),

        getEvents: (query: { keys?: KeysClause; pagination?: Pagination }) =>
            pipe(
                Effect.sync(() => createRetrieveEventsRequest(query)),
                Effect.flatMap((req) => worldClientEffect.retrieveEvents(req)),
                Effect.map(mapEventsResponse),
                Effect.withSpan("torii.getEvents", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getEvents",
                    },
                }),
                (effect) => runQuery(effect, "getEvents")
            ),

        getContracts: (query?: {
            contract_addresses?: string[];
            contract_types?: ContractType[];
        }) =>
            pipe(
                Effect.sync(() => createRetrieveContractsRequest(query || {})),
                Effect.flatMap((req) => worldClientEffect.retrieveContracts(req)),
                Effect.map(mapContractsResponse),
                Effect.withSpan("torii.getContracts", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getContracts",
                    },
                }),
                (effect) => runQuery(effect, "getContracts")
            ),

        getAggregations: (query: ToriiAggregationQuery) =>
            pipe(
                Effect.sync(() => createRetrieveAggregationsRequest(query)),
                Effect.flatMap((req) => worldClientEffect.retrieveAggregations(req)),
                Effect.map(
                    (response) => mapAggregationsResponse(response) as AggregationsPage
                ),
                Effect.withSpan("torii.getAggregations", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getAggregations",
                    },
                }),
                (effect) => runQuery(effect, "getAggregations")
            ),

        getActivities: (query: ToriiActivityQuery) =>
            pipe(
                Effect.sync(() => createRetrieveActivitiesRequest(query)),
                Effect.flatMap((req) => worldClientEffect.retrieveActivities(req)),
                Effect.map((response) => mapActivitiesResponse(response) as ActivitiesPage),
                Effect.withSpan("torii.getActivities", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "getActivities",
                    },
                }),
                (effect) => runQuery(effect, "getActivities")
            ),

        search: (query: SearchQueryInput) =>
            pipe(
                Effect.sync(() => createSearchRequest(query.query, query.limit)),
                Effect.flatMap((req) => worldClientEffect.search(req)),
                Effect.map(mapSearchResponse),
                Effect.withSpan("torii.search", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "search",
                    },
                }),
                (effect) => runQuery(effect, "search")
            ),

        executeSql: (query: string) =>
            pipe(
                worldClientEffect.executeSql({ query }),
                Effect.map(mapSqlQueryResponse),
                Effect.withSpan("torii.executeSql", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "executeSql",
                    },
                }),
                (effect) => runQuery(effect, "executeSql")
            ),

        publishMessage: (message: Message) =>
            pipe(
                Effect.sync(() => {
                    if (!worldAddressBytes) {
                        throw new Errors.ToriiValidationError({
                            message: "World address is required to publish messages",
                            field: "worldAddress",
                            expected: "valid world address",
                        });
                    }
                    return {
                        ...mapMessage(message),
                        world_address: new Uint8Array(worldAddressBytes),
                    };
                }),
                Effect.flatMap((req) => worldClientEffect.publishMessage(req)),
                Effect.map((response) => response.id),
                Effect.withSpan("torii.publishMessage", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "publishMessage",
                    },
                }),
                (effect) => runQuery(effect, "publishMessage")
            ),

        publishMessageBatch: (messages: Message[]) =>
            pipe(
                Effect.sync(() => {
                    if (!worldAddressBytes) {
                        throw new Errors.ToriiValidationError({
                            message: "World address is required to publish messages",
                            field: "worldAddress",
                            expected: "valid world address",
                        });
                    }
                    return {
                        messages: messages.map((message) => ({
                            ...mapMessage(message),
                            world_address: new Uint8Array(worldAddressBytes),
                        })),
                    } as PublishMessageBatchRequest;
                }),
                Effect.flatMap((req) => worldClientEffect.publishMessageBatch(req)),
                Effect.map((response) => response.responses.map((r) => r.id)),
                Effect.withSpan("torii.publishMessageBatch", {
                    attributes: {
                        "torii.url": config.toriiUrl,
                        "torii.world_address": worldAddress || "",
                        "torii.operation": "publishMessageBatch",
                        "torii.message_count": messages.length,
                    },
                }),
                (effect) => runQuery(effect, "publishMessageBatch")
            ),

        onEntityUpdated: (clause, world_addresses, callback, onError) => {
            const subscriptionId = state.nextId++;
            const worldAddressesBytes = normalizeWorldAddresses(world_addresses);

            const program = pipe(
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
                                  mapSubscriptionError("update", subscriptionId)(error)
                              )
                          )
                        : Effect.fail(
                              mapSubscriptionError("update", subscriptionId)(
                                  new Error("No entity in response")
                              )
                          )
                ),
                Stream.tap((data: { entity: Entity; subscriptionId: bigint }) =>
                    Effect.sync(() => callback(data.entity, data.subscriptionId))
                ),
                Stream.catchAll((error) =>
                    pipe(
                        Effect.sync(() => {
                            if (onError) {
                                onError(error instanceof Error ? error : new Error(String(error)));
                            }
                        }),
                        Effect.as(Stream.empty)
                    )
                ),
                Stream.runDrain,
                Effect.fork
            );

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

            const program = pipe(
                worldClientEffect.subscribeTokens({
                    contract_addresses: contract_addresses?.map(hexToBuffer) || [],
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
                                  mapSubscriptionError("update", subscriptionId)(error)
                              )
                          )
                        : Effect.fail(
                              mapSubscriptionError("update", subscriptionId)(
                                  new Error("No token in response")
                              )
                          )
                ),
                Stream.tap((token: Token) => Effect.sync(() => callback(token))),
                Stream.catchAll((error) =>
                    pipe(
                        Effect.sync(() => {
                            if (onError) {
                                onError(error instanceof Error ? error : new Error(String(error)));
                            }
                        }),
                        Effect.as(Stream.empty)
                    )
                ),
                Stream.runDrain,
                Effect.fork
            );

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

            const program = pipe(
                worldClientEffect.subscribeTransactions({
                    filter: filter ? mapTransactionFilter(filter) : undefined,
                }),
                Stream.mapEffect((response) =>
                    response.transaction
                        ? pipe(
                              Effect.try({
                                  try: () => mapTransaction(response.transaction!),
                                  catch: mapTransformError("mapTransaction"),
                              }),
                              Effect.mapError((error) =>
                                  mapSubscriptionError("update", subscriptionId)(error)
                              )
                          )
                        : Effect.fail(
                              mapSubscriptionError("update", subscriptionId)(
                                  new Error("No transaction in response")
                              )
                          )
                ),
                Stream.tap((transaction: Transaction) => Effect.sync(() => callback(transaction))),
                Stream.runDrain,
                Effect.fork
            );

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

            const program = pipe(
                worldClientEffect.subscribeEvents({
                    keys: grpcClauses,
                }),
                Stream.mapEffect((response) =>
                    response.event
                        ? Effect.succeed({
                              keys: response.event.keys.map(bufferToHex),
                              data: response.event.data.map(bufferToHex),
                              transaction_hash: bufferToHex(response.event.transaction_hash),
                          })
                        : Effect.fail(
                              mapSubscriptionError("update", subscriptionId)(
                                  new Error("No event in response")
                              )
                          )
                ),
                Stream.tap((event) => Effect.sync(() => callback(event))),
                Stream.catchAll((error) =>
                    pipe(
                        Effect.sync(() => onError?.(error instanceof Error ? error : new Error(String(error)))),
                        Effect.as(Stream.empty)
                    )
                ),
                Stream.runDrain,
                Effect.fork
            );

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
