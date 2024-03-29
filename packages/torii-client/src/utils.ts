import { ComparisonOperator, ValueType } from "@dojoengine/torii-wasm";

interface NumberFilter {
    eq?: number;
    neq?: number;
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
}

const filterMapping: Record<keyof NumberFilter, ComparisonOperator> = {
    eq: "Eq",
    neq: "Neq",
    gt: "Gt",
    gte: "Gte",
    lt: "Lt",
    lte: "Lte",
};

// This updates the type of a passed in generic object to extend all
// number fields to be either a NumberFilter or a number.
// This will allow number fields to have more complicated queries,
// e.g. { age: { gt: 10 } }.
type ConvertNumberToFilter<T extends object> = {
    [K in keyof T]: T[K] extends number ? NumberFilter | number : T[K];
};

// Given a model, this type represents a query that can be made against it.
// This type is recursive and can be used to represent complex queries.
// For example:
// {
//     OR: [
//         { age: { gt: 10 } },
//         { name: "John" }
//     ]
// }
export type ModelClause<T extends object> = {
    OR?: ModelClause<T>[];
    AND?: ModelClause<T>[];
} & Partial<ConvertNumberToFilter<T>>;

// Converts an actual value inside a passed in query to a Torii ValueType
function valueToValueType(value: any): ValueType {
    if (typeof value === "number") {
        return { Int: value };
    }
    if (typeof value === "string") {
        return { String: value };
    }
    if (typeof value === "boolean") {
        return { VBool: value };
    }
    if (Array.isArray(value) && value.every((v) => typeof v === "number")) {
        return { Bytes: value };
    }

    throw new Error("Unsupported value type");
}

// Converts a single query line to a Torii value and operator
// e.g. { age: { gt: 10 } } -> { operator: "Gt", value: { primitive_type: { Felt252: "" }, value_type: { Int: 10 } } }
// or { age: 10 } -> { operator: "Eq", value: { primitive_type: { Felt252: "" }, value_type: { Int: 10 } } }
// The Felt252 is hardcoded since it currently isn't used in the Torii API
export function valueToToriiValueAndOperator(
    value: NumberFilter | number | bigint | string | boolean
): {
    operator: ComparisonOperator;
    value: {
        primitive_type: { Felt252: "" };
        value_type: ValueType;
    };
} {
    if (typeof value === "object") {
        const key = Object.keys(value)[0] as keyof NumberFilter;
        const operator = filterMapping[key];
        const val = value[key];
        const valueType = valueToValueType(val);
        return {
            operator,
            value: {
                primitive_type: { Felt252: "" },
                value_type: valueType,
            },
        };
    }

    const valueType = valueToValueType(value);
    return {
        operator: "Eq",
        value: {
            primitive_type: { Felt252: "" },
            value_type: valueType,
        },
    };
}

// Given a Torri result, this function will extract the necessary fields from it
// e.g. if the query was { moves: { remaining: 10 } } and the result is
// { e22398sdwerkjh: { Moves: { remaining: 10, player: "John" } }, { Position: { x: 0, y: 0 } } }
// the result will be { moves: { remaining: 10, player: "John" } }
export function extractQueryFromResult<T extends {}>(
    query: T,
    result: { [key: string]: any }
): { [key: string]: any } {
    return Object.keys(query).reduce(
        (acc, key) => {
            const resultKey = Object.keys(result).find(
                (k) => k.toLowerCase() === key.toLowerCase()
            );

            if (resultKey) {
                acc[key] = result[resultKey];
            }

            return acc;
        },
        {} as { [key: string]: any }
    );
}
