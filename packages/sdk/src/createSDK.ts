import type * as torii from "@dojoengine/torii-wasm/types";
import { ok, type Result } from "neverthrow";
import { addAddressPadding, type Account, type TypedData } from "starknet";
import {
    subscribeQueryModelCallback,
    generateTypedData,
    defaultToriiPagination,
    Pagination,
    parseEntities,
    defaultTokenBalance,
    defaultTokenTransfer,
    getTokenBalances,
    getAchievements,
    getPlayerAchievements,
    getTokenTransfers,
    getTokens,
    parseTokenRequest,
    safeCallback,
    subscribeToken,
    subscribeTokenBalance,
    subscribeTokenTransfer,
    updateTokenBalanceSubscription,
    onAchievementProgressionUpdated as onAchievementProgressionUpdatedInternal,
    updateAchievementProgressionSubscription as updateAchievementProgressionSubscriptionInternal,
    updateTokenTransferSubscription,
    defaultAchievementProgression,
    defaultToken,
    getTokenContracts,
    toAchievementQuery,
    toPlayerAchievementQuery,
} from "@dojoengine/internal";
import type {
    GetParams,
    GetTokenBalanceRequest,
    GetTokenRequest,
    GetTokenContracts,
    GetTokenTransferRequest,
    SchemaType,
    SDK,
    SDKConfig,
    SubscribeParams,
    SubscribeResponse,
    SubscribeTokenBalanceRequest,
    SubscribeTokenRequest,
    SubscribeTokenTransferRequest,
    ToriiResponse,
    UnionOfModelData,
    UpdateTokenBalanceSubscriptionRequest,
    UpdateTokenTransferSubscriptionRequest,
    AggregationsPage,
    ActivitiesPage,
    SqlQueryResponse,
    AchievementQueryInput,
    PlayerAchievementQueryInput,
    AchievementsPage,
    PlayerAchievementsPage,
    SubscribeAchievementProgressionRequest,
    UpdateAchievementProgressionSubscriptionRequest,
} from "@dojoengine/internal";
import { ToriiGrpcClient } from "@dojoengine/grpc";

export interface GrpcClientInterface {
    // Entity operations
    getEntities(query: torii.Query): Promise<torii.Entities>;
    onEntityUpdated(
        clause: torii.Clause | null | undefined,
        world_addresses: string[] | null | undefined,
        callback: Function
    ): Promise<torii.Subscription>;
    updateEntitySubscription(
        subscription: torii.Subscription,
        clauses?: torii.Clause | null,
        world_addresses?: string[] | null
    ): Promise<void>;

    // Event operations
    getEventMessages(query: torii.Query): Promise<torii.Entities>;
    onEventMessageUpdated(
        clause: torii.Clause | null | undefined,
        world_addresses: string[] | null | undefined,
        callback: Function
    ): Promise<torii.Subscription>;
    updateEventMessageSubscription(
        subscription: torii.Subscription,
        clauses?: torii.Clause | null,
        world_addresses?: string[] | null
    ): Promise<void>;

    // Token operations
    getTokens(params: {
        contract_addresses?: string[];
        token_ids?: any[];
        pagination?: torii.Pagination;
    }): Promise<torii.Tokens>;
    // Token operations
    getTokenContracts(params: {
        contract_addresses?: string[];
        contract_types?: torii.ContractType[];
        pagination?: torii.Pagination;
    }): Promise<torii.TokenContracts>;
    getTokenBalances(params: {
        contract_addresses?: string[];
        account_addresses?: string[];
        token_ids?: any[];
        pagination?: torii.Pagination;
    }): Promise<torii.TokenBalances>;
    getTokenTransfers(params: {
        contract_addresses?: string[];
        account_addresses?: string[];
        token_ids?: any[];
        pagination?: torii.Pagination;
    }): Promise<torii.TokenTransfers>;
    onTokenBalanceUpdated(
        contractAddresses: string[],
        accountAddresses: string[],
        tokenIds: any[],
        callback: (res: torii.TokenBalance) => void
    ): Promise<torii.Subscription>;
    onTokenUpdated(
        contractAddresses: string[],
        tokenIds: any[],
        callback: (res: torii.Token) => void
    ): Promise<torii.Subscription>;
    onTokenTransferUpdated(
        contractAddresses: string[],
        accountAddresses: string[],
        tokenIds: any[],
        callback: (res: torii.TokenTransfer) => void
    ): Promise<torii.Subscription>;
    updateTokenBalanceSubscription(
        subscription: torii.Subscription,
        contract_addresses: string[],
        account_addresses: string[],
        token_ids: any[]
    ): Promise<void>;
    updateTokenTransferSubscription(
        subscription: torii.Subscription,
        contract_addresses: string[],
        account_addresses: string[],
        token_ids: any[]
    ): Promise<void>;
    getAchievements(params: torii.AchievementQuery): Promise<AchievementsPage>;
    getPlayerAchievements(
        params: torii.PlayerAchievementQuery
    ): Promise<PlayerAchievementsPage>;
    onAchievementProgressionUpdated(
        world_addresses: string[] | null | undefined,
        namespaces: string[] | null | undefined,
        player_addresses: string[] | null | undefined,
        achievement_ids: string[] | null | undefined,
        callback: Function
    ): Promise<torii.Subscription>;
    updateAchievementProgressionSubscription(
        subscription: torii.Subscription,
        world_addresses: string[],
        namespaces: string[],
        player_addresses: string[],
        achievement_ids: string[]
    ): Promise<void>;

