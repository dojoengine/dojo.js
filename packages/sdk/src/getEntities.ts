import { convertQueryToClause } from "./convertQuerytoClause";
import { SchemaType } from "./types";
import * as torii from "@dojoengine/torii-client";

export async function getEntities<T extends SchemaType, K extends keyof T>(
    client: torii.ToriiClient,
    query: { [P in K]?: Partial<T[P]> },
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
    return client.getEntities(toriiQuery);
}
