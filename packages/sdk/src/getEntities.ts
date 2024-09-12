import { QueryResult, QueryType } from "./types";
import { convertQueryToClause } from "./convertQuerytoClause";
import { parseEntities } from "./parseEntities";
import { SchemaType } from "./types";
import * as torii from "@dojoengine/torii-client";

export async function getEntities<T extends SchemaType>(
    client: torii.ToriiClient,
    query: QueryType<T>,
    callback: (response: { data?: QueryResult<T>; error?: Error }) => void,
    limit: number = 100, // Default limit
    offset: number = 0, // Default offset
    options?: { logging?: boolean } // Logging option
): Promise<QueryResult<T>> {
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

        console.log(toriiQuery);

        try {
            const entities = await client.getEntities(toriiQuery);

            console.log("entities", entities);
            if (options?.logging) {
                console.log(`Fetched entities at offset ${cursor}:`, entities);
            }

            Object.assign(allEntities, entities);

            const parsedEntities = parseEntities<T>(allEntities, query);

            console.log("parsedEntities", parsedEntities);

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
    return parseEntities<T>(allEntities, query);
}
