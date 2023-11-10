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
            // Otherwise, convert the value based on the schema type

            if (value == "Rock") {
                // @ts-ignore
                acc[key] =
                    schemaType === RecsType.BigInt ? BigInt(0) : Number(0);
            } else if (value == "Paper") {
                // @ts-ignore
                acc[key] =
                    schemaType === RecsType.BigInt ? BigInt(1) : Number(1);
            } else if (value == "Scissors") {
                // @ts-ignore
                acc[key] =
                    schemaType === RecsType.BigInt ? BigInt(2) : Number(2);
            } else {
                // @ts-ignore
                acc[key] =
                    schemaType === RecsType.BigInt
                        ? BigInt(value)
                        : Number(value);
            }
        }
        return acc;
    }, {});
}
