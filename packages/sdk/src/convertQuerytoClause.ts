// packages/sdk/src/convertQuerytoClause.ts

import * as torii from "@dojoengine/torii-client";
import { QueryType, SchemaType, SubscriptionQueryType } from "./types";
import { convertQueryToEntityKeyClauses } from "./convertQueryToEntityKeyClauses";

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
            if (modelClauses.length > 0) {
                clauses.push(...modelClauses);
            }
        }
    }

    // If there are clauses, combine them under a single Composite clause
    if (clauses.length > 1) {
        return {
            Composite: {
                operator: "Or",
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
                    // Iterate over each member in the whereClause to handle $is
                    for (const [member, memberConditions] of Object.entries(
                        whereClause
                    )) {
                        if (
                            typeof memberConditions === "object" &&
                            memberConditions !== null &&
                            "$is" in memberConditions
                        ) {
                            // Convert $is to EntityKeysClause
                            const isClauses = convertQueryToEntityKeyClauses(
                                {
                                    [namespace]: {
                                        [model]: {
                                            $: {
                                                where: {
                                                    [member]: {
                                                        $is: memberConditions[
                                                            "$is"
                                                        ],
                                                    },
                                                },
                                            },
                                        },
                                    },
                                } as SubscriptionQueryType<T>,
                                schema
                            );
                            clauses.push(...(isClauses as any));

                            // Remove $is from memberConditions to prevent further processing
                            const { $is, ...remainingConditions } =
                                memberConditions;
                            (whereClause as Record<string, unknown>)[member] =
                                remainingConditions;
                        }
                    }

                    // After handling all $is, build the remaining whereClause
                    const clause = buildWhereClause(
                        namespaceModel,
                        whereClause
                    );
                    if (clause) {
                        if (
                            "Composite" in clause &&
                            clause.Composite.operator === "Or"
                        ) {
                            // If the composite operator is "Or", flatten the clauses
                            clauses.push(...clause.Composite.clauses);
                        } else {
                            // Otherwise, keep the composite as is to preserve logical structure
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
 * Builds a Torii clause from a where clause object.
 *
 * @param {string} namespaceModel - The namespaced model identifier.
 * @param {Record<string, any>} where - The where clause conditions.
 * @returns {torii.Clause | undefined} - The constructed Torii clause or undefined.
 */
function buildWhereClause(
    namespaceModel: string,
    where: Record<string, any>
): torii.Clause | undefined {
    // Define logical operator mapping
    const logicalOperators: Record<string, torii.LogicalOperator> = {
        And: "And",
        Or: "Or",
    };

    // Check for logical operators first
    const keys = Object.keys(where);
    const logicalKey = keys.find((key) => key in logicalOperators);

    if (logicalKey) {
        const operator = logicalOperators[logicalKey];
        const conditions = where[logicalKey] as Array<Record<string, any>>;

        const subClauses: torii.Clause[] = [];

        for (const condition of conditions) {
            const clause = buildWhereClause(namespaceModel, condition);
            if (clause) {
                subClauses.push(clause);
            }
        }

        if (subClauses.length === 1) {
            return subClauses[0];
        }

        return {
            Composite: {
                operator: operator,
                clauses: subClauses,
            },
        };
    }

    // If no logical operator, build Member clauses
    const memberClauses: torii.Clause[] = [];

    for (const [member, memberValue] of Object.entries(where)) {
        if (typeof memberValue === "object" && memberValue !== null) {
            const memberKeys = Object.keys(memberValue);
            // Check if memberValue contains logical operators
            const memberLogicalKey = memberKeys.find(
                (key) => key in logicalOperators
            );
            if (memberLogicalKey) {
                const operator = logicalOperators[memberLogicalKey];
                const conditions = memberValue[memberLogicalKey] as Array<
                    Record<string, any>
                >;

                const nestedClauses: torii.Clause[] = [];
                for (const condition of conditions) {
                    const clause = buildWhereClause(namespaceModel, condition);
                    if (clause) {
                        nestedClauses.push(clause);
                    }
                }

                if (nestedClauses.length === 1) {
                    memberClauses.push(nestedClauses[0]);
                } else {
                    memberClauses.push({
                        Composite: {
                            operator: operator,
                            clauses: nestedClauses,
                        },
                    });
                }
            } else {
                // Process operators like $eq, $gt, etc
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
            // conditions in member clause should be treated as "And" Conditions by default
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
