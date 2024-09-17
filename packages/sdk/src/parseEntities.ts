import {
    SchemaType,
    QueryType,
    SubscriptionQueryType,
    StandardizedQueryResult,
    ParsedEntity,
} from "./types";
import * as torii from "@dojoengine/torii-client";

function parseValue(value: torii.Ty): any {
    switch (value.type) {
        case "primitive":
            return value.value;
        case "struct":
            return parseStruct(
                value.value as Record<string, torii.Ty> | Map<string, torii.Ty>
            );
        case "enum":
            return (value.value as torii.EnumValue).option;
        case "array":
            return (value.value as torii.Ty[]).map(parseValue);
        default:
            return value.value;
    }
}

function parseStruct(
    struct: Record<string, torii.Ty> | Map<string, torii.Ty>
): any {
    const entries =
        struct instanceof Map
            ? Array.from(struct.entries())
            : Object.entries(struct);
    return Object.fromEntries(
        entries.map(([key, value]) => [key, parseValue(value)])
    );
}

export function parseEntities(
    entities: torii.Entities,
    query?: QueryType<SchemaType> | SubscriptionQueryType<SchemaType>,
    options?: { logging?: boolean }
): StandardizedQueryResult<SchemaType> {
    const result: StandardizedQueryResult<SchemaType> =
        {} as StandardizedQueryResult<SchemaType>;

    for (const entityId in entities) {
        const entityData = entities[entityId];
        const models: { [key: string]: any } = {};

        for (const modelName in entityData) {
            const [schemaKey, modelKey] = modelName.split("-") as [
                keyof SchemaType,
                keyof SchemaType[keyof SchemaType],
            ];

            if (!schemaKey || !modelKey) {
                if (options?.logging) {
                    console.warn(`Invalid modelName format: ${modelName}`);
                }
                continue;
            }

            models[modelKey as string] = parseStruct(entityData[modelName]);
        }

        const parsedEntity: ParsedEntity<SchemaType[keyof SchemaType]> = {
            entityId,
            models,
        };

        result.push(parsedEntity);

        if (options?.logging) {
            console.log(`Parsed entity:`, parsedEntity);
        }
    }

    if (options?.logging) {
        console.log("Parsed result:", result);
    }

    return result;
}
