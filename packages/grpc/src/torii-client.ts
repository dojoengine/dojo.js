import type {
    ClientConfig,
    Entities,
    Controllers,
    ControllerQuery,
    TokenQuery,
    Tokens,
    TokenBalanceQuery,
    TokenBalances,
    TokenContracts,
    TokenTransfers,
    Query,
    Clause,
    Transactions,
    TransactionQuery,
    TransactionFilter,
    KeysClause,
    Message,
    WasmU256,
    Pagination,
    TokenContractQuery,
    TokenTransferQuery,
    AggregationQuery as ToriiAggregationQuery,
    ActivityQuery as ToriiActivityQuery,
    AchievementQuery as ToriiAchievementQuery,
    PlayerAchievementQuery as ToriiPlayerAchievementQuery,
} from "@dojoengine/torii-wasm";

import type {
    AggregationQueryInput,
    AggregationsPage,
    AggregationEntryView,
    ActivityQueryInput,
    ActivitySubscriptionQuery,
    ActivitiesPage,
    ActivityEntry,
    SqlQueryResponse,
    AchievementQueryInput,
    PlayerAchievementQueryInput,
    AchievementsPage,
    PlayerAchievementsPage,
    AchievementProgressionView,
    AchievementProgressionSubscriptionQuery,
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
    createSubscribeAchievementProgressionsRequest,
    createUpdateAchievementProgressionsSubscriptionRequest,
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
    mapSqlQueryResponse,
    mapAchievementsResponse,
    mapPlayerAchievementsResponse,
    mapAchievementProgression,
    mapSearchResponse,
} from "./mappings/types";

import {
    transformEntitiesResponse,
    transformControllersResponse,
    transformTokensResponse,
    transformTokenBalancesResponse,
    transformTokenContractsResponse,
    transformTokenTransfersResponse,
    transformTransactionsResponse,
    transformMessage,
    transformTransaction,
    transformEntity,
    transformToken,
    transformTokenBalance,
    transformTokenTransfer,
    transformEventsResponse,
    transformContractsResponse,
    transformWorldMetadataResponse,
    transformEvent,
    transformContract,
    transformAggregationsResponse,
    transformAggregationEntry,
    transformActivitiesResponse,
    transformActivity,
} from "./mappings/effect-schema/transformers";

import { Schema } from "effect";
import { addAddressPadding } from "starknet";
import { BufferToHex } from "./mappings/effect-schema/base-schemas";

import { DojoGrpcClient } from "./client";
import { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import type {
    SubscribeEntityResponse,
    SubscribeTransactionsResponse,
    SubscribeTokensResponse,
    SubscribeTokenBalancesResponse,
    SubscribeTokenTransfersResponse,
    SubscribeEventsResponse,
    SubscribeContractsResponse,
    SubscribeAggregationsResponse,
    SubscribeActivitiesResponse,
    PublishMessageBatchRequest,
    SubscribeAchievementProgressionsResponse,
} from "./generated/world";

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
    id: bigint;
    stream: ServerStreamingCall<object, object>;
    cancel: () => void;
    lastMessage?: object;
}

type GrpcSubscription = {
    id: bigint;
    cancel: () => void;
    free: () => void;
};

export class Subscription {
    private _subscription: ToriiSubscription;

