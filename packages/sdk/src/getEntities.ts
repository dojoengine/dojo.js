import { convertQueryToClause } from "./convertQuerytoClause";
import { SchemaType } from "./types";
import * as torii from "@dojoengine/torii-client";

export async function getEntities<T extends SchemaType, K extends keyof T>(
    client: torii.ToriiClient,
    query: { [P in K]?: Partial<T[P]> },
    callback: (response: { entities?: torii.Entities; error?: Error }) => void,
    limit: number = 100, // Default limit
    offset: number = 0 // Default offset
): Promise<torii.Entities> {
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
            callback({ entities });

            if (Object.keys(entities).length < limit) {
                continueFetching = false;
            } else {
                cursor += limit;
            }
        } catch (error) {
            throw error;
        }
    }

    return allEntities;
}
