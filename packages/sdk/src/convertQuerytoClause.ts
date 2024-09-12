import * as torii from "@dojoengine/torii-client";
import { SchemaType, QueryType } from "./types";

export function convertQueryToClause<T extends SchemaType>(
    query: QueryType<T>,
    operator: torii.LogicalOperator = "And"
): torii.Clause {
    const clauses: torii.Clause[] = [];

    for (const [namespace, models] of Object.entries(query)) {
        if (namespace === "entityIds") continue; // Skip entityIds

        if (models && typeof models === "object") {
            for (const [model, modelData] of Object.entries(models)) {
                const namespaceModel = `${namespace}-${model}`;

                if (
                    modelData &&
                    typeof modelData === "object" &&
                    "$" in modelData
                ) {
                    const conditions = modelData.$;
                    if (
                        conditions &&
                        typeof conditions === "object" &&
                        "where" in conditions
                    ) {
                        const whereClause = conditions.where;
                        if (whereClause && typeof whereClause === "object") {
                            for (const [member, memberValue] of Object.entries(
                                whereClause
                            )) {
                                if (
                                    typeof memberValue === "object" &&
                                    memberValue !== null
                                ) {
                                    for (const [op, val] of Object.entries(
                                        memberValue
                                    )) {
                                        clauses.push({
                                            Member: {
                                                model: namespaceModel,
                                                member,
                                                operator: convertOperator(op),
                                                value: convertToPrimitive(val),
                                            },
                                        });
                                    }
                                } else {
                                    clauses.push({
                                        Member: {
                                            model: namespaceModel,
                                            member,
                                            operator: "Eq", // Default to Eq
                                            value: convertToPrimitive(
                                                memberValue
                                            ),
                                        },
                                    });
                                }
                            }
                        }
                    }
                } else {
                    // Handle the case where there are no conditions
                    return {
                        Keys: {
                            keys: [],
                            pattern_matching: "VariableLen",
                            models: [namespaceModel],
                        },
                    };
                }
            }
        }
    }

    // If there are clauses, combine them under a single Composite clause
    if (clauses.length > 0) {
        return {
            Composite: {
                operator: operator,
                clauses: clauses,
            },
        };
    }

    // If there are no clauses, return an empty Composite
    return {
        Composite: {
            operator: operator,
            clauses: [],
        },
    };
}
function convertToPrimitive(value: any): torii.Primitive {
    if (typeof value === "number") {
        return { U32: value };
    } else if (typeof value === "boolean") {
        return { Bool: value };
    } else if (typeof value === "string") {
        return { Felt252: value };
    } else if (typeof value === "bigint") {
        return { Felt252: value.toString() };
    }
    // Add more type conversions as needed
    throw new Error(`Unsupported primitive type: ${typeof value}`);
}

function convertOperator(operator: string): torii.ComparisonOperator {
    switch (operator) {
        case "$eq":
            return "Eq";
        case "$gt":
            return "Gt";
        case "$lt":
            return "Lt";
        // Add more operators as needed
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
}
