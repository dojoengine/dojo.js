import { Type as RecsType, Schema } from "@dojoengine/recs";

export function convertValues(schema: Schema, values: any) {
    if (typeof schema !== "object" || schema === null) {
        console.warn("Invalid schema provided.");
        return {};
    }

    if (typeof values !== "object" || values === null) {
        console.warn("Invalid values provided.");
        return {};
    }

    return Object.keys(schema).reduce<any>((acc, key) => {
        if (!acc) {
            acc = {};
        }

        const schemaType = schema[key];
        const value = values[key];

        if (value === null || value === undefined) {
            acc[key] = value;
            return acc;
        }

        if (value.type === "enum") {
            acc[key] = value.value.option;
            return acc;
        }

        switch (schemaType) {
            case RecsType.StringArray:
                if (value.type === "array") {
                    if (value.value.length === 0) {
                        acc[key] = [];
                    } else if (value.value[0].type === "enum") {
                        acc[key] = value.value.map(
                            (item: any) => item.value.option
                        );
                    } else {
                        acc[key] = value.value.map((a: any) => {
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
                } else {
                    console.warn(
                        `Expected type 'array' for key '${key}', but received '${value.type}'.`
                    );
                    acc[key] = undefined;
                }
                break;

            case RecsType.String:
                acc[key] = value.value;
                break;

            case RecsType.BigInt:
                try {
                    acc[key] = BigInt(value.value);
                } catch (error) {
                    console.warn(
                        `Failed to convert ${value.value} to BigInt. Attempting hexadecimal conversion.`
                    );
                    try {
                        acc[key] = BigInt(`0x${value.value}`);
                    } catch (hexError) {
                        console.warn(
                            `Failed to convert ${value.value} to BigInt even with hexadecimal. Assigning undefined.`
                        );
                        acc[key] = undefined;
                    }
                }
                break;

            case RecsType.Boolean:
                acc[key] = value.value;
                break;

            case RecsType.Number:
                acc[key] = Number(value.value);
                break;

            default:
                if (typeof schemaType === "object" && value.type === "struct") {
                    if (value.value instanceof Map) {
                        const structValues = Object.fromEntries(value.value);
                        acc[key] = convertValues(schemaType, structValues);
                    } else if (
                        typeof value.value === "object" &&
                        value.value !== null
                    ) {
                        acc[key] = convertValues(schemaType, value.value);
                    } else {
                        console.warn(
                            `Expected 'struct' type with object value for key '${key}'.`
                        );
                        acc[key] = undefined;
                    }
                } else if (
                    Array.isArray(schemaType) &&
                    value.type === "array"
                ) {
                    if (!Array.isArray(value.value)) {
                        console.warn(
                            `Expected an array for key '${key}', but received '${typeof value.value}'.`
                        );
                        acc[key] = undefined;
                    } else {
                        acc[key] = value.value.map((item: any) => {
                            if (
                                item.type === "struct" &&
                                typeof schemaType[0] === "object"
                            ) {
                                return convertValues(schemaType[0], item.value);
                            } else {
                                // Handle non-struct items or different types as needed
                                return convertValues(
                                    typeof schemaType[0] === "object"
                                        ? schemaType[0]
                                        : {},
                                    item
                                );
                            }
                        });
                    }
                } else {
                    // For unrecognized schema types, assign the raw value
                    acc[key] = value.value;
                }
                break;
        }

        return acc;
    }, {});
}
