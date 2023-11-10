import { Type as RecsType, Schema } from "@dojoengine/recs";

export function convertValues(schema: Schema, values: any) {
    return Object.keys(schema).reduce((acc, key) => {
        const schemaType = schema[key];
        const value = values[key];

        if (
            typeof schemaType === "object" &&
            value &&
            typeof value === "object"
        ) {
            // @ts-ignore
            acc[key] = convertValues(schemaType, value);
        } else {
            // @ts-ignore
            acc[key] =
                schemaType === RecsType.BigInt ? BigInt(value) : Number(value);
        }
        return acc;
    }, {});
}