    constructor(subscription: ToriiSubscription) {
        this._subscription = subscription;
    }

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

interface StreamHandlerOptions<TReq extends object, TRes extends object> {
    createStream: () => ServerStreamingCall<TReq, TRes>;
    onMessage: (response: TRes) => void;
    onError?: (error: Error) => void;
    onComplete?: () => void;
    onReconnect?: () => void;
}

export interface ToriiGrpcClientConfig extends ClientConfig {
    useEffectSchema?: boolean;
    autoReconnect?: boolean;
    maxReconnectAttempts?: number;
}

export class ToriiGrpcClient {
    private client: DojoGrpcClient;
    private nextSubscriptionId = 1n;
    private subscriptions = new Map<bigint, ToriiSubscription>();
    private useEffectSchema: boolean;
    private autoReconnect: boolean;
    private maxReconnectAttempts: number;
    private worldAddress: string | undefined;
    private worldAddressBytes: Uint8Array | undefined;
    private defaultWorldAddresses: Uint8Array[];
    private mappers: {
        entitiesResponse: (response: any) => any;
        controllersResponse: (response: any) => any;
        tokensResponse: (response: any) => any;
        tokenBalancesResponse: (response: any) => any;
        tokenContractsResponse: (response: any) => any;
        tokenTransfersResponse: (response: any) => any;
        transactionsResponse: (response: any) => any;
        message: (message: any) => any;
        transaction: (tx: any) => any;
        entity: (entity: any) => any;
        token: (token: any) => any;
        tokenBalance: (balance: any) => any;
        tokenTransfer: (transfer: any) => any;
        eventsResponse: (response: any) => any;
        contractsResponse: (response: any) => any;
        worldMetadataResponse: (response: any, worldAddress?: string) => any;
        event: (event: any) => any;
        contract: (contract: any) => any;
        aggregationsResponse: (response: any) => AggregationsPage;
        aggregationEntry: (entry: any) => AggregationEntryView;
        activitiesResponse: (response: any) => ActivitiesPage;
        activity: (activity: any) => ActivityEntry;
        achievementsResponse: (response: any) => AchievementsPage;
        playerAchievementsResponse: (response: any) => PlayerAchievementsPage;
        achievementProgression: (
            progression: any
        ) => AchievementProgressionView;
        sqlQueryResponse: (response: any) => SqlQueryResponse;
        searchResponse: (response: any) => SearchResultsView;
    };

    constructor(config: ToriiGrpcClientConfig) {
        this.client = new DojoGrpcClient({
            url: config.toriiUrl,
        });
        this.worldAddress = addAddressPadding(config.worldAddress) ?? undefined;
        this.worldAddressBytes = this.worldAddress
            ? hexToBuffer(this.worldAddress)
            : undefined;
        this.defaultWorldAddresses = this.worldAddressBytes
            ? [this.worldAddressBytes]
            : [];
        this.useEffectSchema = config.useEffectSchema ?? false;
        this.autoReconnect = config.autoReconnect ?? true;
        this.maxReconnectAttempts = config.maxReconnectAttempts ?? 5;

        // Initialize mappers based on schema preference
        this.mappers = this.useEffectSchema
            ? {
                  entitiesResponse: transformEntitiesResponse,
                  controllersResponse: transformControllersResponse,
                  tokensResponse: transformTokensResponse,
                  tokenBalancesResponse: transformTokenBalancesResponse,
                  tokenContractsResponse: transformTokenContractsResponse,
                  tokenTransfersResponse: transformTokenTransfersResponse,
                  transactionsResponse: transformTransactionsResponse,
                  message: transformMessage,
                  transaction: transformTransaction,
                  entity: transformEntity,
                  token: transformToken,
                  tokenBalance: transformTokenBalance,
                  tokenTransfer: transformTokenTransfer,
                  eventsResponse: transformEventsResponse,
                  contractsResponse: transformContractsResponse,
                  worldMetadataResponse: transformWorldMetadataResponse,
                  event: transformEvent,
                  contract: transformContract,
                  aggregationsResponse: transformAggregationsResponse,
                  aggregationEntry: transformAggregationEntry,
                  activitiesResponse: transformActivitiesResponse,
                  activity: transformActivity,
                  achievementsResponse: mapAchievementsResponse,
                  playerAchievementsResponse: mapPlayerAchievementsResponse,
                  achievementProgression: mapAchievementProgression,
                  sqlQueryResponse: mapSqlQueryResponse,
                  searchResponse: mapSearchResponse,
              }
            : {
                  entitiesResponse: mapEntitiesResponse,
                  controllersResponse: mapControllersResponse,
                  tokensResponse: mapTokensResponse,
                  tokenBalancesResponse: mapTokenBalancesResponse,
                  tokenContractsResponse: mapTokenContractsResponse,
                  tokenTransfersResponse: mapTokenTransfersResponse,
                  transactionsResponse: mapTransactionsResponse,
                  message: mapMessage,
                  transaction: mapTransaction,
                  entity: mapEntity,
                  token: mapToken,
                  tokenBalance: mapTokenBalance,
                  tokenTransfer: mapTokenTransfer,
                  eventsResponse: mapEventsResponse,
                  contractsResponse: mapContractsResponse,
                  worldMetadataResponse: mapWorldMetadataResponse,
                  event: mapEvent,
                  contract: mapContract,
                  aggregationsResponse: mapAggregationsResponse,
                  aggregationEntry: mapAggregationEntry,
                  activitiesResponse: mapActivitiesResponse,
                  activity: mapActivity,
                  achievementsResponse: mapAchievementsResponse,
                  playerAchievementsResponse: mapPlayerAchievementsResponse,
                  achievementProgression: mapAchievementProgression,
                  sqlQueryResponse: mapSqlQueryResponse,
                  searchResponse: mapSearchResponse,
              };
    }

