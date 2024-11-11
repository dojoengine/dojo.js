import * as torii from "@dojoengine/torii-client";

import { convertQueryToClause } from "./convertQuerytoClause";
import { parseEntities } from "./parseEntities";
import { QueryType, SchemaType, StandardizedQueryResult } from "./types";

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
export async function getEventMessages<T extends SchemaType>(
    client: torii.ToriiClient,
    query: QueryType<T>,
    schema: T,
    callback: (response: {
        data?: StandardizedQueryResult<T>;
        error?: Error;
    }) => void,
    limit: number = 100, // Default limit
    offset: number = 0, // Default offset
    options?: { logging?: boolean } // Logging option
): Promise<StandardizedQueryResult<T>> {
    const clause = convertQueryToClause(query, schema);

    let cursor = offset;
    let continueFetching = true;
    let allEntities: torii.Entities = {};

    while (continueFetching) {
        const toriiQuery: torii.Query = {
            limit: limit,
            offset: cursor,
            clause,
            dont_include_hashed_keys: false,
        };

        try {
            const entities = await client.getEventMessages(toriiQuery, true);

            if (options?.logging) {
                console.log(`Fetched entities at offset ${cursor}:`, entities);
            }

            Object.assign(allEntities, entities);

            const parsedEntities = parseEntities<T>(allEntities);

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
    return parseEntities<T>(allEntities);
}
