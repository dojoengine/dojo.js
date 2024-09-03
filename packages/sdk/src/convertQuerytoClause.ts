import * as torii from "@dojoengine/torii-client";
import { SchemaType } from "./types";

export function convertQueryToClause<T extends SchemaType>(
    query: Partial<T>,
    operator: "And" | "Or" = "And"
): torii.Clause {
    const clauses: torii.Clause[] = [];

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

    // If there's only one clause, return it directly
    if (clauses.length === 1) {
        return clauses[0];
    }

    // Combine clauses with the specified operator
    return {
        Composite: {
            operator: operator,
            clauses: clauses,
        },
    };
}
