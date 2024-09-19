import * as torii from "@dojoengine/torii-client";
import { SchemaType, QueryType } from "./types";

/**
 * Converts a subscription query to an array of EntityKeysClause.
 *
 * @template T - The schema type.
 * @param query - The subscription query to convert.
 * @param schema - The schema providing field order information.
 * @returns An array of EntityKeysClause.
 */
export function convertQueryToEntityKeyClauses<T extends SchemaType>(
    query: QueryType<T>,
    schema: T
): torii.EntityKeysClause[] {
    if (!query) {
        return [];
    }

    const clauses: torii.EntityKeysClause[] = [];

    const { entityIds, ...namespaces } = query;

    if (entityIds && entityIds.length > 0) {
        clauses.push({ HashedKeys: entityIds });
    }

    Object.entries(namespaces).forEach(([namespace, models]) => {
        if (models && typeof models === "object") {
            Object.entries(models).forEach(([model, value]) => {
                const namespaceModel = `${namespace}-${model}`;
                if (Array.isArray(value)) {
                    const clause = createClause(namespaceModel, value);
                    if (clause) {
                        clauses.push(clause);
                    }
                } else if (
                    typeof value === "object" &&
                    value !== null &&
                    "$" in value
                ) {
                    const whereOptions = (value as { $: { where: any } }).$
                        .where;
                    const modelSchema = schema[namespace]?.[model];
                    if (modelSchema) {
                        const clause = createClauseFromWhere(
                            namespaceModel,
                            whereOptions,
                            modelSchema.fieldOrder
                        );
                        if (clause) {
                            clauses.push(clause);
                        }
                    }
                }
            });
        }
    });

    return clauses;
}

/**
 * Creates an EntityKeysClause based on the provided model and value.
 *
 * @param namespaceModel - The combined namespace and model string.
 * @param value - The value associated with the model.
 * @returns An EntityKeysClause or undefined.
 */
function createClause(
    namespaceModel: string,
    value: string[]
): torii.EntityKeysClause | undefined {
    if (Array.isArray(value) && value.length === 0) {
        return {
            Keys: {
                keys: [undefined],
                pattern_matching: "VariableLen",
                models: [namespaceModel],
            },
        };
    } else if (Array.isArray(value)) {
        return {
            Keys: {
                keys: value,
                pattern_matching: "FixedLen",
                models: [namespaceModel],
            },
        };
    }
    return undefined;
}

/**
 * Creates an EntityKeysClause based on the provided where conditions.
 * Orders the keys array based on the fieldOrder from the schema,
 * inserting undefined placeholders where necessary.
 *
 * @param namespaceModel - The combined namespace and model string.
 * @param whereOptions - The where conditions from the query.
 * @param fieldOrder - The defined order of fields for the model.
 * @returns An EntityKeysClause or undefined.
 */
function createClauseFromWhere(
    namespaceModel: string,
    whereOptions?: Record<
        string,
        {
            $eq?: any;
            $neq?: any;
            $gt?: any;
            $gte?: any;
            $lt?: any;
            $lte?: any;
        }
    >,
    fieldOrder: string[] = []
): torii.EntityKeysClause | undefined {
    if (!whereOptions || Object.keys(whereOptions).length === 0) {
        return {
            Keys: {
                keys: Array(fieldOrder.length).fill(undefined),
                pattern_matching: "VariableLen",
                models: [namespaceModel],
            },
        };
    }

    // Initialize keys array with undefined placeholders
    const keys: (string | undefined)[] = Array(fieldOrder.length).fill(
        undefined
    );

    Object.entries(whereOptions).forEach(([field, condition]) => {
        // Find the index of the field in the fieldOrder
        const index = fieldOrder.indexOf(field);
        if (index !== -1) {
            // Assign value without operator prefixes
            if (condition.$eq !== undefined) {
                keys[index] = condition.$eq.toString();
            }
            if (condition.$neq !== undefined) {
                keys[index] = condition.$neq.toString();
            }
            if (condition.$gt !== undefined) {
                keys[index] = condition.$gt.toString();
            }
            if (condition.$gte !== undefined) {
                keys[index] = condition.$gte.toString();
            }
            if (condition.$lt !== undefined) {
                keys[index] = condition.$lt.toString();
            }
            if (condition.$lte !== undefined) {
                keys[index] = condition.$lte.toString();
            }
            // Add more operators as needed
        }
    });

    return {
        Keys: {
            keys: keys,
            pattern_matching: "VariableLen",
            models: [namespaceModel],
        },
    };
}