    // Message operations
    publishMessage(message: torii.Message): Promise<string>;
    publishMessageBatch(messages: torii.Message[]): Promise<string[]>;

    // Controller operations
    getControllers(params: {
        contract_addresses?: string[];
        usernames?: string[];
        pagination?: torii.Pagination;
    }): Promise<torii.Controllers>;

    // Aggregations operations
    getAggregations(query: torii.AggregationQuery): Promise<AggregationsPage>;
    onAggregationUpdated(
        aggregator_ids: string[] | null | undefined,
        entity_ids: string[] | null | undefined,
        callback: Function
    ): Promise<torii.Subscription>;
    updateAggregationSubscription(
        subscription: torii.Subscription,
        aggregator_ids: string[],
        entity_ids: string[]
    ): Promise<void>;

    // Activities operations
    getActivities(query: torii.ActivityQuery): Promise<ActivitiesPage>;
    onActivityUpdated(
        world_addresses: string[] | null | undefined,
        namespaces: string[] | null | undefined,
        caller_addresses: string[] | null | undefined,
        callback: Function
    ): Promise<torii.Subscription>;
    updateActivitySubscription(
        subscription: torii.Subscription,
        world_addresses: string[],
        namespaces: string[],
        caller_addresses: string[]
    ): Promise<void>;

    // SQL execution
    executeSql(query: string): Promise<SqlQueryResponse>;

    // World metadata
    getWorlds(worldAddresses?: string[]): Promise<any[]>;
}

export interface CreateSDKOptions {
    client?: torii.ToriiClient;
    config: SDKConfig;
    sendMessage: (
        data: TypedData,
        account?: Account
    ) => Promise<Result<string, string>>;
    sendMessageBatch: (
        data: TypedData[],
        account?: Account
    ) => Promise<Result<string[], string>>;
    grpcClient?: GrpcClientInterface;
}

/**
 * Creates an SDK instance with the provided client and configuration.
 * This is the shared implementation used by both node and web versions.
 */
