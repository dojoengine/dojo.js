import type * as torii from "@dojoengine/torii-wasm/types";
import type { Account, StarknetDomain, TypedData } from "starknet";
import { ToriiQueryBuilder } from "./toriiQueryBuilder.ts";

/**
 * Utility type to ensure at least one property is present
 */
type AtLeastOne<T> = {
    [K in keyof T]: Required<Pick<T, K>> & Partial<Omit<T, K>>;
}[keyof T];

/**
 * Primitive types that can be used in queries
 */
export type PrimitiveType = string | number | boolean | string[];

/**
 * Defines the structure of a single model, separating `fieldOrder`
 * from other primitive properties.
 */
export type ModelDefinition = {
    fieldOrder: string[];
} & {
    [key: string]: PrimitiveType; // Other properties must be PrimitiveType
};

/**
 * SchemaType represents the structure of the schema.
 * Each namespace contains models defined by ModelDefinition.
 *
 * @example
 * const schema: SchemaType = {
 *   world: {
 *     Player: {
 *       fieldOrder: ['id', 'name', 'score'],
 *       id: 'felt252',
 *       name: 'string',
 *       score: 'u32'
 *     },
 *     Item: {
 *       fieldOrder: ['id', 'name', 'durability'],
 *       id: 'felt252',
 *       name: 'string',
 *       durability: 'u8'
 *     }
 *   }
 * }
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
 * Options for querying the database
 */
export type QueryOptions = {
    entityId?: string;
};

/**
 * Logical operators for combining multiple conditions
 */

/**
 * Recursively defines the conditions for the `where` clause.
 */
export type WhereCondition<TModel> =
    | {
          [key in torii.LogicalOperator]?: Array<WhereCondition<TModel>>;
      }
    | {
          [P in keyof TModel]?: {
              $is?: TModel[P];
              $eq?: TModel[P];
              $neq?: TModel[P];
              $gt?: TModel[P];
              $gte?: TModel[P];
              $lt?: TModel[P];
              $lte?: TModel[P];
              $in?: TModel[P][];
              $nin?: TModel[P][];
          };
      };

/**
 * WhereOptions for subscriptions, only including the $is operator
 */
export interface SubscriptionWhereOptions<TModel> extends QueryOptions {
    where?: {
        [P in keyof TModel]?: {
            $is?: TModel[P];
        };
    };
}

/**
 * WhereOptions for queries, including all operators and logical operators
 */
export interface QueryWhereOptions<TModel> extends QueryOptions {
    /**
     * Conditions to filter the query results.
     */
    where?: WhereCondition<TModel>;
}

/**
 * SubscriptionQueryType for subscriptions, only using SubscriptionWhereOptions.
 *
 * This type defines the structure of a subscription query, which can be used to subscribe to changes in the data.
 * It allows specifying conditions to filter the subscription results based on the provided schema.
 *
 * @template T - The schema type.
 *
 * @property {string[]} [entityIds] - An optional array of entity IDs to subscribe to. If provided, the subscription will be limited to these entities.
 *
 * @property {Object} [K in keyof T] - A mapping of namespaces in the schema.
 *
 * @property {Object} [L in keyof T[K]] - A mapping of models within each namespace.
 *
 * @property {AtLeastOne<{ $: SubscriptionWhereOptions<T[K][L]> }> | string[]} [L] -
 * - An object containing at least one SubscriptionWhereOptions condition to filter the subscription results.
 * - Alternatively, an array of strings representing specific values to subscribe to.
 */
export type SubscriptionQueryType<T extends SchemaType> =
    | BaseQueryType
    | {
          [K in keyof T]?: {
              [L in keyof T[K]]?:
                  | AtLeastOne<{
                        $: SubscriptionWhereOptions<T[K][L]>;
                    }>
                  | string[];
          };
      };

export type BaseQueryType = {
    entityIds?: string[];
};

/**
 * Query type with model conditions
 */
export type ModelQueryType<T extends SchemaType> = {
    [K in keyof T]?: {
        [L in keyof T[K]]?:
            | AtLeastOne<{
                  $: QueryWhereOptions<T[K][L]>;
              }>
            | string[];
    };
};

/**
 * Combined QueryType using union of base and model types
 */
export type QueryType<T extends SchemaType> = BaseQueryType | ModelQueryType<T>;

/**
 * Result of a query
 */
export type QueryResult<T extends SchemaType> = {
    [K in keyof T]: {
        [L in keyof T[K]]: Array<{
            [P in keyof T[K][L]]: T[K][L][P] extends SchemaType
                ? QueryResult<T[K][L][P]>
                : T[K][L][P];
        }>;
    };
};

/**
 * Standardized result of a query
 */
export type StandardizedQueryResult<T extends SchemaType> = Array<
    ParsedEntity<T>
>;

