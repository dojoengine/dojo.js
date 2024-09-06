import { QueryResult, QueryType } from ".";
import { convertQueryToClause } from "./convertQuerytoClause";
import { parseEntities } from "./parseEntities";
import { SchemaType } from "./types";
import * as torii from "@dojoengine/torii-client";

export async function getEntities<T extends SchemaType, K extends keyof T>(
    client: torii.ToriiClient,
    query: QueryType<T, K>,
    callback: (response: { data?: QueryResult<T, K>; error?: Error }) => void,
    limit: number = 100, // Default limit
    offset: number = 0 // Default offset
): Promise<QueryResult<T, K>> {
    const clause = convertQueryToClause(query);
    let cursor = offset;
    let continueFetching = true;
    let allEntities: torii.Entities = {};

    while (continueFetching) {
        const toriiQuery: torii.Query = {
            limit: limit,
            offset: cursor,
            clause: clause,
        };

        try {
            const entities = await client.getEntities(toriiQuery);
            Object.assign(allEntities, entities);
            const parsedEntities = parseEntities<T, K>(entities, query);
            callback({ data: parsedEntities });

            if (Object.keys(entities).length < limit) {
                continueFetching = false;
            } else {
                cursor += limit;
            }
        } catch (error) {
            callback({ error: error as Error });
            throw error;
        }
    }

    return parseEntities<T, K>(allEntities, query);
}
