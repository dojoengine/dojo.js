import * as torii from "@dojoengine/torii-client";

import { StandardizedQueryResult, QueryType, SchemaType } from "./types";
import { convertQueryToClause } from "./convertQuerytoClause";
import { parseEntities } from "./parseEntities";

/**
 * Fetches event messages from the Torii client based on the provided query.
 *
 * @template T - The schema type.
 * @param {torii.ToriiClient} client - The Torii client instance used to fetch event messages.
 * @param {QueryType<T>} query - The query object used to filter event messages.
 * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} callback - The callback function to handle the response.
 * @param {number} [limit=100] - The maximum number of event messages to fetch per request. Default is 100.
 * @param {number} [offset=0] - The offset to start fetching event messages from. Default is 0.
 * @param {{ logging?: boolean }} [options] - Optional settings.
 * @param {boolean} [options.logging] - If true, enables logging of the fetching process. Default is false.
 * @returns {Promise<StandardizedQueryResult<T>>} - A promise that resolves to the standardized query result.
 */
export async function getEventMessages<T extends SchemaType>(
    client: torii.ToriiClient,
    query: QueryType<T>,
    callback: (response: {
        data?: StandardizedQueryResult<T>;
        error?: Error;
    }) => void,
    limit: number = 100, // Default limit
    offset: number = 0, // Default offset
    options?: { logging?: boolean } // Logging option
): Promise<StandardizedQueryResult<T>> {
    const clause = convertQueryToClause(query);

    console.log(clause);

    let cursor = offset;
    let continueFetching = true;
    let allEntities: torii.Entities = {};

    while (continueFetching) {
        const toriiQuery: torii.Query = {
            limit: limit,
            offset: cursor,
            clause,
        };

        try {
            const entities = await client.getEventMessages(toriiQuery);

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