/**
 * Parsed entity with its ID and models.
 * Ensures that each model's data adheres to the schema's field types.
 *
 * @example
 * // Given a schema:
 * const schema: SchemaType = {
 *   world: {
 *     Player: {
 *       fieldOrder: ['id', 'name', 'score'],
 *       id: 'felt252',
 *       name: 'string',
 *       score: 'u32'
 *     }
 *   }
 * };
 *
 * // A ParsedEntity might look like:
 * const parsedEntity: ParsedEntity<typeof schema> = {
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
 * Utility type to extract all models' data from SchemaType without `fieldOrder`
 */
export type UnionOfModelData<T extends SchemaType> = {
    [K in keyof T]: {
        [L in keyof T[K]]: Omit<T[K][L], "fieldOrder">;
    }[keyof T[K]];
}[keyof T];

export type ToriiResponse<
    T extends SchemaType,
    Historical extends boolean
> = Historical extends true
    ? StandardizedQueryResult<T>[]
    : StandardizedQueryResult<T>;

export type SubscribeResponse<
    T extends SchemaType,
    Historical extends boolean
> = [ToriiResponse<T, Historical>, torii.Subscription];

export interface GetTokenRequest {
    contractAddresses?: string[];
    tokenIds?: string[];
}

export interface GetTokenBalanceRequest extends GetTokenRequest {
    accountAddresses?: string[];
}

type Success<T> = {
    data: T;
    error: undefined;
};

type Failure<E> = {
    data: undefined;
    error: E;
};

export type SubscriptionCallbackArgs<T, E = Error> = Success<T> | Failure<E>;

// ToriiResponse<T, Historical>
export type SubscriptionCallback<T> = (
    response: SubscriptionCallbackArgs<T>
) => void;

export type SubscribeTokenBalanceRequest = GetTokenBalanceRequest & {
    callback: SubscriptionCallback<torii.TokenBalance>;
};

export type UpdateTokenBalanceSubscriptionRequest = GetTokenBalanceRequest & {
    subscription: torii.Subscription;
};

/**
 * SDK interface for interacting with the DojoEngine.
 *
 * @template T - The schema type.
 */
export interface SDK<T extends SchemaType> {
    /**
     * The Torii client instance.
     */
    client: torii.ToriiClient;

    /**
     * Subscribes to entity updates based on the provided query and invokes the callback with the updated data.
     *
     * @template T - The schema type.
     * @param {SubscribeParams<T, false>} params - Parameters object
     * @returns {Promise<SubscribeResponse<T, false>>} - A promise that resolves to a Torii subscription.
     */
    subscribeEntityQuery: (
        params: SubscribeParams<T, false>
    ) => Promise<SubscribeResponse<T, false>>;

    /**
     * Subscribes to event messages based on the provided query and invokes the callback with the updated data.
     *
     * @template T - The schema type.
     * @template Historical - Wether to include historical events or not.
     * @param {SubscribeParams<T, Historical>} params - Parameters object
     * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} [callback] - The callback function to handle the response.
     * @returns {Promise<SubscribeResponse<T, Historical>>} - A promise that resolves to a Torii subscription.
     */
    subscribeEventQuery: <Historical extends boolean = false>(
        params: SubscribeParams<T, Historical>
    ) => Promise<SubscribeResponse<T, Historical>>;

    /**
     * Subscribes to token balance updates
     *
     * # Parameters
     * @param {SubscribeTokenBalanceRequest} request
     * @returns {Promise<[torii.TokenBalances, torii.Subscription]>}
     */
    subscribeTokenBalance: (
        request: SubscribeTokenBalanceRequest
    ) => Promise<[torii.TokenBalances, torii.Subscription]>;

    /**
     * Fetches entities from the Torii client based on the provided query.
     *
     * @template T - The schema type.
     * @param {GetParams<T, false>} params - Parameters object
     * @returns {Promise<ToriiResponse<T, false>>} - A promise that resolves to the standardized query result.
     */
    getEntities: (params: GetParams<T>) => Promise<ToriiResponse<T, false>>;

    /**
     * Fetches event messages from the Torii client based on the provided query.
     *
     * @template T - The schema type.
     * @template Historical - Wether to include historical events or not.
     * @param {GetParams<T, Historical>} params - Parameters object
     * @returns {Promise<ToriiResponse<T, Historical>>} - A promise that resolves to the standardized query result.
     */
    getEventMessages: <Historical extends boolean = false>(
        params: GetParams<T, Historical>
    ) => Promise<ToriiResponse<T, Historical>>;

    generateTypedData: <M extends UnionOfModelData<T>>(
        nsModel: string,
        message: M,
        modelMapping?: Array<{ name: string; type: string }>,
        domain?: StarknetDomain
    ) => TypedData;

    sendMessage: (data: TypedData, account: Account) => Promise<void>;

    /**
     * @param {string[]} contract_addresses
     * @param {string[]} token_ids
     * @returns {Promise<torii.Tokens>}
     */
    getTokens(request: GetTokenRequest): Promise<torii.Tokens>;

    /**
     * @param {string[]} account_addresses
     * @param {string[]} contract_addresses
     * @param {string[]} token_ids
     * @returns {Promise<torii.TokenBalances>}
     */
    getTokenBalances(
        request: GetTokenBalanceRequest
    ): Promise<torii.TokenBalances>;

