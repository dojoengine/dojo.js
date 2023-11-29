import { Type as RecsType, Schema } from "@dojoengine/recs";

export function convertValues(schema: Schema, values: any) {
    return Object.keys(schema).reduce<any>((acc, key) => {
        const schemaType = schema[key];
        const value = values[key];

        if (
            typeof schemaType === "object" &&
            value &&
            typeof value === "object"
        ) {
            acc[key] = convertValues(schemaType, value);
        } else {
            acc[key] =
                schemaType === RecsType.BigInt ? BigInt(value) : Number(value);
        }
        return acc;
    }, {});
}
