import type * as torii from "@dojoengine/torii-wasm/types";
import type {
    Aggregations as ToriiAggregations,
    AggregationEntry as ToriiAggregationEntry,
    AggregationQuery as ToriiAggregationQuery,
    Activities as ToriiActivities,
    Activity as ToriiActivity,
    ActivityQuery as ToriiActivityQuery,
} from "@dojoengine/torii-wasm/types";
import type { Result } from "neverthrow";
import type { Account, StarknetDomain, TypedData } from "starknet";
import type { Pagination } from "./pagination";
import type { ToriiQueryBuilder } from "./toriiQueryBuilder";

/**
 * SchemaType represents the structure of your Dojo world models.
 * Each namespace contains models defined by their field types.
 *
 * @example
 * ```typescript
 * const schema = {
 *   world: {
 *     Player: {
 *       id: 'felt252',
 *       name: 'string',
 *       score: 'u32'
 *     },
 *     Item: {
 *       id: 'felt252',
 *       name: 'string',
 *       durability: 'u8'
 *     }
 *   }
 * } satisfies SchemaType;
 * ```
 */
export type SchemaType = {
    /**
     * namespace: Your namespace for grouping related models.
     * This is typically used to organize models by their domain or context.
     * For example, 'world', 'game', 'inventory', etc.
     */
    [namespace: string]: {
        /**
         * model: Your model name, case sensitive.
         * This represents a specific entity or concept within your namespace.
         * For example, 'Player', 'Item', 'Quest', etc.
         */
        [model: string]: {
            /**
             * Dynamic fields of the model.
             * These can be of any type, typically representing the properties of your model.
             */
            [field: string]: any;
        };
    };
};

/**
 * Standardized result of a query - an array of parsed entities.
 */
export type StandardizedQueryResult<T extends SchemaType> = Array<
    ParsedEntity<T>
>;

/**
 * Parsed entity with its ID and models.
 * Ensures that each model's data adheres to the schema's field types.
 *
 * @example
 * ```typescript
 * // Given a schema:
 * const schema = {
 *   world: {
 *     Player: {
 *       id: 'felt252',
 *       name: 'string',
 *       score: 'u32'
 *     }
 *   }
 * } satisfies SchemaType;
 *
 * // A ParsedEntity might look like:
 * const entity: ParsedEntity<typeof schema> = {
 *   entityId: '0x123',
 *   models: {
 *     world: {
 *       Player: {
 *         id: '0x123',
 *         name: 'Alice',
 *         score: 100
 *       }
 *     }
 *   }
 * };
 * ```
 */
export type ParsedEntity<T extends SchemaType> = {
    entityId: string;
    models: {
        [K in keyof T]: {
            [M in keyof T[K]]?: T[K][M] extends object
                ? Partial<T[K][M]>
                : T[K][M];
        };
    };
};

/**
 * Utility type to extract all models' data from SchemaType.
 * This is useful for typing messages and model data.
 */
export type UnionOfModelData<T extends SchemaType> = {
    [K in keyof T]: {
        [L in keyof T[K]]: T[K][L];
    }[keyof T[K]];
}[keyof T];

/**
 * Response type for queries with pagination support.
 */
export type ToriiResponse<T extends SchemaType> = Pagination<
    T,
    StandardizedQueryResult<T>
>;

/**
 * Response type for subscriptions - includes initial data and subscription handle.
 */
export type SubscribeResponse<T extends SchemaType> = [
    ToriiResponse<T>,
    torii.Subscription,
];

export type AttributesFilter = {
    name: string;
    value: string;
};

/**
 * Request type for getting tokens.
 */
export interface GetTokenRequest {
    contractAddresses?: string[];
    attributesFilter?: AttributesFilter[];
    tokenIds?: string[];
    pagination?: torii.Pagination;
}

/**
 * Request type for getting token balances.
 */
export interface GetTokenBalanceRequest extends GetTokenRequest {
    accountAddresses?: string[];
}

