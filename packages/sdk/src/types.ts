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
export type PrimitiveType = string | number | boolean;

/**
 * SchemaType represents the structure of the schema
 */
export type SchemaType = {
    [key: string]: {
        [key: string]: any;
    };
};

/**
 * Options for querying the database
 */
export type QueryOptions = {
    limit?: number; // Limit the number of results returned
    offset?: number; // Offset the results returned
    entityId?: string; // Get the specific entity by ID. Which is the key in the db.
};

/**
 * Options for querying with conditions
 */
export interface WhereOptions extends QueryOptions {
    where?: Record<
        string,
        {
            // Add more operators as needed
            $eq?: PrimitiveType;
            $neq?: PrimitiveType;
            $gt?: PrimitiveType;
            $gte?: PrimitiveType;
            $lt?: PrimitiveType;
            $lte?: PrimitiveType;
        }
    >;
}

/**
 * Used for complex queries in fetching data
 */
export type QueryType<T extends SchemaType> = {
    entityIds?: string[];
} & {
    [K in keyof T]?: {
        [L in keyof T[K]]?: AtLeastOne<{
            $: WhereOptions;
        }>;
    };
};

/**
 * Used for subscription queries
 */
export type SubscriptionQueryType<T extends SchemaType> = {
    entityIds?: string[];
} & {
    [Entity in keyof T]?: {
        [Model in keyof T[Entity]]?: true | (keyof T[Entity][Model])[];
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
 * Parsed entity with its ID and models
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
     * @param {{ logging?: boolean }} [options] - Optional settings for the subscription.
     * @returns {Promise<torii.Subscription>} - A promise that resolves to a Torii subscription.
     *
     * @example
     * const subscription = await subscribeEntityQuery(query, (response) => {
     *     if (response.error) {
     *         console.error("Error:", response.error);
     *     } else {
     *         console.log("Data:", response.data);
     *     }
     * }, { logging: true });
     */
    subscribeEntityQuery: (
        query: SubscriptionQueryType<T>,
        callback: (response: {
            data?: StandardizedQueryResult<T>;
            error?: Error;
        }) => void
    ) => Promise<torii.Subscription>;

    /**
     * Subscribes to event messages based on the provided query and invokes the callback with the updated data.
     *
     * @template T - The schema type.
     * @param {SubscriptionQueryType<T>} [query] - The subscription query to filter the events.
     * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} [callback] - The callback function to handle the response.
     * @param {{ logging?: boolean }} [options] - Optional settings for the subscription.
     * @returns {Promise<torii.Subscription>} - A promise that resolves to a Torii subscription.
     *
     * @example
     * const subscription = await subscribeEventQuery(query, (response) => {
     *     if (response.error) {
     *         console.error("Error:", response.error);
     *     } else {
     *         console.log("Data:", response.data);
     *     }
     * }, { logging: true });
     */
    subscribeEventQuery: (
        query: SubscriptionQueryType<T>,
        callback: (response: {
            data?: StandardizedQueryResult<T>;
            error?: Error;
        }) => void
    ) => Promise<torii.Subscription>;

    /**
     * Fetches entities from the Torii client based on the provided query.
     *
     * @template T - The schema type.
     * @param {QueryType<T>} query - The query object used to filter entities.
     * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} callback - The callback function to handle the response.
     * @param {number} [limit=100] - The maximum number of entities to fetch per request. Default is 100.
     * @param {number} [offset=0] - The offset to start fetching entities from. Default is 0.
     * @param {{ logging?: boolean }} [options] - Optional settings.
     * @param {boolean} [options.logging] - If true, enables logging of the fetching process. Default is false.
     * @returns {Promise<StandardizedQueryResult<T>>} - A promise that resolves to the standardized query result.
     *
     * @example
     * const result = await getEntities(query, (response) => {
     *     if (response.error) {
     *         console.error("Error:", response.error);
     *     } else {
     *         console.log("Data:", response.data);
     *     }
     * }, 100, 0, { logging: true });
     */
    getEntities: (
        query: QueryType<T>,
        callback: (response: {
            data?: StandardizedQueryResult<T>;
            error?: Error;
        }) => void
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
        }) => void
    ) => Promise<StandardizedQueryResult<T>>;
}
