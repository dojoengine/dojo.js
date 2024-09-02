import * as torii from "@dojoengine/torii-client";
import { SchemaType } from "./types";

/* tslint:disable */
/* eslint-disable */
/**
 * @param {Partial<SchemaType>} query
 * @returns {torii.EntityKeysClause[]}
 */
export function convertQueryToClauses<T extends SchemaType>(
    query: Partial<T>
): torii.EntityKeysClause[] {
    const clauses: torii.EntityKeysClause[] = [];

    for (const [model, conditions] of Object.entries(query)) {
        if (conditions && typeof conditions === "object") {
            const keys = Object.keys(conditions) as (keyof typeof conditions)[];
            if (keys.length > 0) {
                clauses.push({
                    Keys: {
                        keys: keys.map(
                            (key) => conditions[key] as string | undefined
                        ),
                        pattern_matching: "FixedLen",
                        models: [model],
                    },
                });
            } else {
                // If no specific conditions, include all entities of this model
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