export type ContractType =
    | "WORLD"
    | "ERC20"
    | "ERC721"
    | "ERC1155"
    | "UDC"
    | "OTHER";

export type GetTokenContracts = {
    contractAddresses?: string[];
    contractTypes?: string[];
    pagination?: torii.Pagination;
};

export interface GetTokenTransferRequest {
    contractAddresses?: string[];
    accountAddresses?: string[];
    tokenIds?: string[];
    pagination?: torii.Pagination;
}

/**
 * Success result for subscription callbacks.
 */
type Success<T> = {
    data: T;
    error: undefined;
};

/**
 * Failure result for subscription callbacks.
 */
type Failure<E> = {
    data: undefined;
    error: E;
};

/**
 * Arguments passed to subscription callbacks.
 * Either contains data or an error, but not both.
 */
export type SubscriptionCallbackArgs<T, E = Error> = Success<T> | Failure<E>;

/**
 * Callback function type for subscriptions.
 */
export type SubscriptionCallback<T> = (
    response: SubscriptionCallbackArgs<T>
) => void;

/**
 * Input shape for aggregation queries.
 */
export interface AggregationQueryInput {
    aggregatorIds?: ToriiAggregationQuery["aggregator_ids"];
    entityIds?: ToriiAggregationQuery["entity_ids"];
    pagination?: torii.Pagination;
}

/**
 * Aggregation entry returned by Torii aggregations endpoint.
 */
export interface AggregationEntryView {
    id: ToriiAggregationEntry["id"];
    aggregatorId: ToriiAggregationEntry["aggregator_id"];
    entityId: ToriiAggregationEntry["entity_id"];
    value: ToriiAggregationEntry["value"];
    displayValue: ToriiAggregationEntry["display_value"];
    position: ToriiAggregationEntry["position"];
    modelId: ToriiAggregationEntry["model_id"];
    createdAt: ToriiAggregationEntry["created_at"];
    updatedAt: ToriiAggregationEntry["updated_at"];
}

/**
 * Aggregations page response with cursor support.
 */
export interface AggregationsPage {
    items: AggregationEntryView[];
    nextCursor?: ToriiAggregations["next_cursor"];
    next_cursor?: ToriiAggregations["next_cursor"];
}

/**
 * Input shape for activity queries.
 */
export interface ActivityQueryInput {
    worldAddresses?: ToriiActivityQuery["world_addresses"];
    namespaces?: ToriiActivityQuery["namespaces"];
    callerAddresses?: ToriiActivityQuery["caller_addresses"];
    fromTime?: ToriiActivityQuery["from_time"];
    toTime?: ToriiActivityQuery["to_time"];
    pagination?: torii.Pagination;
}

/**
 * Subscription filters for activity updates.
 */
export interface ActivitySubscriptionQuery {
    worldAddresses?: ToriiActivityQuery["world_addresses"];
    namespaces?: ToriiActivityQuery["namespaces"];
    callerAddresses?: ToriiActivityQuery["caller_addresses"];
}

/**
 * Activity entry returned by Torii activities endpoint.
 */
export interface ActivityEntry {
    id: ToriiActivity["id"];
    worldAddress: ToriiActivity["world_address"];
    namespace: ToriiActivity["namespace"];
    callerAddress: ToriiActivity["caller_address"];
    sessionStart: ToriiActivity["session_start"];
    sessionEnd: ToriiActivity["session_end"];
    actionCount: ToriiActivity["action_count"];
    actions: ToriiActivity["actions"];
    updatedAt: ToriiActivity["updated_at"];
}

/**
 * Activities page response with cursor support.
 */
export interface ActivitiesPage {
    items: ActivityEntry[];
    nextCursor?: ToriiActivities["next_cursor"];
    next_cursor?: ToriiActivities["next_cursor"];
}

export interface AchievementTaskData {
    task_id: string;
    description: string;
    total: number;
    total_completions: number;
    completion_rate: number;
    created_at: number;
}