export function createSDK<T extends SchemaType>({
    client,
    config,
    sendMessage,
    sendMessageBatch,
    grpcClient,
}: CreateSDKOptions): SDK<T> {
    // Use provided grpcClient or create default setup
    const sdkClient = grpcClient ?? client;
    if (!sdkClient) {
        throw new Error("Either client or grpcClient must be provided");
    }

    // Only create ToriiGrpcClient if no grpcClient was provided
    const grpcClientInstance =
        grpcClient ??
        new ToriiGrpcClient({
            toriiUrl: config.client.toriiUrl ?? "http://localhost:8080",
            worldAddress: addAddressPadding(config.client.worldAddress),
        });
    return {
        client: client!,

        /**
         * Subscribes to entity queries.
         *
         * @param {SubscribeParams<T>} params - Parameters object
         * @returns {Promise<SubscribeResponse<T>>} - A promise that resolves when the subscription is set up.
         */
        subscribeEntityQuery: async ({ query, callback }) => {
            const q = query.build();

            const entities = await sdkClient.getEntities(q);

            const parsedEntities = parseEntities<T>(entities.items);
            return [
                Pagination.fromQuery(query, entities.next_cursor).withItems(
                    parsedEntities
                ),
                await grpcClientInstance.onEntityUpdated(
                    q.clause,
                    q.world_addresses,
                    subscribeQueryModelCallback(callback)
                ),
            ];
        },

        /**
         * Subscribes to event queries.
         *
         * @param {SubscribeParams<T>} params - Parameters object
         * @returns {Promise<SubscribeResponse<T>>} - A promise that resolves when the subscription is set up.
         */
        subscribeEventQuery: async ({
            query,
            callback,
        }: SubscribeParams<T>): Promise<SubscribeResponse<T>> => {
            const q = query.build();

            const entities = await grpcClientInstance.getEventMessages(q);
            const parsedEntities = parseEntities<T>(entities.items);
            return [
                Pagination.fromQuery(query, entities.next_cursor).withItems(
                    parsedEntities
                ),
                await grpcClientInstance.onEventMessageUpdated(
                    q.clause,
                    q.world_addresses,
                    subscribeQueryModelCallback(callback)
                ),
            ];
        },

        /**
         * Subscribes to token balance updates
         *
         * @param {SubscribeTokenBalanceRequest} request
         * @returns {Promise<[torii.TokenBalances, torii.Subscription]>}
         */
        subscribeTokenBalance: async (
            request: SubscribeTokenBalanceRequest
        ): Promise<[torii.TokenBalances, torii.Subscription]> => {
            if (grpcClient) {
                const {
                    contractAddresses,
                    accountAddresses,
                    tokenIds,
                    pagination,
                } = parseTokenRequest(request);
                const balances = await grpcClient.getTokenBalances({
                    contract_addresses: contractAddresses,
                    account_addresses: accountAddresses,
                    token_ids: tokenIds,
                    pagination,
                });
                const subscription = await grpcClient.onTokenBalanceUpdated(
                    contractAddresses ?? [],
                    accountAddresses ?? [],
                    tokenIds ?? [],
                    safeCallback(request.callback, defaultTokenBalance)
                );
                return [balances, subscription];
            }
            return await subscribeTokenBalance(client!, request);
        },

        /**
         * Subscribes to token transfer updates.
         *
         * @param {SubscribeTokenTransferRequest} request
         * @returns {Promise<[torii.TokenTransfers, torii.Subscription]>}
         */
        subscribeTokenTransfer: async (
            request: SubscribeTokenTransferRequest
        ): Promise<[torii.TokenTransfers, torii.Subscription]> => {
            if (grpcClient) {
                const {
                    contractAddresses,
                    accountAddresses,
                    tokenIds,
                    pagination,
                } = parseTokenRequest(request);
                const transfers = await grpcClient.getTokenTransfers({
                    contract_addresses: contractAddresses,
                    account_addresses: accountAddresses,
                    token_ids: tokenIds,
                    pagination,
                });
                const subscription = await grpcClient.onTokenTransferUpdated(
                    contractAddresses ?? [],
                    accountAddresses ?? [],
                    tokenIds ?? [],
                    safeCallback(request.callback, defaultTokenTransfer)
                );
                return [transfers, subscription];
            }
            return await subscribeTokenTransfer(client!, request);
        },

        /**
         * Fetches entities based on the provided query.
         *
         * @param {GetParams<T>} params - Parameters object
         * @returns {Promise<ToriiResponse<T>>} - A promise that resolves to the standardized query result.
         */
        getEntities: async ({ query }) => {
            const q = query.build();

            const entities = await sdkClient.getEntities(q);

            return Pagination.fromQuery(query, entities.next_cursor).withItems(
                parseEntities(entities.items)
            );
        },

        /**
         * Fetches event messages based on the provided query.
         *
         * @param {GetParams<T>} params - Parameters object
         * @returns {Promise<ToriiResponse<T>} - A promise that resolves to the standardized query result.
         */
        getEventMessages: async ({
            query,
        }: GetParams<T>): Promise<ToriiResponse<T>> => {
            const q = query.build();

            const entities = await sdkClient.getEventMessages(q);

            return Pagination.fromQuery(query, entities.next_cursor).withItems(
                parseEntities(entities.items)
            );
        },

        /**
         * Generates typed data for any user-defined message.
         *
         * @template M - The message type defined by the schema models.
         * @param {string} nsModel - Model name prefixed with namespace joined by a hyphen.
         * @param {M} message - The user-defined message content, must be part of the schema models.
         * @param {Array<{ name: string; type: string }>} modelMapping - Optional model mapping for custom types.
         * @param {Record<string, Array<{ name: string; type: string }>>} additionalTypes - Optional additional types.
         * @returns {TypedData} - The generated typed data.
         */
        generateTypedData: <M extends UnionOfModelData<T>>(
            nsModel: string,
            message: M,
            modelMapping?: Array<{ name: string; type: string }>,
            additionalTypes?: Record<
                string,
                Array<{ name: string; type: string }>
            >
        ): TypedData =>
            generateTypedData(
                nsModel,
                message,
                config.domain,
                modelMapping,
                additionalTypes
            ),

        /**
         * Sends a signed message.
         *
         * @param {TypedData} data - The typed data to be signed and sent.
         * @param {Account} account - The account used to sign the message.
         * @returns {Promise<Result<Uint8Array, string>>} - A promise that resolves when the message is sent successfully.
         */
        sendMessage,

        /**
         * Sends multiple signed messages in a batch.
         *
         * @param {TypedData[]} data - Array of typed data to be signed and sent.
         * @param {Account} account - The account used to sign the messages.
         * @returns {Promise<Result<string[], string>>} - A promise that resolves when all messages are sent successfully.
         */
        sendMessageBatch,

        /**
         * Sends already signed messages to the Torii server in a batch.
         * This method allows you to send pre-signed messages directly without signing them again.
         *
         * @param {torii.Message[]} data - Array of signed messages with message content and signatures
         * @returns {Promise<Result<string[], string>>} - A promise that resolves when all messages are sent successfully.
         */
        sendSignedMessageBatch: async (
            data: torii.Message[]
        ): Promise<Result<string[], string>> => {
            try {
                // Publish the batch of already signed messages
                return ok(await sdkClient.publishMessageBatch(data));
            } catch (error) {
                console.error("Failed to send signed message batch:", error);
                throw error;
            }
        },

        /**
         * Gets tokens based on the provided request.
         *
         * @param {GetTokenRequest} request
         * @returns {Promise<torii.Tokens>}
         */
        getTokens: async (request: GetTokenRequest): Promise<torii.Tokens> => {
            if (grpcClient) {
                const { contractAddresses, tokenIds, pagination } =
                    parseTokenRequest(request);
                return await grpcClient.getTokens({
                    contract_addresses: contractAddresses,
                    token_ids: tokenIds,
                    pagination,
                });
            }
            return await getTokens(client!, request);
        },

        /**
         * Gets tokens based on the provided request.
         *
         * @param {GetTokenContracts} request
         * @returns {Promise<torii.Tokens>}
         */
        getTokenContracts: async (
            request: GetTokenContracts
        ): Promise<torii.TokenContracts> => {
            if (grpcClient) {
                const { contractAddresses, contractTypes, pagination } =
                    parseTokenRequest(request);
                return await grpcClient.getTokenContracts({
                    contract_addresses: contractAddresses,
                    contract_types: contractTypes as torii.ContractType[],
                    pagination,
                });
            }
            return await getTokenContracts(client!, request);
        },

        /**
         * Gets token balances based on the provided request.
         *
         * @param {GetTokenBalanceRequest} request
         * @returns {Promise<torii.TokenBalances>}
         */
        getTokenBalances: async (
            request: GetTokenBalanceRequest
        ): Promise<torii.TokenBalances> => {
            if (grpcClient) {
                const {
                    contractAddresses,
                    accountAddresses,
                    tokenIds,
                    pagination,
                } = parseTokenRequest(request);
                return await grpcClient.getTokenBalances({
                    contract_addresses: contractAddresses,
                    account_addresses: accountAddresses,
                    token_ids: tokenIds,
                    pagination,
                });
            }
            return await getTokenBalances(client!, request);
        },

        /**
         * Gets token transfers based on the provided request.
         *
         * @param {GetTokenTransferRequest} request
         * @returns {Promise<torii.TokenTransfers>}
         */
        getTokenTransfers: async (
            request: GetTokenTransferRequest
        ): Promise<torii.TokenTransfers> => {
            if (grpcClient) {
                const {
                    contractAddresses,
                    accountAddresses,
                    tokenIds,
                    pagination,
                } = parseTokenRequest(request);
                return await grpcClient.getTokenTransfers({
                    contract_addresses: contractAddresses,
                    account_addresses: accountAddresses,
                    token_ids: tokenIds,
                    pagination,
                });
            }
            return await getTokenTransfers(client!, request);
        },

        getAchievements: async (
            query?: AchievementQueryInput
        ): Promise<AchievementsPage> => {
            if (grpcClient) {
                return await grpcClientInstance.getAchievements(
                    toAchievementQuery(query)
                );
            }
            return await getAchievements(client!, query);
        },

        getPlayerAchievements: async (
            query?: PlayerAchievementQueryInput
        ): Promise<PlayerAchievementsPage> => {
            if (grpcClient) {
                return await grpcClientInstance.getPlayerAchievements(
                    toPlayerAchievementQuery(query)
                );
            }
            return await getPlayerAchievements(client!, query);
        },

        /**
         * Subscribes to token balance updates
         *
         * @param {SubscribeTokenBalanceRequest} request
         * @returns {torii.Subscription}
         */
        onTokenBalanceUpdated: async (
            request: SubscribeTokenBalanceRequest
        ): Promise<torii.Subscription> => {
            const { contractAddresses, accountAddresses, tokenIds } =
                parseTokenRequest(request);
            return await grpcClientInstance.onTokenBalanceUpdated(
                contractAddresses ?? [],
                accountAddresses ?? [],
                tokenIds ?? [],
                safeCallback(request.callback, defaultTokenBalance)
            );
        },

        /**
         * Subscribes to token updates
         *
         * # Parameters
         * @param {SubscribeTokenRequest} request
         * @param {Function} callback - JavaScript function to call on updates
         *
         * # Returns
         * Result containing subscription handle or error
         * @returns torii.Subscription
         */
        onTokenUpdated: async (
            request: SubscribeTokenRequest
        ): Promise<torii.Subscription> => {
            const { contractAddresses, tokenIds } = parseTokenRequest(request);
            return await grpcClientInstance.onTokenUpdated(
                contractAddresses ?? [],
                tokenIds ?? [],
                safeCallback(request.callback, defaultToken)
            );
        },

        /**
         * Subscribes to token transfer updates.
         *
         * @param {SubscribeTokenTransferRequest} request
         * @returns {torii.Subscription}
         */
        onTokenTransferUpdated: async (
            request: SubscribeTokenTransferRequest
        ): Promise<torii.Subscription> => {
            const { contractAddresses, accountAddresses, tokenIds } =
                parseTokenRequest(request);
            return await grpcClientInstance.onTokenTransferUpdated(
                contractAddresses ?? [],
                accountAddresses ?? [],
                tokenIds ?? [],
                safeCallback(request.callback, defaultTokenTransfer)
            );
        },

        /**
         * Updates an existing token balance subscription
         *
         * @param {UpdateTokenBalanceSubscriptionRequest} request
         * @returns {Promise<void>}
         */
        updateTokenBalanceSubscription: async (
            request: UpdateTokenBalanceSubscriptionRequest
        ): Promise<void> => {
            if (grpcClient) {
                const { contractAddresses, accountAddresses, tokenIds } =
                    parseTokenRequest(request);
                return await grpcClient.updateTokenBalanceSubscription(
                    request.subscription,
                    contractAddresses ?? [],
                    accountAddresses ?? [],
                    tokenIds ?? []
                );
            }
            return await updateTokenBalanceSubscription(client!, request);
        },

        /**
         * Updates an existing token transfer subscription
         *
         * @param {UpdateTokenTransferSubscriptionRequest} request
         * @returns {Promise<void>}
         */
        updateTokenTransferSubscription: async (
            request: UpdateTokenTransferSubscriptionRequest
        ): Promise<void> => {
            if (grpcClient) {
                const { contractAddresses, accountAddresses, tokenIds } =
                    parseTokenRequest(request);
                return await grpcClient.updateTokenTransferSubscription(
                    request.subscription,
                    contractAddresses ?? [],
                    accountAddresses ?? [],
                    tokenIds ?? []
                );
            }
            return await updateTokenTransferSubscription(client!, request);
        },

        onAchievementProgressionUpdated: async (
            request: SubscribeAchievementProgressionRequest
        ): Promise<torii.Subscription> => {
            const { callback, ...filters } = request;
            const handler = safeCallback(
                callback,
                defaultAchievementProgression
            );

            if (grpcClient) {
                return await grpcClientInstance.onAchievementProgressionUpdated(
                    filters.worldAddresses ?? null,
                    filters.namespaces ?? null,
                    filters.playerAddresses ?? null,
                    filters.achievementIds ?? null,
                    (progression: any) => handler(progression as any)
                );
            }

            return await onAchievementProgressionUpdatedInternal(
                client!,
                request
            );
        },

        updateAchievementProgressionSubscription: async (
            request: UpdateAchievementProgressionSubscriptionRequest
        ): Promise<void> => {
            if (grpcClient) {
                const { subscription, ...filters } = request;
                await grpcClientInstance.updateAchievementProgressionSubscription(
                    subscription as any,
                    filters.worldAddresses ?? [],
                    filters.namespaces ?? [],
                    filters.playerAddresses ?? [],
                    filters.achievementIds ?? []
                );
                return;
            }

            await updateAchievementProgressionSubscriptionInternal(
                client!,
                request
            );
        },

        /**
         * Updates an existing entity subscription
         *
         * @param {torii.Subscription} subscription - Existing subscription to update
         * @param {torii.Clause} clauses - New clauses for filtering
         * @returns {Promise<void>}
         */
        updateEntitySubscription: async (
            subscription: torii.Subscription,
            clauses: torii.Clause
        ): Promise<void> => {
            return await sdkClient.updateEntitySubscription(
                subscription,
                clauses
            );
        },

        /**
         * Updates an existing event message subscription
         *
         * @param {torii.Subscription} subscription - Existing subscription to update
         * @param {torii.Clause} clauses - New clauses for filtering
         * @returns {Promise<void>}
         */
        updateEventMessageSubscription: async (
            subscription: torii.Subscription,
            clauses: torii.Clause,
            _historical: boolean
        ): Promise<void> => {
            return await grpcClientInstance.updateEventMessageSubscription(
                subscription as any,
                clauses
            );
        },

        /**
         * Gets controllers along with their usernames for the given contract addresses
         *
         * @param {string[]} contract_addresses - Array of contract addresses as hex strings. If empty, all
         *   controllers will be returned.
         * @returns {Promise<torii.Controllers>}
         */
        getControllers: async (
            contract_addresses: string[],
            usernames: string[],
            pagination: torii.Pagination = defaultToriiPagination
        ): Promise<torii.Controllers> => {
            return await sdkClient.getControllers({
                contract_addresses,
                usernames,
                pagination,
            });
        },

        /**
         * Subscribes to token updates
         *
         * # Parameters
         * @param {SubscribeTokenRequest} request
         * @returns {Promise<[torii.Tokens, torii.Subscription]>}
         */
        subscribeToken: async (
            request: SubscribeTokenRequest
        ): Promise<[torii.Tokens, torii.Subscription]> => {
            if (grpcClient) {
                const { contractAddresses, tokenIds, pagination } =
                    parseTokenRequest(request);
                const tokens = await grpcClient.getTokens({
                    contract_addresses: contractAddresses,
                    token_ids: tokenIds,
                    pagination,
                });
                const subscription = await grpcClient.onTokenUpdated(
                    contractAddresses ?? [],
                    tokenIds ?? [],
                    safeCallback(request.callback, defaultToken)
                );
                return [tokens, subscription];
            }
            return await subscribeToken(client!, request);
        },

        getAggregations: async (
            query: torii.AggregationQuery
        ): Promise<AggregationsPage> => {
            return await grpcClientInstance.getAggregations(query);
        },

        onAggregationUpdated: async (
            aggregator_ids: string[] | null | undefined,
            entity_ids: string[] | null | undefined,
            callback: Function
        ): Promise<torii.Subscription> => {
            return await grpcClientInstance.onAggregationUpdated(
                aggregator_ids,
                entity_ids,
                callback
            );
        },

        updateAggregationSubscription: async (
            subscription: torii.Subscription,
            aggregator_ids: string[],
            entity_ids: string[]
        ): Promise<void> => {
            return await grpcClientInstance.updateAggregationSubscription(
                subscription as any,
                aggregator_ids,
                entity_ids
            );
        },

        getActivities: async (
            query: torii.ActivityQuery
        ): Promise<ActivitiesPage> => {
            return await grpcClientInstance.getActivities(query);
        },

        onActivityUpdated: async (
            world_addresses: string[] | null | undefined,
            namespaces: string[] | null | undefined,
            caller_addresses: string[] | null | undefined,
            callback: Function
        ): Promise<torii.Subscription> => {
            return await grpcClientInstance.onActivityUpdated(
                world_addresses,
                namespaces,
                caller_addresses,
                callback
            );
        },

        updateActivitySubscription: async (
            subscription: torii.Subscription,
            world_addresses: string[],
            namespaces: string[],
            caller_addresses: string[]
        ): Promise<void> => {
            return await grpcClientInstance.updateActivitySubscription(
                subscription as any,
                world_addresses,
                namespaces,
                caller_addresses
            );
        },

        executeSql: async (query: string): Promise<SqlQueryResponse> => {
            return await grpcClientInstance.executeSql(query);
        },

        getWorlds: async (worldAddresses?: string[]): Promise<any[]> => {
            return await grpcClientInstance.getWorlds(worldAddresses);
        },
    };
}
