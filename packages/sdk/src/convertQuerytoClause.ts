// packages/sdk/src/convertQuerytoClause.ts

import * as torii from "@dojoengine/torii-client";
import { QueryType, SchemaType, LogicalOperator } from "./types";
import { convertQueryToEntityKeyClauses } from "./convertQueryToEntityKeyClauses"; // Import added

/**
 * Converts a query object into a Torii clause.
 *
 * @template T - The schema type.
 * @param {QueryType<T>} query - The query object to convert.
 * @param {T} schema - The schema providing field order information.
 * @returns {torii.Clause | undefined} - The resulting Torii clause or undefined.
 */
export function convertQueryToClause<T extends SchemaType>(
    query: QueryType<T>,
    schema: T
): torii.Clause | undefined {
    const clauses: torii.Clause[] = [];

    for (const [namespace, models] of Object.entries(query)) {
        if (namespace === "entityIds") continue; // Skip entityIds

        if (models && typeof models === "object") {
            const modelClauses = processModels(namespace, models, schema);
            if (modelClauses.length === 1) {
                clauses.push(modelClauses[0]);
            } else if (modelClauses.length > 1) {
                clauses.push({
                    Composite: {
                        operator: "And",
                        clauses: modelClauses,
                    },
                });
            }
        }
    }

    // If there are clauses, combine them under a single Composite clause
    if (clauses.length > 1) {
        return {
            Composite: {
                operator: "And",
                clauses: clauses,
            },
        };
    } else if (clauses.length === 1) {
        return clauses[0];
    }

    // If there are no clauses, return undefined
    return undefined;
}

/**
 * Processes all models within a namespace and generates corresponding clauses.
 *
 * @template T - The schema type.
 * @param {string} namespace - The namespace of the models.
 * @param {any} models - The models object to process.
 * @param {T} schema - The schema providing field order information.
 * @returns {torii.Clause[]} - An array of generated clauses.
 */
function processModels<T extends SchemaType>(
    namespace: string,
    models: any,
    schema: T
): torii.Clause[] {
    const clauses: torii.Clause[] = [];

    for (const [model, modelData] of Object.entries(models)) {
        const namespaceModel = `${namespace}-${model}`;

        if (modelData && typeof modelData === "object" && "$" in modelData) {
            const conditions = modelData.$ as Record<string, unknown>;
            if (
                conditions &&
                typeof conditions === "object" &&
                "where" in conditions
            ) {
                const whereClause = conditions.where;
                if (whereClause && typeof whereClause === "object") {
                    // Check if $is exists in whereClause
                    if ("$is" in whereClause) {
                        // Convert $is to EntityKeysClause
                        const isClauses = convertQueryToEntityKeyClauses(
                            { [model]: modelData },
                            schema
                        );
                        clauses.push(...isClauses);
                    }

                    const clause = buildWhereClause(
                        namespaceModel,
                        whereClause
                    );
                    if (clause) {
                        if (Array.isArray(clause)) {
                            clauses.push(...clause);
                        } else {
                            clauses.push(clause);
                        }
                    }
                }
            }
        } else {
            // Handle the case where there are no conditions
            clauses.push({
                Keys: {
                    keys: [undefined],
                    pattern_matching: "FixedLen",
                    models: [namespaceModel],
                },
            });
        }
    }

    return clauses;
}

/**
 * Builds a Torii clause based on the provided where conditions.
 *
 * @param {string} namespaceModel - The namespaced model identifier.
 * @param {any} where - The where conditions.
 * @returns {torii.Clause | torii.Clause[]} - A Torii clause or an array of clauses.
 */
function buildWhereClause(
    namespaceModel: string,
    where: any
): torii.Clause | torii.Clause[] | undefined {
    // Check for logical operators
    const logicalOperators = ["AND", "OR"];
    const keys = Object.keys(where);
    const hasLogicalOperator = keys.some((key) =>
        logicalOperators.includes(key)
    );

    if (hasLogicalOperator) {
        const operator = keys.find((key) =>
            logicalOperators.includes(key)
        ) as LogicalOperator;
        const conditions = where[operator];

        if (Array.isArray(conditions)) {
            const subClauses: torii.Clause[] = [];
            for (const condition of conditions) {
                const clause = buildWhereClause(namespaceModel, condition);
                if (clause) {
                    if (Array.isArray(clause)) {
                        subClauses.push(...clause);
                    } else {
                        subClauses.push(clause);
                    }
                }
            }

            if (subClauses.length === 0) return undefined;

            return {
                Composite: {
                    operator: operator === "AND" ? "And" : "Or",
                    clauses: subClauses,
                },
            };
        }
    }

    // If no logical operator, build Member clauses
    const memberClauses: torii.Clause[] = [];

    for (const [member, memberValue] of Object.entries(where)) {
        if (typeof memberValue === "object" && memberValue !== null) {
            const keys = Object.keys(memberValue);
            // Check if memberValue contains logical operators
            const isNestedLogical = keys.some((key) =>
                ["AND", "OR"].includes(key)
            );
            if (isNestedLogical) {
                // Recursively build nested Composite clauses
                const nestedClause = buildWhereClause(
                    namespaceModel,
                    memberValue
                );
                if (nestedClause) {
                    if (Array.isArray(nestedClause)) {
                        memberClauses.push(...nestedClause);
                    } else {
                        memberClauses.push(nestedClause);
                    }
                }
            } else {
                for (const [op, val] of Object.entries(memberValue)) {
                    memberClauses.push({
                        Member: {
                            model: namespaceModel,
                            member,
                            operator: convertOperator(op),
                            value: convertToPrimitive(val),
                        },
                    });
                }
            }
        } else {
            // Assume equality condition
            memberClauses.push({
                Member: {
                    model: namespaceModel,
                    member,
                    operator: "Eq",
                    value: convertToPrimitive(memberValue),
                },
            });
        }
    }

    if (memberClauses.length === 1) {
        return memberClauses[0];
    } else if (memberClauses.length > 1) {
        return {
            Composite: {
                operator: "And",
                clauses: memberClauses,
            },
        };
    }

    return undefined;
}

/**
 * Converts a value to a Torii primitive type.
 *
 * @param {any} value - The value to convert.
 * @returns {torii.MemberValue} - The converted primitive value.
 * @throws {Error} - If the value type is unsupported.
 */
function convertToPrimitive(value: any): torii.MemberValue {
    if (typeof value === "number") {
        return { Primitive: { U32: value } };
    } else if (typeof value === "boolean") {
        return { Primitive: { Bool: value } };
    } else if (typeof value === "bigint") {
        return {
            Primitive: {
                Felt252: torii.cairoShortStringToFelt(value.toString()),
            },
        };
    } else if (typeof value === "string") {
        return { String: value };
    }

    // Add more type conversions as needed
    throw new Error(`Unsupported primitive type: ${typeof value}`);
}

/**
 * Converts a query operator to a Torii comparison operator.
 *
 * @param {string} operator - The query operator to convert.
 * @returns {torii.ComparisonOperator} - The corresponding Torii comparison operator.
 * @throws {Error} - If the operator is unsupported.
 */
function convertOperator(operator: string): torii.ComparisonOperator {
    switch (operator) {
        case "$eq":
            return "Eq";
        case "$neq":
            return "Neq";
        case "$gt":
            return "Gt";
        case "$gte":
            return "Gte";
        case "$lt":
            return "Lt";
        case "$lte":
            return "Lte";
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
}