export interface AchievementData {
    id: string;
    world_address: string;
    namespace: string;
    entity_id: string;
    hidden: boolean;
    index: number;
    points: number;
    start: string;
    end: string;
    group: string;
    icon: string;
    title: string;
    description: string;
    tasks: AchievementTaskData[];
    data: string;
    total_completions: number;
    completion_rate: number;
    created_at: number;
    updated_at: number;
}

export interface TaskProgressData {
    task_id: string;
    count: number;
    completed: boolean;
}

export interface PlayerAchievementStatsData {
    total_points: number;
    completed_achievements: number;
    total_achievements: number;
    completion_percentage: number;
    last_achievement_at?: number;
    created_at: number;
    updated_at: number;
}

export interface PlayerAchievementProgressData {
    achievement: AchievementData;
    task_progress: TaskProgressData[];
    completed: boolean;
    progress_percentage: number;
}

export interface PlayerAchievementEntryData {
    player_address: string;
    stats: PlayerAchievementStatsData;
    achievements: PlayerAchievementProgressData[];
}

export interface AchievementProgressionData {
    id: string;
    achievement_id: string;
    task_id: string;
    world_address: string;
    namespace: string;
    player_id: string;
    count: number;
    completed: boolean;
    completed_at?: number;
    created_at: number;
    updated_at: number;
}

export interface AchievementQueryInput {
    worldAddresses?: string[];
    namespaces?: string[];
    hidden?: boolean;
    pagination?: torii.Pagination;
}

export interface PlayerAchievementQueryInput {
    worldAddresses?: string[];
    namespaces?: string[];
    playerAddresses?: string[];
    pagination?: torii.Pagination;
}

export type PlayerAchievementEntryView = PlayerAchievementEntryData;

export interface AchievementsPage {
    items: AchievementData[];
    nextCursor?: string;
    next_cursor?: string;
}

export interface PlayerAchievementsPage {
    items: PlayerAchievementEntryData[];
    nextCursor?: string;
    next_cursor?: string;
}

export interface AchievementProgressionView {
    id: string;
    achievementId: string;
    taskId: string;
    worldAddress: string;
    namespace: string;
    playerId: string;
    count: number;
    completed: boolean;
    completedAt?: number;
    createdAt: number;
    updatedAt: number;
}

export interface AchievementProgressionSubscriptionQuery {
    worldAddresses?: string[];
    namespaces?: string[];
    playerAddresses?: string[];
    achievementIds?: string[];
}

/**
 * SQL query result rows returned by Torii.
 */
export type SqlQueryIntegerValue = bigint | string;
export type SqlQueryValue = string | number | SqlQueryIntegerValue | null;
export type SqlQueryResponse = Array<Record<string, SqlQueryValue>>;

/**
 * Request type for subscribing to token balance updates.
 */
export type SubscribeTokenBalanceRequest = GetTokenBalanceRequest & {
    callback: SubscriptionCallback<torii.TokenBalance>;
};

/**
 * Request type for updating token balance subscriptions.
 */
export type UpdateTokenBalanceSubscriptionRequest = GetTokenBalanceRequest & {
    subscription: torii.Subscription;
};

export type SubscribeTokenRequest = GetTokenRequest & {
    callback: SubscriptionCallback<torii.Token>;
};

export type SubscribeTokenTransferRequest = GetTokenTransferRequest & {
    callback: SubscriptionCallback<torii.TokenTransfer>;
};

export type UpdateTokenTransferSubscriptionRequest = GetTokenTransferRequest & {
    subscription: torii.Subscription;
};

export type SubscribeAchievementProgressionRequest =
    AchievementProgressionSubscriptionQuery & {
        callback: SubscriptionCallback<AchievementProgressionData>;
    };

export type UpdateAchievementProgressionSubscriptionRequest =
    AchievementProgressionSubscriptionQuery & {
        subscription: torii.Subscription;
    };

