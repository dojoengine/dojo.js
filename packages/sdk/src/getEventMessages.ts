import * as torii from "@dojoengine/torii-client";

import { convertQueryToClause } from "./convertQuerytoClause";
import { parseEntities } from "./parseEntities";
import { GetParams, SchemaType, StandardizedQueryResult } from "./types";
import { parseHistoricalEvents } from "./parseHistoricalEvents";

/**
 * Fetches event messages from the Torii client based on the provided query.
 *
 * @template T - The schema type.
 * @param {torii.ToriiClient} client - The Torii client instance used to fetch event messages.
 * @param {QueryType<T>} query - The query object used to filter event messages.
 * @param {T} schema - The schema type for the entities.
 * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} callback - The callback function to handle the response.
 * @param {number} [limit=100] - The maximum number of event messages to fetch per request. Default is 100.
 * @param {number} [offset=0] - The offset to start fetching event messages from. Default is 0.
 * @param {{ logging?: boolean }} [options] - Optional settings.
 * @returns {Promise<StandardizedQueryResult<T>>} - A promise that resolves to the standardized query result.
 *
 * @example
 * const eventMessages = await getEventMessages(client, query, schema, (response) => {
 *     if (response.error) {
 *         console.error("Error:", response.error);
 *     } else {
 *         console.log("Data:", response.data);
 *     }
 * }, 100, 0, { logging: true });
 */
export async function getEventMessages<T extends SchemaType>({
    client,
    schema,
    query,
    callback,
    orderBy = [],
    entityModels = [],
    limit = 100, // Default limit
    offset = 0, // Default offset
    options = { logging: false }, // Logging option
    historical = true,
    dontIncludeHashedKeys = true,
    entityUpdatedAfter = 0,
}: GetParams<T> & {
    client: torii.ToriiClient;
    schema: T;
}): Promise<StandardizedQueryResult<T> | StandardizedQueryResult<T>[]> {
    const clause = convertQueryToClause(query, schema);

    let cursor = offset;
    let continueFetching = true;
    let allEntities: torii.Entities = {};

    while (continueFetching) {
        const toriiQuery: torii.Query = {
            limit,
            offset: cursor,
            order_by: orderBy,
            entity_models: entityModels,
            clause,
            dont_include_hashed_keys: dontIncludeHashedKeys,
            entity_updated_after: entityUpdatedAfter,
        };

        try {
            const entities = await client.getEventMessages(
                toriiQuery,
                historical
            );

            if (options?.logging) {
                console.log(`Fetched entities at offset ${cursor}:`, entities);
            }

            Object.assign(allEntities, entities);

            const parsedEntities = historical
                ? parseHistoricalEvents<T>(allEntities, options)
                : parseEntities<T>(allEntities, options);

            callback({ data: parsedEntities });

            if (Object.keys(entities).length < limit) {
                continueFetching = false;
            } else {
                cursor += limit;
            }
        } catch (error) {
            if (options?.logging) {
                console.error("Error fetching entities:", error);
            }
            callback({ error: error as Error });
            throw error;
        }
    }

    if (options?.logging) {
        console.log("All fetched entities:", allEntities);
    }

    return historical
        ? parseHistoricalEvents<T>(allEntities, options)
        : parseEntities<T>(allEntities, options);
}
