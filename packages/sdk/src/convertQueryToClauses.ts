import * as torii from "@dojoengine/torii-client";
import { SchemaType } from "./types";
import { QueryOptions, QueryType } from ".";

/**
 * @param {Partial<SchemaType>} query
 * @returns {torii.EntityKeysClause[]}
 */
export function convertQueryToClauses<T extends SchemaType>(
    query?: QueryType<T>
): torii.EntityKeysClause[] {
    if (!query) {
        return [];
    }

    const clauses: torii.EntityKeysClause[] = [];

    // Handle entityIds
    if (
        query.entityIds &&
        Array.isArray(query.entityIds) &&
        query.entityIds.length > 0
    ) {
        clauses.push({ HashedKeys: query.entityIds });
    }

    for (const [model, conditions] of Object.entries(query)) {
        if (model === "entityIds") continue; // Skip the entityIds key

        if (conditions && typeof conditions === "object") {
            const keys: (string | undefined)[] = [];

            for (const [key, value] of Object.entries(conditions)) {
                if (key === "$") {
                    // Handle query options
                    const queryOptions = value as QueryOptions;
                    if (queryOptions.where) {
                        // Handle 'where' conditions if needed
                        // For now, we're not doing anything with 'where'
                    }
                    continue;
                }
                if (typeof value === "object" && value !== null) {
                    // This is a nested query, we don't include it in the keys
                    continue;
                }
                keys.push(value as string | undefined);
            }

            if (keys.length > 0) {
                clauses.push({
                    Keys: {
                        keys,
                        pattern_matching: "FixedLen",
                        models: [model],
                    },
                });
            } else {
                clauses.push({
                    Keys: {
                        keys: [],
                        pattern_matching: "VariableLen",
                        models: [model],
                    },
                });
            }
        }
    }

    return clauses;
}