/**
 * SDK interface for interacting with the DojoEngine.
 * Provides methods for querying, subscribing, and managing your Dojo world.
 *
 * @template T - The schema type defining your world's models.
 *
 * @example
 * ```typescript
 * const sdk = await init<typeof schema>({
 *     client: { worldAddress: "0x...", toriiUrl: "http://localhost:8080" },
 *     domain: { name: "MyApp", version: "1.0.0", chainId: "SN_MAIN" }
 * });
 *
 * // Query entities
 * const { items } = await sdk.getEntities({
 *     query: new ToriiQueryBuilder().withClause(...)
 * });
 *
 * // Subscribe to updates
 * const [initial, subscription] = await sdk.subscribeEntityQuery({
 *     query: new ToriiQueryBuilder().withClause(...),
 *     callback: ({ data, error }) => {
 *         if (error) console.error(error);
 *         else console.log(data);
 *     }
 * });
 * ```
 */
export interface SDK<T extends SchemaType> {
    /**
     * The underlying Torii client instance.
     * Use this for advanced operations not covered by the SDK methods.
     */
    client: torii.ToriiClient;

    /**
     * Subscribes to entity updates based on the provided query.
     * Returns initial data and a subscription handle.
     *
     * @param {SubscribeParams<T>} params - Query and callback parameters
     * @returns {Promise<SubscribeResponse<T>>} - Initial data and subscription handle
     *
     * @example
     * ```typescript
     * const [initial, subscription] = await sdk.subscribeEntityQuery({
     *     query: new ToriiQueryBuilder()
     *         .withClause(KeysClause([ModelsMapping.Player], [address])),
     *     callback: ({ data, error }) => {
     *         if (data) console.log('Entity updated:', data);
     *     }
     * });
     * ```
     */
    subscribeEntityQuery: (
        params: SubscribeParams<T>
    ) => Promise<SubscribeResponse<T>>;

    /**
     * Subscribes to event messages based on the provided query.
     * Returns initial data and a subscription handle.
     *
     * @param {SubscribeParams<T>} params - Query and callback parameters
     * @returns {Promise<SubscribeResponse<T>>} - Initial data and subscription handle
     */
    subscribeEventQuery: (
        params: SubscribeParams<T>
    ) => Promise<SubscribeResponse<T>>;

    /**
     * Subscribes to token balance updates.
     * Returns initial balances and a subscription handle.
     *
     * @param {SubscribeTokenBalanceRequest} request - Filter and callback parameters
     * @returns {Promise<[torii.TokenBalances, torii.Subscription]>} - Initial balances and subscription
     */
    subscribeTokenBalance: (
        request: SubscribeTokenBalanceRequest
    ) => Promise<[torii.TokenBalances, torii.Subscription]>;

    /**
     * Subscribes to token updates
     *
     * # Parameters
     * @param {SubscribeTokenRequest} request
     * @returns {Promise<[torii.Tokens, torii.Subscription]>}
     */
    subscribeToken: (
        request: SubscribeTokenRequest
    ) => Promise<[torii.Tokens, torii.Subscription]>;

    /**
     * Subscribes to token transfer updates.
     *
     * @param {SubscribeTokenTransferRequest} request - Filter and callback parameters
     * @returns {Promise<[torii.TokenTransfers, torii.Subscription]>}
     */
    subscribeTokenTransfer: (
        request: SubscribeTokenTransferRequest
    ) => Promise<[torii.TokenTransfers, torii.Subscription]>;

    /**
     * Fetches entities from the Torii client based on the provided query.
     *
     * @param {GetParams<T>} params - Query parameters
     * @returns {Promise<ToriiResponse<T>>} - Paginated query results
     *
     * @example
     * ```typescript
     * const result = await sdk.getEntities({
     *     query: new ToriiQueryBuilder()
     *         .withClause(KeysClause([ModelsMapping.Player], [address]))
     *         .limit(10)
     * });
     *
     * // Access entities
     * result.items.forEach(entity => {
     *     console.log(entity.models.world.Player);
     * });
     *
     * // Load more if available
     * if (result.hasNextPage()) {
     *     const nextPage = await result.fetchNextPage();
     * }
     * ```
     */
    getEntities: (params: GetParams<T>) => Promise<ToriiResponse<T>>;