    private createStreamSubscription<TReq extends object, TRes extends object>(
        options: StreamHandlerOptions<TReq, TRes>
    ): Subscription {
        const subscriptionId = this.nextSubscriptionId++;
        let isCancelled = false;
        let reconnectAttempts = 0;

        const subscription: ToriiSubscription = {
            id: subscriptionId,
            stream: null as any,
            cancel: () => {
                isCancelled = true;
                this.subscriptions.delete(subscriptionId);
            },
        };

        this.subscriptions.set(subscriptionId, subscription);

        const setupStream = (isReconnect = false) => {
            if (isCancelled) return;

            const stream = options.createStream();
            subscription.stream = stream as ServerStreamingCall<object, object>;

            if (isReconnect) {
                if (options.onReconnect) {
                    options.onReconnect();
                }
                if (subscription.lastMessage) {
                    options.onMessage(subscription.lastMessage as TRes);
                }
            }

            stream.responses.onMessage((response: TRes) => {
                reconnectAttempts = 0;
                subscription.lastMessage = response;
                options.onMessage(response);
            });

            const handleError = (error: Error) => {
                if (isCancelled) return;

                const isNetworkError =
                    error.message.includes("network") ||
                    error.message.includes("fetch") ||
                    error.message.includes("body stream") ||
                    error.message.includes("connection");

                if (
                    isNetworkError &&
                    this.autoReconnect &&
                    reconnectAttempts < this.maxReconnectAttempts
                ) {
                    reconnectAttempts++;
                    const delay = Math.pow(2, reconnectAttempts) * 1000;
                    setTimeout(() => setupStream(true), delay);
                } else {
                    if (options.onError) {
                        options.onError(error);
                    } else {
                        console.error(
                            `Stream error (subscription ${subscriptionId}):`,
                            error
                        );
                    }
                }
            };

            stream.responses.onError(handleError);

            const handleComplete = () => {
                if (isCancelled) return;

                if (options.onComplete) {
                    options.onComplete();
                }
                this.subscriptions.delete(subscriptionId);
            };

            stream.responses.onComplete(handleComplete);
        };

        setupStream(false);

        return new Subscription(subscription);
    }

    private cloneWorldAddresses(addresses: Uint8Array[]): Uint8Array[] {
        return addresses.map((addr) => new Uint8Array(addr));
    }

    private normalizeWorldAddresses(addresses?: string[] | null): Uint8Array[] {
        if (addresses && addresses.length > 0) {
            return addresses.map((address) => hexToBuffer(address));
        }
        return this.cloneWorldAddresses(this.defaultWorldAddresses);
    }

    private ensureWorldAddressesList(list?: Uint8Array[] | null): Uint8Array[] {
        if (list && list.length > 0) {
            return list;
        }
        return this.cloneWorldAddresses(this.defaultWorldAddresses);
    }

    private buildPagination(pagination?: Pagination): Pagination {
        return (
            pagination ?? {
                limit: undefined,
                cursor: undefined,
                direction: "Forward",
                order_by: [],
            }
        );
    }

