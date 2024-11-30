import { Type as RecsType, Schema } from "@dojoengine/recs";

export function convertValues(schema: Schema, values: any) {
    return Object.keys(schema).reduce<any>((acc, key) => {
        let schemaType = schema[key];
        let value = values[key];

        if (value == null) {
            acc[key] = value;
            return acc;
        }

        if (value.type === "enum") {
            if (value.type_name.includes("Option")) {
                if (value.value.option === "None") {
                    acc[key] = null;
                    return acc;
                } else {
                    schemaType = mapOptionalToRealType(schemaType);
                    value = value.value.value;
                }
            } else {
                acc[key] = value.value.option;
                return acc;
            }
        }

        switch (schemaType) {
            case RecsType.StringArray:
                acc[key] = handleStringArray(value);
                break;

            case RecsType.String:
                acc[key] = value.value;
                break;

            case RecsType.BigInt:
                acc[key] = handleBigInt(value.value);
                break;

            case RecsType.Boolean:
                acc[key] = value.value;
                break;

            case RecsType.Number:
                acc[key] = Number(value.value);
                break;

            default:
                acc[key] = handleDefault(schemaType, value);
                break;
        }

        return acc;
    }, {});
}

function mapOptionalToRealType(schemaType: any) {
    switch (schemaType) {
        case RecsType.OptionalNumber:
            return RecsType.Number;
        case RecsType.OptionalBigInt:
            return RecsType.BigInt;
        case RecsType.OptionalString:
            return RecsType.String;
        case RecsType.OptionalNumberArray:
            return RecsType.NumberArray;
        case RecsType.OptionalBigIntArray:
            return RecsType.BigIntArray;
        case RecsType.OptionalStringArray:
            return RecsType.StringArray;
        case RecsType.OptionalEntity:
            return RecsType.Entity;
        case RecsType.OptionalEntityArray:
            return RecsType.EntityArray;
        case RecsType.OptionalT:
            return RecsType.T;
        default:
            return schemaType;
    }
}

function handleStringArray(value: any) {
    if (value.type === "array" && value.value.length === 0) {
        return [];
    }
    if (value.type === "array" && value.value[0]?.type === "enum") {
        return value.value.map((item: any) => item.value.option);
    }
    return value.value.map((a: any) => {
        try {
            return BigInt(a.value);
        } catch (error) {
            console.warn(
                `Failed to convert ${a.value} to BigInt. Using string value instead.`
            );
            return a.value;
        }
    });
}

function handleBigInt(value: string | bigint) {
    if (typeof value === "bigint") {
        return value;
    }
    try {
        return BigInt(value);
    } catch (error) {
        console.warn(
            `Failed to convert ${value} to BigInt. Attempting hexadecimal conversion.`
        );
        try {
            return BigInt(`0x${value}`);
        } catch (hexError) {
            console.warn(
                `Failed to convert 0x${value} to BigInt. Using string value instead.`
            );
            return value;
        }
    }
}

function handleDefault(schemaType: any, value: any) {
    if (typeof schemaType === "object" && value.type === "struct") {
        if (value.value instanceof Map) {
            const structValues = Object.fromEntries(value.value);
            return convertValues(schemaType, structValues);
        } else if (typeof value.value === "object") {
            // Handle cases where value.value might already be a plain object
            return convertValues(schemaType, value.value);
        } else {
            console.warn(
                `Expected value.value to be a Map or object for struct type, got ${typeof value.value}.`
            );
            return value.value;
        }
    }
    if (Array.isArray(schemaType) && value.type === "array") {
        return value.value.map((item: any) =>
            convertValues(schemaType[0], item)
        );
    }
    return value.value;
}
