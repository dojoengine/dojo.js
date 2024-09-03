import { convertQueryToClause } from "./convertQuerytoClause";
import { parseEntities } from "./parseEntities";
import { SchemaType } from "./types";
import * as torii from "@dojoengine/torii-client";

export async function getEntities<T extends SchemaType, K extends keyof T>(
    client: torii.ToriiClient,
    query: { [P in K]?: Partial<T[P]> },
    callback: (response: {
        data?: { [P in K]: T[P][] };
        error?: Error;
    }) => void,
    limit: number = 100, // Default limit
    offset: number = 0 // Default offset
): Promise<{ [P in K]: T[P][] }> {
    const clauses = convertQueryToClause(query);
    let cursor = offset;
    let continueFetching = true;
    let allEntities: torii.Entities = {};

    while (continueFetching) {
        const toriiQuery: torii.Query = {
            limit: limit,
            offset: cursor,
            clause: {
                Composite: {
                    operator: "And",
                    clauses: [clauses],
                },
            },
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