    /**
     * Subscribes to token balance updates
     *
     * # Parameters
     * @param {string[]} contract_addresses - Array of contract addresses to filter (empty for all)
     * @param {string[]} account_addresses - Array of account addresses to filter (empty for all)
     * @param {string[]} token_ids - Array of token ids to filter (empty for all)
     * @param {Funtion} callback - JavaScript function to call on updates
     *
     * # Returns
     * Result containing subscription handle or error
     * @returns torii.Subscription
     */
    onTokenBalanceUpdated: (
        request: SubscribeTokenBalanceRequest
    ) => torii.Subscription;

    /**
     * Updates an existing token balance subscription
     *
     * # Parameters
     * @param {torii.Subscription} subscription - Existing subscription to update
     * @param {string[]} contract_addresses - New array of contract addresses to filter
     * @param {string[]} account_addresses - New array of account addresses to filter
     * @param {string[]} token_ids - New array of token ids to filter
     *
     * # Returns
     * Result containing unit or error
     * @returns {Promise<void>}
     */
    updateTokenBalanceSubscription: (
        request: UpdateTokenBalanceSubscriptionRequest
    ) => Promise<void>;

    /**
     * Updates an existing entity subscription
     *
     * # Parameters
     * @param {torii.Subscription} subscription - Existing subscription to update
     * @param {torii.EntityKeysClause[]} clauses - New array of key clauses for filtering
     *
     * # Returns
     * Result containing unit or error
     * @returns {Promise<void>}
     */
    updateEntitySubscription: (
        subscription: torii.Subscription,
        clauses: torii.EntityKeysClause[]
    ) => Promise<void>;

    /**
     * Updates an existing event message subscription
     *
     * # Parameters
     * @param {torii.Subscription} subscription - Existing subscription to update
     * @param {torii.EntityKeysClause[]} clauses - New array of key clauses for filtering
     * @param {boolean} historical - Whether to include historical messages
     *
     * # Returns
     * Result containing unit or error
     * @returns {Promise<void>}
     */
    updateEventMessageSubscription: (
        subscription: torii.Subscription,
        clauses: torii.EntityKeysClause[],
        historical: boolean
    ) => Promise<void>;

    /**
     * Gets controllers along with their usernames for the given contract addresses
     *
     * # Parameters
     * @param {string[]} contract_addresses - Array of contract addresses as hex strings. If empty, all
     *   controllers will be returned.
     *
     * # Returns
     * Result containing controllers or error
     * @returns {Promise<torii.Controllers>}
     */
    getControllers: (
        contract_addresses: string[]
    ) => Promise<torii.Controllers>;

    /**
     * Convert torii clause into EntityKeysClause[];
     *
     * @param {query} query - ToriiQueryBuilder
     * @returns [ToriiResponse<T,false>,torii.EntityKeysClause[]]
     */
    toriiQueryIntoHashedKeys: (
        query: ToriiQueryBuilder<T>
    ) => Promise<[ToriiResponse<T, false>, torii.EntityKeysClause[]]>;
    /**
     * Convert torii clause into EntityKeysClause[];
     *
     * @param {query} query - ToriiQueryBuilder
     * @returns [ToriiResponse<T,false>,torii.EntityKeysClause[]]
     */
    toriiEventMessagesQueryIntoHashedKeys: <H extends boolean>(
        query: ToriiQueryBuilder<T>,
        historical: H
    ) => Promise<[ToriiResponse<T, H>, torii.EntityKeysClause[]]>;
}

export type SDKClientConfig = Partial<
    Omit<torii.ClientConfig, "worldAddress">
> & { worldAddress: torii.ClientConfig["worldAddress"] };

/**
 * Configuration interface for the SDK.
 */
export interface SDKConfig {
    /**
     * Configuration for the Torii client.
     * This includes settings such as the endpoint URL, authentication details, etc.
     */
    client: SDKClientConfig;

    /**
     * The Starknet domain configuration.
     * This is used for generating typed data and signing messages.
     * It typically includes details like the chain ID, name, and version.
     */
    domain: StarknetDomain;
    /**
     * Wether to include logger in queries and subscdription.
     * Could be useful while debugging
     */
    withLogger?: boolean;
}

export interface SDKFunctionOptions {
    // If true, enables logging of the fetching process. Default is false.
    logging?: boolean;
}

export interface SubscribeParams<
    T extends SchemaType,
    Historical extends boolean = false
> {
    // Query object used to filter entities.
    query: ToriiQueryBuilder<T>;
    // The callback function to handle the response.
    callback: SubscriptionCallback<ToriiResponse<T, Historical>>;
    // historical events
    historical?: Historical;
}

export interface GetParams<
    T extends SchemaType,
    Historical extends boolean = false
> {
    // The query object used to filter entities.
    query: ToriiQueryBuilder<T>;
    // historical events
    historical?: Historical;
}
export { ToriiQueryBuilder };
