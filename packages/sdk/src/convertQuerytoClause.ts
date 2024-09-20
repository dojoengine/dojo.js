import * as torii from "@dojoengine/torii-client";

import { convertQueryToKeysClause } from "./convertQueryToEntityKeyClauses";
import { QueryType, SchemaType, SubscriptionQueryType } from "./types";

/**
 * Converts a query object into a Torii clause.
 *
 * @template T - The schema type.
 * @param {QueryType<T>} query - The query object to convert.
 * @param {T} schema - The schema providing field order information.
 * @returns {torii.Clause} - The resulting Torii clause.
 */
export function convertQueryToClause<T extends SchemaType>(
    query: QueryType<T>,
    schema: T
): torii.Clause | undefined {
    const clauses: torii.Clause[] = [];

    for (const [namespace, models] of Object.entries(query)) {
        if (namespace === "entityIds") continue; // Skip entityIds

        if (models && typeof models === "object") {
            clauses.push(...processModels(namespace, models, schema));
        }
    }

    // If there are clauses, combine them under a single Composite clause
    if (clauses.length > 0) {
        return {
            Composite: {
                operator: "And",
                clauses: clauses,
            },
        };
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
            const conditions = modelData.$;
            if (
                conditions &&
                typeof conditions === "object" &&
                "where" in conditions
            ) {
                const whereClause = conditions.where;
                if (whereClause && typeof whereClause === "object") {
                    const { isConditions, otherConditions } =
                        extractConditions(whereClause);

                    if (Object.keys(isConditions).length > 0) {
                        // Build Keys clause using existing function
                        const keyClauses = convertQueryToKeysClause(
                            {
                                [namespace]: {
                                    [model]: {
                                        $: {
                                            where: isConditions,
                                        },
                                    },
                                },
                            } as Omit<SubscriptionQueryType<T>, "entityIds">,
                            schema
                        );
                        clauses.push(...(keyClauses as any));
                    }

                    // Process other conditions as Member clauses
                    clauses.push(
                        ...buildMemberClauses(namespaceModel, otherConditions)
                    );
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
 * Extracts $is conditions from the where clause and separates other conditions.
 *
 * @param {any} whereClause - The where clause containing conditions.
 * @returns {{ isConditions: any; otherConditions: any }} - The separated conditions.
 */
function extractConditions(whereClause: any): {
    isConditions: any;
    otherConditions: any;
} {
    const isConditions: any = {};
    const otherConditions: any = {};

    for (const [member, memberValue] of Object.entries(whereClause)) {
        if (
            typeof memberValue === "object" &&
            memberValue !== null &&
            "$is" in memberValue
        ) {
            isConditions[member] = memberValue;
        } else {
            otherConditions[member] = memberValue;
        }
    }

    return { isConditions, otherConditions };
}

/**
 * Builds Member clauses from the provided conditions.
 *
 * @param {string} namespaceModel - The namespaced model identifier.
 * @param {any} conditions - The conditions to convert into Member clauses.
 * @returns {torii.Clause[]} - An array of Member clauses.
 */
function buildMemberClauses(
    namespaceModel: string,
    conditions: any
): torii.Clause[] {
    const memberClauses: torii.Clause[] = [];

    for (const [member, memberValue] of Object.entries(conditions)) {
        if (typeof memberValue === "object" && memberValue !== null) {
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

    return memberClauses;
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