    private toAchievementQueryInput(
        query?: AchievementQueryInput
    ): ToriiAchievementQuery | undefined {
        const worldAddresses =
            query?.worldAddresses && query.worldAddresses.length > 0
                ? query.worldAddresses
                : this.worldAddress
                  ? [this.worldAddress]
                  : [];

        const namespaces = query?.namespaces ?? [];
        const hidden = query?.hidden;
        const pagination = this.buildPagination(query?.pagination);

        if (
            worldAddresses.length === 0 &&
            namespaces.length === 0 &&
            hidden === undefined &&
            query?.pagination === undefined
        ) {
            return this.worldAddress
                ? {
                      world_addresses: [this.worldAddress],
                      namespaces: [],
                      hidden: undefined,
                      pagination,
                  }
                : undefined;
        }

        return {
            world_addresses: worldAddresses,
            namespaces,
            hidden,
            pagination,
        };
    }

    private toPlayerAchievementQueryInput(
        query?: PlayerAchievementQueryInput
    ): ToriiPlayerAchievementQuery | undefined {
        const worldAddresses =
            query?.worldAddresses && query.worldAddresses.length > 0
                ? query.worldAddresses
                : this.worldAddress
                  ? [this.worldAddress]
                  : [];

        const namespaces = query?.namespaces ?? [];
        const playerAddresses = query?.playerAddresses ?? [];
        const pagination = this.buildPagination(query?.pagination);

        if (
            worldAddresses.length === 0 &&
            namespaces.length === 0 &&
            playerAddresses.length === 0 &&
            query?.pagination === undefined
        ) {
            return this.worldAddress
                ? {
                      world_addresses: [this.worldAddress],
                      namespaces: [],
                      player_addresses: [],
                      pagination,
                  }
                : undefined;
        }

        return {
            world_addresses: worldAddresses,
            namespaces,
            player_addresses: playerAddresses,
            pagination,
        };
    }

    private toAchievementProgressionFilters(
        query?: AchievementProgressionSubscriptionQuery
    ): AchievementProgressionSubscriptionQuery {
        const worldAddresses =
            query?.worldAddresses && query.worldAddresses.length > 0
                ? query.worldAddresses
                : this.worldAddress
                  ? [this.worldAddress]
                  : [];

        return {
            worldAddresses,
            namespaces: query?.namespaces ?? [],
            playerAddresses: query?.playerAddresses ?? [],
            achievementIds: query?.achievementIds ?? [],
        };
    }

    private toActivitySubscriptionFilters(query?: ActivitySubscriptionQuery): {
        world_addresses: Uint8Array[];
        namespaces: string[];
        caller_addresses: Uint8Array[];
    } {
        return {
            world_addresses: this.normalizeWorldAddresses(
                query?.worldAddresses
            ),
            namespaces: query?.namespaces ?? [],
            caller_addresses: query?.callerAddresses?.map(hexToBuffer) ?? [],
        };
    }

    async getControllers(query: ControllerQuery): Promise<Controllers> {
        const request = createRetrieveControllersRequest(query);
        const response =
            await this.client.worldClient.retrieveControllers(request).response;
        return this.mappers.controllersResponse(response);
    }

    async getTransactions(query: TransactionQuery): Promise<Transactions> {
        const request = createRetrieveTransactionsRequest(query);
        const response =
            await this.client.worldClient.retrieveTransactions(request)
                .response;
        return this.mappers.transactionsResponse(response);
    }

    async getTokens(query: TokenQuery): Promise<Tokens> {
        const normalizedQuery: TokenQuery = {
            ...query,
            attribute_filters: query.attribute_filters ?? [],
        };
        const request = createRetrieveTokensRequest(normalizedQuery);
        const response =
            await this.client.worldClient.retrieveTokens(request).response;
        return this.mappers.tokensResponse(response);
    }

    async getTokenBalances(query: TokenBalanceQuery): Promise<TokenBalances> {
        const request = createRetrieveTokenBalancesRequest(query);
        const response =
            await this.client.worldClient.retrieveTokenBalances(request)
                .response;
        return this.mappers.tokenBalancesResponse(response);
    }