    /**
     * Fetches event messages from the Torii client based on the provided query.
     *
     * @param {GetParams<T>} params - Query parameters
     * @returns {Promise<ToriiResponse<T>>} - Paginated query results
     */
    getEventMessages: (params: GetParams<T>) => Promise<ToriiResponse<T>>;

    /**
     * Generates typed data for signing messages.
     * Used for creating off-chain messages that can be verified on-chain.
     *
     * @param {string} nsModel - Model name prefixed with namespace (e.g., "world-Player")
     * @param {M} message - The message data conforming to the model structure
     * @param {Array} modelMapping - Optional custom type mappings
     * @param {Record} additionalTypes - Optional additional EIP-712 types
     * @returns {TypedData} - EIP-712 typed data ready for signing
     */
    generateTypedData: <M extends UnionOfModelData<T>>(
        nsModel: string,
        message: M,
        modelMapping?: Array<{ name: string; type: string }>,
        additionalTypes?: Record<string, Array<{ name: string; type: string }>>
    ) => TypedData;

    /**
     * Sends a signed message to the Torii server.
     * In web environments, requires an Account. In Node.js, uses configured signer.
     *
     * @param {TypedData} data - The typed data to sign and send
     * @param {Account} account - The account to sign with (web only)
     * @returns {Promise<Result<Uint8Array, string>>} - Success with message ID or error
     */
    sendMessage: (
        data: TypedData,
        account?: Account
    ) => Promise<Result<string, string>>;

    /**
     * Sends multiple signed messages to the Torii server in a batch.
     * In web environments, requires an Account. In Node.js, uses configured signer.
     *
     * @param {TypedData[]} data - Array of typed data to sign and send
     * @param {Account} account - The account to sign with (web only)
     * @returns {Promise<Result<string[], string>>} - Success with array of message IDs or error
     */
    sendMessageBatch: (
        data: TypedData[],
        account?: Account
    ) => Promise<Result<string[], string>>;

    /**
     * Sends already signed messages to the Torii server in a batch.
     * This method allows you to send pre-signed messages directly without signing them again.
     *
     * @param {torii.Message[]} data - Array of signed messages with message content and signatures
     * @returns {Promise<Result<string[], string>>} - Success with array of message IDs or error
     */
    sendSignedMessageBatch: (
        data: torii.Message[]
    ) => Promise<Result<string[], string>>;

    /**
     * Gets token information.
     *
     * @param {GetTokenRequest} request - Filter parameters
     * @returns {Promise<torii.Tokens>} - Token information
     */
    getTokens(request: GetTokenRequest): Promise<torii.Tokens>;

    /**
     * Gets token contracts.
     *
     * @param {GetTokenContracts} request - Filter parameters
     * @returns {Promise<torii.TokenContracts>} - Token information
     */
    getTokenContracts(
        request: GetTokenContracts
    ): Promise<torii.TokenContracts>;

    /**
     * Gets token balances for specified accounts.
     *
     * @param {GetTokenBalanceRequest} request - Filter parameters
     * @returns {Promise<torii.TokenBalances>} - Token balances
     */
    getTokenBalances(
        request: GetTokenBalanceRequest
    ): Promise<torii.TokenBalances>;

    /**
     * Gets token transfer history.
     *
     * @param {GetTokenTransferRequest} request - Filter parameters
     * @returns {Promise<torii.TokenTransfers>} - Token transfers
     */
    getTokenTransfers(
        request: GetTokenTransferRequest
    ): Promise<torii.TokenTransfers>;

    /**
     * Gets achievements for the provided filters.
     *
     * @param {AchievementQueryInput} query - Filter parameters
     * @returns {Promise<AchievementsPage>} - Achievements data
     */
    getAchievements(query?: AchievementQueryInput): Promise<AchievementsPage>;

