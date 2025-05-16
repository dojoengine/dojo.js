import type * as torii from "@dojoengine/torii-wasm/types";
import type { Result } from "neverthrow";
import type { Account, StarknetDomain, TypedData } from "starknet";
import type { Pagination } from "./pagination.ts";
import { ToriiQueryBuilder } from "./toriiQueryBuilder.ts";

/**
 * SchemaType represents the structure of the schema.
 * Each namespace contains models defined by ModelDefinition.
 *
 * @example
 * const schema: SchemaType = {
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
        [L in keyof T[K]]: T[K][L];
    }[keyof T[K]];
}[keyof T];

export type ToriiResponse<T extends SchemaType> = Pagination<
    T,
    StandardizedQueryResult<T>
>;

export type SubscribeResponse<T extends SchemaType> = [
    ToriiResponse<T>,
    torii.Subscription,
];

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
        params: SubscribeParams<T>
    ) => Promise<SubscribeResponse<T>>;

    /**
     * Subscribes to event messages based on the provided query and invokes the callback with the updated data.
     *
     * @template T - The schema type.
     * @param {SubscribeParams<T>} params - Parameters object
     * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} [callback] - The callback function to handle the response.
     * @returns {Promise<SubscribeResponse<T>>} - A promise that resolves to a Torii subscription.
     */
    subscribeEventQuery: (
        params: SubscribeParams<T>
    ) => Promise<SubscribeResponse<T>>;

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
    getEntities: (params: GetParams<T>) => Promise<ToriiResponse<T>>;

    /**
     * Fetches event messages from the Torii client based on the provided query.
     *
     * @template T - The schema type.
     * @param {GetParams<T>} params - Parameters object
     * @returns {Promise<ToriiResponse<T>>} - A promise that resolves to the standardized query result.
     */
    getEventMessages: (params: GetParams<T>) => Promise<ToriiResponse<T>>;

    generateTypedData: <M extends UnionOfModelData<T>>(
        nsModel: string,
        message: M,
        modelMapping?: Array<{ name: string; type: string }>,
        additionalTypes?: Record<string, Array<{ name: string; type: string }>>
    ) => TypedData;

    sendMessage: (
        data: TypedData,
        account?: Account
    ) => Promise<Result<Uint8Array, string>>;

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
     * @param {torii.Clause} clauses - New array of key clauses for filtering
     *
     * # Returns
     * Result containing unit or error
     * @returns {Promise<void>}
     */
    updateEntitySubscription: (
        subscription: torii.Subscription,
        clauses: torii.Clause
    ) => Promise<void>;

    /**
     * Updates an existing event message subscription
     *
     * # Parameters
     * @param {torii.Subscription} subscription - Existing subscription to update
     * @param {torii.Clause} clauses - New array of key clauses for filtering
     * @param {boolean} historical - Whether to include historical messages
     *
     * # Returns
     * Result containing unit or error
     * @returns {Promise<void>}
     */
    updateEventMessageSubscription: (
        subscription: torii.Subscription,
        clauses: torii.Clause,
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
     * If you use torii builtin's OffchainMessages, we'll require that you provide signer
     */
    signer?: torii.SigningKey;
    /**
     * If you use torii builtin's OffchainMessages, we'll require that you provide identity.
     * This is your backend wallet address. This will be used to sign offchain messages. This *has* to map to `identity` field in your dojo model
     */
    identity?: string;
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

export interface SubscribeParams<T extends SchemaType> {
    // Query object used to filter entities.
    query: ToriiQueryBuilder<T>;
    // The callback function to handle the response.
    callback: SubscriptionCallback<StandardizedQueryResult<T>>;
    // @deprecated: use `query.historical` instead
    historical?: boolean;
}

export interface GetParams<T extends SchemaType> {
    // The query object used to filter entities.
    query: ToriiQueryBuilder<T>;
    // @deprecated: use `query.historical` instead
    historical?: boolean;
}
export { ToriiQueryBuilder };
