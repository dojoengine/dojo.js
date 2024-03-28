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

type ConvertNumberToFilter<T> = {
    [K in keyof T]: T[K] extends number ? NumberFilter | number : T[K];
};

export type ModelClause<T> = {
    OR?: ModelClause<T>[];
    AND?: ModelClause<T>[];
} & Partial<ConvertNumberToFilter<T>>;

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