    async getTokenContracts(
        query: TokenContractQuery
    ): Promise<TokenContracts> {
        const request = createRetrieveTokenContractsRequest(query);
        const response =
            await this.client.worldClient.retrieveTokenContracts(request)
                .response;
        return this.mappers.tokenContractsResponse(response);
    }

    async getTokenTransfers(
        query: TokenTransferQuery
    ): Promise<TokenTransfers> {
        const request = createRetrieveTokenTransfersRequest(query);
        const response =
            await this.client.worldClient.retrieveTokenTransfers(request)
                .response;
        return this.mappers.tokenTransfersResponse(response);
    }

    async getAchievements(
        query: ToriiAchievementQuery
    ): Promise<AchievementsPage> {
        const request = createRetrieveAchievementsRequest(query);
        const response =
            await this.client.worldClient.retrieveAchievements(request)
                .response;
        return this.mappers.achievementsResponse(response);
    }

    async getPlayerAchievements(
        query: ToriiPlayerAchievementQuery
    ): Promise<PlayerAchievementsPage> {
        const request = createRetrievePlayerAchievementsRequest(query);
        const response =
            await this.client.worldClient.retrievePlayerAchievements(request)
                .response;
        return this.mappers.playerAchievementsResponse(response);
    }

    async getEntities(query: Query): Promise<Entities> {
        const request = createRetrieveEntitiesRequest(query);
        if (request.query) {
            request.query.world_addresses = this.ensureWorldAddressesList(
                request.query.world_addresses
            );
        }
        const response =
            await this.client.worldClient.retrieveEntities(request).response;
        return this.mappers.entitiesResponse(response);
    }

    async getAllEntities(
        limit: number,
        cursor?: string | null
    ): Promise<Entities> {
        const query: Query = {
            pagination: {
                limit,
                cursor: cursor || undefined,
                direction: "Forward",
                order_by: [],
            },
            clause: undefined,
            no_hashed_keys: true,
            models: [],
            historical: false,
            world_addresses: [],
        };
        return this.getEntities(query);
    }

    async getEventMessages(query: Query): Promise<Entities> {
        const request = createRetrieveEventMessagesRequest(query);
        if (request.query) {
            request.query.world_addresses = this.ensureWorldAddressesList(
                request.query.world_addresses
            );
        }
        const response =
            await this.client.worldClient.retrieveEventMessages(request)
                .response;
        return this.mappers.entitiesResponse(response);
    }

