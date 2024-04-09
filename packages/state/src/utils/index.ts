import { Type as RecsType, Schema } from "@dojoengine/recs";

export function convertValues(schema: Schema, values: any) {
    return Object.keys(schema).reduce<any>((acc, key) => {
        const schemaType = schema[key];
        const value = values[key];

        console.log(schemaType, key, values[key]);

        if (value === null || value === undefined) {
            acc[key] = value;
            return acc;
        }

        // Check if the schemaType is a string, if so, assign the value directly
        if (schemaType === RecsType.String) {
            acc[key] = value;
        } else if (
            typeof schemaType === "object" &&
            value &&
            typeof value === "object"
        ) {
            acc[key] = convertValues(schemaType, value);
        } else {
            // Convert to BigInt or Number based on schemaType
            acc[key] =
                schemaType === RecsType.BigInt ? BigInt(value) : Number(value);
        }

        return acc;
    }, {});
}
