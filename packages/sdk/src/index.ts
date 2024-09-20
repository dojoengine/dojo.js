import * as torii from "@dojoengine/torii-client";

import { getEntities } from "./getEntities";
import { getEventMessages } from "./getEventMessages";
import { subscribeEntityQuery } from "./subscribeEntityQuery";
import { subscribeEventQuery } from "./subscribeEventQuery";
import { SchemaType, SDK } from "./types";

export * from "./types";

/**
 * Creates a new Torii client instance.
 *
 * @param {torii.ClientConfig} config - The configuration object for the Torii client.
 * @returns {Promise<torii.ToriiClient>} - A promise that resolves to the Torii client instance.
 */
export async function createClient(
    config: torii.ClientConfig
): Promise<torii.ToriiClient> {
    return await torii.createClient(config);
}

/**
 * Initializes the SDK with the provided configuration and schema.
 *
 * @template T - The schema type.
 * @param {torii.ClientConfig} options - The configuration object for the Torii client.
 * @param {T} schema - The schema object defining the structure of the data.
 * @returns {Promise<SDK<T>>} - A promise that resolves to the initialized SDK.
 */
export async function init<T extends SchemaType>(
    options: torii.ClientConfig,
    schema: T
): Promise<SDK<T>> {
    const client = await createClient(options);

    return {
        client,
        /**
         * Subscribes to entity queries.
         *
         * @param {SubscriptionQueryType<T>} query - The query object used to filter entities.
         * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} callback - The callback function to handle the response.
         * @param {{ logging?: boolean }} [options] - Optional settings.
         * @returns {Promise<void>} - A promise that resolves when the subscription is set up.
         */
        subscribeEntityQuery: (query, callback, options) =>
            subscribeEntityQuery(client, query, schema, callback, options),
        /**
         * Subscribes to event queries.
         *
         * @param {SubscriptionQueryType<T>} query - The query object used to filter events.
         * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} callback - The callback function to handle the response.
         * @param {{ logging?: boolean }} [options] - Optional settings.
         * @returns {Promise<void>} - A promise that resolves when the subscription is set up.
         */
        subscribeEventQuery: (query, callback, options) =>
            subscribeEventQuery(client, query, schema, callback, options),
        /**
         * Fetches entities based on the provided query.
         *
         * @param {SubscriptionQueryType<T>} query - The query object used to filter entities.
         * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} callback - The callback function to handle the response.
         * @param {number} [limit=100] - The maximum number of entities to fetch per request. Default is 100.
         * @param {number} [offset=0] - The offset to start fetching entities from. Default is 0.
         * @param {{ logging?: boolean }} [options] - Optional settings.
         * @returns {Promise<StandardizedQueryResult<T>>} - A promise that resolves to the standardized query result.
         */
        getEntities: (query, callback, limit, offset, options) =>
            getEntities(
                client,
                query,
                schema,
                callback,
                limit,
                offset,
                options
            ),
        /**
         * Fetches event messages based on the provided query.
         *
         * @param {SubscriptionQueryType<T>} query - The query object used to filter event messages.
         * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} callback - The callback function to handle the response.
         * @param {number} [limit=100] - The maximum number of event messages to fetch per request. Default is 100.
         * @param {number} [offset=0] - The offset to start fetching event messages from. Default is 0.
         * @param {{ logging?: boolean }} [options] - Optional settings.
         * @returns {Promise<StandardizedQueryResult<T>>} - A promise that resolves to the standardized query result.
         */
        getEventMessages: (query, callback, limit, offset, options) =>
            getEventMessages(
                client,
                query,
                schema,
                callback,
                limit,
                offset,
                options
            ),
    };
}
