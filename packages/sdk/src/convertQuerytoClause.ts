import * as torii from "@dojoengine/torii-client";
import { SchemaType } from "./types";
import { QueryType } from ".";

export function convertQueryToClause<T extends SchemaType, K extends keyof T>(
    query: QueryType<T, K>,
    operator: torii.LogicalOperator = "And"
): torii.Clause {
    const clauses: torii.Clause[] = [];

    for (const [model, conditions] of Object.entries(query)) {
        if (conditions && typeof conditions === "object") {
            const keys: (string | undefined)[] = [];
            const memberClauses: torii.Clause[] = [];

            for (const [key, value] of Object.entries(conditions)) {
                if (key === "$") {
                    // Handle MemberClause
                    if (
                        value &&
                        typeof value === "object" &&
                        "where" in value
                    ) {
                        const whereClause = (
                            value as { where?: Record<string, any> }
                        ).where;
                        if (whereClause) {
                            for (const [member, memberValue] of Object.entries(
                                whereClause
                            )) {
                                memberClauses.push({
                                    Member: {
                                        model,
                                        member,
                                        operator: "Eq", // Default to Eq, can be extended for other operators
                                        value: convertToPrimitive(memberValue),
                                    },
                                });
                            }
                        }
                    }
                } else if (typeof value !== "object" || value === null) {
                    keys.push(value as string | undefined);
                }
            }

            if (keys.length > 0) {
                clauses.push({
                    Keys: {
                        keys,
                        pattern_matching: "FixedLen",
                        models: [model],
                    },
                });
            }

            clauses.push(...memberClauses);

            if (keys.length === 0 && memberClauses.length === 0) {
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

function convertToPrimitive(value: any): torii.Primitive {
    if (typeof value === "number") {
        return { I128: value.toString() };
    } else if (typeof value === "boolean") {
        return { Bool: value };
    } else if (typeof value === "string") {
        return { Felt252: value };
    }
    // Add more type conversions as needed
    throw new Error(`Unsupported primitive type: ${typeof value}`);
}
