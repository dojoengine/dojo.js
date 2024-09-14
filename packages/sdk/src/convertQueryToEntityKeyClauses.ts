import * as torii from "@dojoengine/torii-client";
import { SchemaType, SubscriptionQueryType } from "./types";

/**
 * Converts a subscription query to an array of EntityKeysClause.
 *
 * @param query - The subscription query to convert.
 * @returns An array of EntityKeysClause.
 */
export function convertQueryToEntityKeyClauses<T extends SchemaType>(
    query?: SubscriptionQueryType<T>
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
                if (typeof value === "boolean" || Array.isArray(value)) {
                    const namespaceModel = `${namespace}-${model}`;
                    const clause = createClause(namespaceModel, value);
                    if (clause) {
                        clauses.push(clause);
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
    value: boolean | string[]
): torii.EntityKeysClause | undefined {
    if (value === true) {
        return {
            Keys: {
                keys: [],
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
