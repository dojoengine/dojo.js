import * as torii from "@dojoengine/torii-client";
import { SchemaType, QueryType, QueryOptions } from "./types";

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

    for (const [namespace, models] of Object.entries(query)) {
        if (namespace === "entityIds") continue; // Skip the entityIds key

        if (models && typeof models === "object") {
            for (const [model, conditions] of Object.entries(models)) {
                const namespaceModel = `${namespace}-${model}`;
                const keys: string[] = [];

                if (conditions && typeof conditions === "object") {
                    const queryOptions = conditions as QueryOptions;
                    if (queryOptions.where) {
                        // Process 'where' conditions if needed
                        // This might involve converting the 'where' clause to keys
                        // depending on your specific requirements
                    }

                    // Add other conditions processing if needed
                }

                if (keys.length > 0) {
                    clauses.push({
                        Keys: {
                            keys,
                            pattern_matching: "FixedLen",
                            models: [namespaceModel],
                        },
                    });
                } else {
                    clauses.push({
                        Keys: {
                            keys: [],
                            pattern_matching: "VariableLen",
                            models: [namespaceModel],
                        },
                    });
                }
            }
        }
    }

    return clauses;
}
