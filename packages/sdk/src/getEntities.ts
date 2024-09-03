import { convertQueryToClause } from "./convertQuerytoClause";
import { SchemaType } from "./types";
import * as torii from "@dojoengine/torii-client";

export function parseEntities<T extends SchemaType, K extends keyof T>(
    entities: torii.Entities,
    query: { [P in K]?: Partial<T[P]> }
): { [P in K]: T[P][] } {
    const result = {} as { [P in K]: T[P][] };

    for (const modelName in query) {
        if (entities[modelName]) {
            result[modelName as K] = Object.values(entities[modelName]).map(
                (entity) => {
                    const parsedEntity = {} as T[K];
                    for (const key in entity) {
                        const value = entity[key];
                        if (
                            value &&
                            typeof value === "object" &&
                            "value" in value
                        ) {
                            parsedEntity[key as keyof T[K]] =
                                value.value as any;
                        }
                    }
                    return parsedEntity;
                }
            );
        } else {
            result[modelName as K] = [];
        }
    }

    return result;
}

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