    /**
     * Gets player achievements for the provided filters.
     *
     * @param {PlayerAchievementQueryInput} query - Filter parameters
     * @returns {Promise<PlayerAchievementsPage>} - Player achievements data
     */
    getPlayerAchievements(
        query?: PlayerAchievementQueryInput
    ): Promise<PlayerAchievementsPage>;

    /**
     * Subscribes to achievement progression updates.
     *
     * @param {SubscribeAchievementProgressionRequest} request - Filter and callback parameters
     * @returns {torii.Subscription} - Subscription handle
     */
    onAchievementProgressionUpdated: (
        request: SubscribeAchievementProgressionRequest
    ) => Promise<torii.Subscription>;

    /**
     * Updates an existing achievement progression subscription with new filters.
     *
     * @param {UpdateAchievementProgressionSubscriptionRequest} request - New filter parameters
     * @returns {Promise<void>}
     */
    updateAchievementProgressionSubscription: (
        request: UpdateAchievementProgressionSubscriptionRequest
    ) => Promise<void>;

    /**
     * Creates a subscription for token balance updates.
     * Unlike `subscribeTokenBalance`, this only returns the subscription handle.
     *
     * @param {SubscribeTokenBalanceRequest} request - Filter and callback parameters
     * @returns {torii.Subscription} - Subscription handle
     */
    onTokenBalanceUpdated: (
        request: SubscribeTokenBalanceRequest
    ) => Promise<torii.Subscription>;

    /**
     * Subscribes to token updates
     *
     * # Parameters
     * @param {string[]} contract_addresses - Array of contract addresses to filter (empty for all)
     * @param {string[]} token_ids - Array of token ids to filter (empty for all)
     * @param {Function} callback - JavaScript function to call on updates
     *
     * # Returns
     * Result containing subscription handle or error
     * @returns torii.Subscription
     */
    onTokenUpdated: (
        request: SubscribeTokenRequest
    ) => Promise<torii.Subscription>;

    /**
     * Creates a subscription for token transfer updates.
     *
     * @param {SubscribeTokenTransferRequest} request - Filter and callback parameters
     * @returns {torii.Subscription} - Subscription handle
     */
    onTokenTransferUpdated: (
        request: SubscribeTokenTransferRequest
    ) => Promise<torii.Subscription>;

    /**
     * Updates an existing token balance subscription with new filters.
     *
     * @param {UpdateTokenBalanceSubscriptionRequest} request - New filter parameters
     * @returns {Promise<void>}
     */
    updateTokenBalanceSubscription: (
        request: UpdateTokenBalanceSubscriptionRequest
    ) => Promise<void>;

    /**
     * Updates an existing token transfer subscription with new filters.
     *
     * @param {UpdateTokenTransferSubscriptionRequest} request - New filter parameters
     * @returns {Promise<void>}
     */
    updateTokenTransferSubscription: (
        request: UpdateTokenTransferSubscriptionRequest
    ) => Promise<void>;

    /**
     * Updates an existing entity subscription with new clauses.
     *
     * @param {torii.Subscription} subscription - Existing subscription to update
     * @param {torii.Clause} clauses - New filter clauses
     * @returns {Promise<void>}
     */
    updateEntitySubscription: (
        subscription: torii.Subscription,
        clauses: torii.Clause
    ) => Promise<void>;

    /**
     * Updates an existing event message subscription with new clauses.
     *
     * @param {torii.Subscription} subscription - Existing subscription to update
     * @param {torii.Clause} clauses - New filter clauses
     * @returns {Promise<void>}
     */
    updateEventMessageSubscription: (
        subscription: torii.Subscription,
        clauses: torii.Clause,
        historical: boolean
    ) => Promise<void>;

    /**
     * Gets controller information for the specified contract addresses.
     *
     * @param {string[]} contract_addresses - Contract addresses to query (empty for all)
     * @param {string[]} usernames - usernames to query (empty for all)
     * @param {torii.Pagination} pagination - torii pagination object
     * @returns {Promise<torii.Controllers>} - Controller information
     */
    getControllers: (
        contract_addresses: string[],
        usernames: string[],
        pagination?: torii.Pagination
    ) => Promise<torii.Controllers>;