    async onTransaction(
        filter: TransactionFilter | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeTransactions({
                    filter: filter ? mapTransactionFilter(filter) : undefined,
                }),
            onMessage: (response: SubscribeTransactionsResponse) => {
                if (response.transaction) {
                    callback(this.mappers.transaction(response.transaction));
                }
            },
        });
    }

    async onTokenUpdated(
        contract_addresses: string[] | null | undefined,
        token_ids: WasmU256[] | null | undefined,
        callback: Function,
        onError?: (error: Error) => void
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeTokens({
                    contract_addresses:
                        contract_addresses?.map(hexToBuffer) || [],
                    token_ids: token_ids?.map(hexToBuffer) || [],
                }),
            onMessage: (response: SubscribeTokensResponse) => {
                if (response.token) {
                    callback(this.mappers.token(response.token));
                }
            },
            onError,
        });
    }

    async onEntityUpdated(
        clause: Clause | null | undefined,
        world_addresses: string[] | null | undefined,
        callback: Function,
        onError?: (error: Error) => void
    ): Promise<Subscription> {
        const worldAddressesBytes =
            this.normalizeWorldAddresses(world_addresses);
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeEntities({
                    clause: clause ? mapClause(clause) : undefined,
                    world_addresses: worldAddressesBytes,
                }),
            onMessage: (response: SubscribeEntityResponse) => {
                console.log(response);
                if (response.entity) {
                    callback(
                        this.mappers.entity(response.entity),
                        response.subscription_id
                    );
                }
            },
            onError,
        });
    }

    async updateEntitySubscription(
        subscription: Subscription,
        clause?: Clause | null,
        world_addresses?: string[] | null
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateEntitiesSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            clause: clause ? mapClause(clause) : undefined,
            world_addresses: this.normalizeWorldAddresses(world_addresses),
        }).response;
    }

    async onEventMessageUpdated(
        clause: Clause | null | undefined,
        world_addresses: string[] | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        const worldAddressesBytes =
            this.normalizeWorldAddresses(world_addresses);
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeEventMessages({
                    clause: clause ? mapClause(clause) : undefined,
                    world_addresses: worldAddressesBytes,
                }),
            onMessage: (response: SubscribeEntityResponse) => {
                if (response.entity) {
                    callback(
                        this.mappers.entity(response.entity),
                        response.subscription_id
                    );
                }
            },
        });
    }

    async updateEventMessageSubscription(
        subscription: Subscription,
        clause?: Clause | null,
        world_addresses?: string[] | null
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateEventMessagesSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            clause: clause ? mapClause(clause) : undefined,
            world_addresses: this.normalizeWorldAddresses(world_addresses),
        }).response;
    }

    async onStarknetEvent(
        clauses: KeysClause[],
        callback: Function,
        onError?: (error: Error) => void
    ): Promise<Subscription> {
        // Map KeysClause[] to a single clause
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

        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeEvents({
                    keys: grpcClauses,
                }),
            onMessage: (response: SubscribeEventsResponse) => {
                if (response.event) {
                    const hexConverter = this.useEffectSchema
                        ? (buffer: Uint8Array) =>
                              Schema.decodeSync(BufferToHex)(buffer)
                        : bufferToHex;

                    callback({
                        keys: response.event.keys.map(hexConverter),
                        data: response.event.data.map(hexConverter),
                        transaction_hash: hexConverter(
                            response.event.transaction_hash
                        ),
                    });
                }
            },
            onError,
        });
    }

    async onIndexerUpdated(
        contract_address: string | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        const query = contract_address
            ? { contract_addresses: [contract_address] }
            : {};
        return this.onContractsUpdated(query, callback);
    }

    async onTokenBalanceUpdated(
        contract_addresses: string[] | null | undefined,
        account_addresses: string[] | null | undefined,
        token_ids: WasmU256[] | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeTokenBalances({
                    contract_addresses:
                        contract_addresses?.map(hexToBuffer) || [],
                    account_addresses:
                        account_addresses?.map(hexToBuffer) || [],
                    token_ids: token_ids?.map(hexToBuffer) || [],
                }),
            onMessage: (response: SubscribeTokenBalancesResponse) => {
                if (response.balance) {
                    callback(
                        this.mappers.tokenBalance(response.balance),
                        response.subscription_id
                    );
                }
            },
        });
    }

    async updateTokenBalanceSubscription(
        subscription: Subscription,
        contract_addresses: string[],
        account_addresses: string[],
        token_ids: WasmU256[]
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateTokenBalancesSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            contract_addresses: contract_addresses.map(hexToBuffer),
            account_addresses: account_addresses.map(hexToBuffer),
            token_ids: token_ids.map(hexToBuffer),
        }).response;
    }

    async onTokenTransferUpdated(
        contract_addresses: string[] | null | undefined,
        account_addresses: string[] | null | undefined,
        token_ids: WasmU256[] | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeTokenTransfers({
                    contract_addresses:
                        contract_addresses?.map(hexToBuffer) || [],
                    account_addresses:
                        account_addresses?.map(hexToBuffer) || [],
                    token_ids: token_ids?.map(hexToBuffer) || [],
                }),
            onMessage: (response: SubscribeTokenTransfersResponse) => {
                if (response.transfer) {
                    callback(
                        this.mappers.tokenTransfer(response.transfer),
                        response.subscription_id
                    );
                }
            },
        });
    }

    async updateTokenTransferSubscription(
        subscription: Subscription,
        contract_addresses: string[],
        account_addresses: string[],
        token_ids: WasmU256[]
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateTokenTransfersSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            contract_addresses: contract_addresses.map(hexToBuffer),
            account_addresses: account_addresses.map(hexToBuffer),
            token_ids: token_ids.map(hexToBuffer),
        }).response;
    }

    async onAchievementProgressionUpdated(
        world_addresses: string[] | null | undefined,
        namespaces: string[] | null | undefined,
        player_addresses: string[] | null | undefined,
        achievement_ids: string[] | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeAchievementProgressions(
                    createSubscribeAchievementProgressionsRequest({
                        worldAddresses: world_addresses ?? [],
                        namespaces: namespaces ?? [],
                        playerAddresses: player_addresses ?? [],
                        achievementIds: achievement_ids ?? [],
                    })
                ),
            onMessage: (response: SubscribeAchievementProgressionsResponse) => {
                if (response.progression) {
                    callback(
                        this.mappers.achievementProgression(
                            response.progression
                        ),
                        response.subscription_id
                    );
                }
            },
        });
    }

    async updateAchievementProgressionSubscription(
        subscription: Subscription,
        world_addresses: string[],
        namespaces: string[],
        player_addresses: string[],
        achievement_ids: string[]
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateAchievementProgressionsSubscription(
            createUpdateAchievementProgressionsSubscriptionRequest(
                BigInt(grpcSubscription.id),
                {
                    worldAddresses: world_addresses,
                    namespaces: namespaces,
                    playerAddresses: player_addresses,
                    achievementIds: achievement_ids,
                }
            )
        ).response;
    }

    async publishMessage(message: Message): Promise<string> {
        if (!this.worldAddressBytes) {
            throw new Error("World address is required to publish messages");
        }

        const worldAddressBytes = this.worldAddressBytes;
        const request = {
            ...this.mappers.message(message),
            world_address: new Uint8Array(worldAddressBytes),
        };
        const response =
            await this.client.worldClient.publishMessage(request).response;
        return response.id;
    }

    async publishMessageBatch(messages: Message[]): Promise<string[]> {
        if (!this.worldAddressBytes) {
            throw new Error("World address is required to publish messages");
        }

        const worldAddressBytes = this.worldAddressBytes;
        const request: PublishMessageBatchRequest = {
            messages: messages.map((message) => ({
                ...this.mappers.message(message),
                world_address: new Uint8Array(worldAddressBytes),
            })),
        };
        const response =
            await this.client.worldClient.publishMessageBatch(request).response;
        return response.responses.map((r) => r.id);
    }

    async getWorldMetadata(): Promise<any> {
        const response = await this.client.worldClient.worlds({
            world_addresses: this.cloneWorldAddresses(
                this.defaultWorldAddresses
            ),
        }).response;
        return this.mappers.worldMetadataResponse(response, this.worldAddress);
    }

    async getWorlds(worldAddresses?: string[]): Promise<any[]> {
        const response = await this.client.worldClient.worlds({
            world_addresses: worldAddresses
                ? worldAddresses.map((address) =>
                      hexToBuffer(addAddressPadding(address))
                  )
                : [],
        }).response;

        return mapWorldsResponse(response);
    }

    async getEvents(query: {
        keys?: KeysClause;
        pagination?: Pagination;
    }): Promise<any> {
        const request = createRetrieveEventsRequest(query);
        const response =
            await this.client.worldClient.retrieveEvents(request).response;
        return this.mappers.eventsResponse(response);
    }

    async getContracts(query?: {
        contract_addresses?: string[];
        contract_types?: ContractType[];
    }): Promise<any> {
        const request = createRetrieveContractsRequest(query || {});
        const response =
            await this.client.worldClient.retrieveContracts(request).response;
        return this.mappers.contractsResponse(response);
    }

    async getAggregations(
        query: ToriiAggregationQuery
    ): Promise<AggregationsPage> {
        const request = createRetrieveAggregationsRequest(query);
        const response =
            await this.client.worldClient.retrieveAggregations(request)
                .response;
        return this.mappers.aggregationsResponse(response) as AggregationsPage;
    }

    async updateTokensSubscription(
        subscription: Subscription,
        contractAddresses?: string[],
        tokenIds?: WasmU256[]
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateTokensSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            contract_addresses: contractAddresses?.map(hexToBuffer) || [],
            token_ids: tokenIds?.map(hexToBuffer) || [],
        }).response;
    }

    async onContractsUpdated(
        query: {
            contract_addresses?: string[];
            contract_types?: ContractType[];
        },
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeContracts({
                    query: {
                        contract_addresses:
                            query.contract_addresses?.map(hexToBuffer) || [],
                        contract_types: query.contract_types || [],
                    },
                }),
            onMessage: (response: SubscribeContractsResponse) => {
                if (response.contract) {
                    callback(this.mappers.contract(response.contract));
                }
            },
        });
    }

    async onAggregationUpdated(
        aggregator_ids: string[] | null | undefined,
        entity_ids: string[] | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeAggregations({
                    aggregator_ids: aggregator_ids ?? [],
                    entity_ids: entity_ids ?? [],
                }),
            onMessage: (response: SubscribeAggregationsResponse) => {
                if (response.entry) {
                    callback(
                        this.mappers.aggregationEntry(
                            response.entry
                        ) as AggregationEntryView,
                        response.subscription_id
                    );
                }
            },
        });
    }

    async updateAggregationSubscription(
        subscription: Subscription,
        aggregator_ids: string[],
        entity_ids: string[]
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateAggregationsSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            aggregator_ids: aggregator_ids,
            entity_ids: entity_ids,
        }).response;
    }

    async getActivities(query: ToriiActivityQuery): Promise<ActivitiesPage> {
        const request = createRetrieveActivitiesRequest(query);
        const response =
            await this.client.worldClient.retrieveActivities(request).response;
        return this.mappers.activitiesResponse(response) as ActivitiesPage;
    }

    async onActivityUpdated(
        world_addresses: string[] | null | undefined,
        namespaces: string[] | null | undefined,
        caller_addresses: string[] | null | undefined,
        callback: Function
    ): Promise<Subscription> {
        return this.createStreamSubscription({
            createStream: () =>
                this.client.worldClient.subscribeActivities({
                    world_addresses:
                        this.normalizeWorldAddresses(world_addresses),
                    namespaces: namespaces ?? [],
                    caller_addresses: caller_addresses?.map(hexToBuffer) ?? [],
                }),
            onMessage: (response: SubscribeActivitiesResponse) => {
                if (response.activity) {
                    callback(
                        this.mappers.activity(
                            response.activity
                        ) as ActivityEntry,
                        response.subscription_id
                    );
                }
            },
        });
    }

    async updateActivitySubscription(
        subscription: Subscription,
        world_addresses: string[],
        namespaces: string[],
        caller_addresses: string[]
    ): Promise<void> {
        const grpcSubscription = this.findSubscription(subscription);
        if (!grpcSubscription) {
            throw new Error("Subscription not found");
        }

        await this.client.worldClient.updateActivitiesSubscription({
            subscription_id: BigInt(grpcSubscription.id),
            world_addresses: world_addresses.map(hexToBuffer),
            namespaces: namespaces,
            caller_addresses: caller_addresses.map(hexToBuffer),
        }).response;
    }

    async executeSql(query: string): Promise<SqlQueryResponse> {
        const response = await this.client.worldClient.executeSql({
            query,
        }).response;
        return this.mappers.sqlQueryResponse(response) as SqlQueryResponse;
    }

    async search(query: SearchQueryInput): Promise<SearchResultsView> {
        const request = createSearchRequest(query.query, query.limit);
        const response = await this.client.worldClient.search(request).response;
        return this.mappers.searchResponse(response);
    }

    private findSubscription(
        subscription: GrpcSubscription | Subscription
    ): ToriiSubscription | undefined {
        const subscriptionId =
            subscription instanceof Subscription
                ? subscription.id
                : subscription.id;
        return this.subscriptions.get(subscriptionId);
    }

    destroy() {
        // Cancel all active subscriptions
        for (const [_, subscription] of this.subscriptions) {
            subscription.cancel();
        }
        this.subscriptions.clear();

        // Destroy the underlying client
        this.client.destroy();
    }
}
