import { convertQueryToClause } from "./convertQuerytoClause";
import { SchemaType } from "./types";
import * as torii from "@dojoengine/torii-client";

export async function getEntities<T extends SchemaType, K extends keyof T>(
    client: torii.ToriiClient,
    query: { [P in K]?: Partial<T[P]> },
    callback: (response: {
        entities?: torii.Entities;
        data: torii.Entities;
        error?: Error;
    }) => void,
    limit: number = 100, // Default limit
    offset: number = 0 // Default offset
): Promise<torii.Entities> {
    const clauses = convertQueryToClause(query);
    const toriiQuery: torii.Query = {
        limit: limit,
        offset: offset,
        clause: {
            Composite: {
                operator: "And",
                clauses: [clauses],
            },
        },
    };

    try {
        const entities = await client.getEntities(toriiQuery);
        callback({ data: entities });
        return entities;
    } catch (error) {
        throw error;
    }
}