    /**
     * Gets aggregation entries (leaderboards, rankings, stats).
     */
    getAggregations: (
        query?: AggregationQueryInput
    ) => Promise<AggregationsPage>;

    /**
     * Subscribes to aggregation updates (leaderboards, rankings).
     */
    onAggregationsUpdated: (
        query: AggregationQueryInput,
        callback: (entry: AggregationEntryView, subscriptionId: bigint) => void
    ) => Promise<torii.Subscription>;

    /**
     * Updates an existing aggregations subscription.
     */
    updateAggregationsSubscription: (
        subscription: torii.Subscription,
        query?: AggregationQueryInput
    ) => Promise<void>;

    /**
     * Gets activity data (user session tracking).
     */
    getActivities: (query?: ActivityQueryInput) => Promise<ActivitiesPage>;

    /**
     * Subscribes to activity updates (user sessions).
     */
    onActivitiesUpdated: (
        query: ActivitySubscriptionQuery,
        callback: (activity: ActivityEntry, subscriptionId: bigint) => void
    ) => Promise<torii.Subscription>;

    /**
     * Updates an existing activities subscription.
     */
    updateActivitiesSubscription: (
        subscription: torii.Subscription,
        query?: ActivitySubscriptionQuery
    ) => Promise<void>;

    /**
     * Executes a SQL query against the Torii database.
     */
    executeSql: (query: string) => Promise<SqlQueryResponse>;

    /**
     * Gets metadata for multiple worlds.
     */
    getWorlds: (worldAddresses?: string[]) => Promise<any[]>;
}

/**
 * Client configuration type with required world address.
 */
export type SDKClientConfig = Partial<
    Omit<torii.ClientConfig, "worldAddress">
> & { worldAddress: torii.ClientConfig["worldAddress"] };

/**
 * Configuration interface for initializing the SDK.
 *
 * @example
 * ```typescript
 * const config: SDKConfig = {
 *     client: {
 *         worldAddress: "0x...",
 *         toriiUrl: "http://localhost:8080",
 *         relayUrl: "/ip4/127.0.0.1/tcp/9090"
 *     },
 *     domain: {
 *         name: "MyApp",
 *         version: "1.0.0",
 *         chainId: "SN_MAIN"
 *     },
 *     // Node.js only:
 *     signer: signingKey,
 *     identity: "0x..."
 * };
 * ```
 */
export interface SDKConfig {
    /**
     * Configuration for the Torii client connection.
     */
    client: SDKClientConfig;

    /**
     * The Starknet domain configuration for EIP-712 typed data.
     */
    domain: StarknetDomain;

    /**
     * Signing key for off-chain messages (Node.js only).
     * Required when using `sendMessage` in Node.js environments.
     */
    signer?: torii.SigningKey;

    /**
     * Identity address for off-chain messages (Node.js only).
     * This should match the `identity` field in your Dojo models.
     */
    identity?: string;

    /**
     * Enable debug logging for queries and subscriptions.
     */
    withLogger?: boolean;
}

/**
 * @deprecated - Use SDKConfig.withLogger instead
 */
export interface SDKFunctionOptions {
    logging?: boolean;
}

/**
 * Parameters for subscription methods.
 */
export interface SubscribeParams<T extends SchemaType> {
    /**
     * Query builder instance configured with your filters.
     */
    query: ToriiQueryBuilder<T>;

    /**
     * Callback function invoked when data changes.
     * Receives either data or an error, but not both.
     */
    callback: SubscriptionCallback<StandardizedQueryResult<T>>;

    /**
     * @deprecated - Use `query.historical()` instead
     */
    historical?: boolean;
}

/**
 * Parameters for get/fetch methods.
 */
export interface GetParams<T extends SchemaType> {
    /**
     * Query builder instance configured with your filters.
     */
    query: ToriiQueryBuilder<T>;

    /**
     * @deprecated - Use `query.historical()` instead
     */
    historical?: boolean;
}

export type { ToriiQueryBuilder };
