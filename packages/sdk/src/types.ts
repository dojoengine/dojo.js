// packages/sdk/src/types.ts

import * as torii from "@dojoengine/torii-client";

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
 */
export type SchemaType = {
    [namespace: string]: {
        [model: string]: {
            fieldOrder: string[];
            [field: string]: any;
        };
    };
};

/**
 * Options for querying the database
 */
export type QueryOptions = {
    limit?: number;
    offset?: number;
    entityId?: string;
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
 * WhereOptions for queries, including all operators
 */
export interface QueryWhereOptions<TModel> extends QueryOptions {
    /**
     * Conditions to filter the query results.
     */
    where?: {
        /**
         * Field to apply the condition on.
         * Example: { name: { $eq: "Alice" } }
         */
        [P in keyof TModel]?: {
            /**
             * Checks if the field is equal to the specified value.
             * Example: { age: { $is: 25 } }
             */
            $is?: TModel[P];
            /**
             * Checks if the field is equal to the specified value.
             * Example: { score: { $eq: 100 } }
             */
            $eq?: TModel[P];
            /**
             * Checks if the field is not equal to the specified value.
             * Example: { status: { $neq: "inactive" } }
             */
            $neq?: TModel[P];
            /**
             * Checks if the field is greater than the specified value.
             * Example: { height: { $gt: 170 } }
             */
            $gt?: TModel[P];
            /**
             * Checks if the field is greater than or equal to the specified value.
             * Example: { experience: { $gte: 5 } }
             */
            $gte?: TModel[P];
            /**
             * Checks if the field is less than the specified value.
             * Example: { weight: { $lt: 70 } }
             */
            $lt?: TModel[P];
            /**
             * Checks if the field is less than or equal to the specified value.
             * Example: { price: { $lte: 50 } }
             */
            $lte?: TModel[P];
        };
    };
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
export type SubscriptionQueryType<T extends SchemaType> = {
    entityIds?: string[];
} & {
    [K in keyof T]?: {
        [L in keyof T[K]]?:
            | AtLeastOne<{
                  $: SubscriptionWhereOptions<T[K][L]>;
              }>
            | string[];
    };
};

/**
 * QueryType for queries, using QueryWhereOptions
 */
export type QueryType<T extends SchemaType> = {
    entityIds?: string[];
} & {
    [K in keyof T]?: {
        [L in keyof T[K]]?:
            | AtLeastOne<{
                  $: QueryWhereOptions<T[K][L]>;
              }>
            | string[];
    };
};

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
 */
export type ParsedEntity<T extends SchemaType> = {
    entityId: string;
    models: {
        [K in keyof T]: {
            [M in keyof T[K]]?: T[K][M];
        };
    };
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
     * @param {SubscriptionQueryType<T>} [query] - The subscription query to filter the entities.
     * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} [callback] - The callback function to handle the response.
     * @returns {Promise<torii.Subscription>} - A promise that resolves to a Torii subscription.
     */
    subscribeEntityQuery: (
        query: SubscriptionQueryType<T>,
        callback: (response: {
            data?: StandardizedQueryResult<T>;
            error?: Error;
        }) => void,
        options?: { logging?: boolean }
    ) => Promise<torii.Subscription>;

    /**
     * Subscribes to event messages based on the provided query and invokes the callback with the updated data.
     *
     * @template T - The schema type.
     * @param {SubscriptionQueryType<T>} [query] - The subscription query to filter the events.
     * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} [callback] - The callback function to handle the response.
     * @returns {Promise<torii.Subscription>} - A promise that resolves to a Torii subscription.
     */
    subscribeEventQuery: (
        query: SubscriptionQueryType<T>,
        callback: (response: {
            data?: StandardizedQueryResult<T>;
            error?: Error;
        }) => void,
        options?: { logging?: boolean }
    ) => Promise<torii.Subscription>;

    /**
     * Fetches entities from the Torii client based on the provided query.
     *
     * @template T - The schema type.
     * @param {SubscriptionQueryType<T>} query - The query object used to filter entities.
     * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} callback - The callback function to handle the response.
     * @param {number} [limit=100] - The maximum number of entities to fetch per request. Default is 100.
     * @param {number} [offset=0] - The offset to start fetching entities from. Default is 0.
     * @param {{ logging?: boolean }} [options] - Optional settings.
     * @param {boolean} [options.logging] - If true, enables logging of the fetching process. Default is false.
     * @returns {Promise<StandardizedQueryResult<T>>} - A promise that resolves to the standardized query result.
     */
    getEntities: (
        query: QueryType<T>,
        callback: (response: {
            data?: StandardizedQueryResult<T>;
            error?: Error;
        }) => void,
        limit?: number,
        offset?: number,
        options?: { logging?: boolean }
    ) => Promise<StandardizedQueryResult<T>>;

    /**
     * Fetches event messages from the Torii client based on the provided query.
     *
     * @template T - The schema type.
     * @param {QueryType<T>} query - The query object used to filter event messages.
     * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} callback - The callback function to handle the response.
     * @param {number} [limit=100] - The maximum number of event messages to fetch per request. Default is 100.
     * @param {number} [offset=0] - The offset to start fetching event messages from. Default is 0.
     * @param {{ logging?: boolean }} [options] - Optional settings.
     * @param {boolean} [options.logging] - If true, enables logging of the fetching process. Default is false.
     * @returns {Promise<StandardizedQueryResult<T>>} - A promise that resolves to the standardized query result.
     */
    getEventMessages: (
        query: QueryType<T>,
        callback: (response: {
            data?: StandardizedQueryResult<T>;
            error?: Error;
        }) => void,
        limit?: number,
        offset?: number,
        options?: { logging?: boolean }
    ) => Promise<StandardizedQueryResult<T>>;
}
