import { Type as RecsType, Schema } from "@dojoengine/recs";

export function convertValues(schema: Schema, values: any) {
    return Object.keys(schema).reduce<any>((acc, key) => {
        if (!acc) {
            acc = {}; // Ensure acc is initialized
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
                if (value.type === "array" && value.value[0].type === "enum") {
                    acc[key] = value.value.map(
                        (item: any) => item.value.option
                    );
                } else {
                    acc[key] = value.value.map((a: any) => Number(a.value));
                }
                break;

            case RecsType.String:
            case RecsType.BigInt:
            case RecsType.Boolean:
            case RecsType.Number:
                acc[key] = value.value;
                break;

            default:
                if (
                    typeof schemaType === "object" &&
                    typeof value === "object"
                ) {
                    acc[key] = convertValues(schemaType, value.value);
                }
                break;
        }

        return acc;
    }, {});
}
