import { SchemaType, StandardizedQueryResult, ParsedEntity } from "./types";
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

export function parseEntities<T extends SchemaType>(
    entities: torii.Entities,
    options?: { logging?: boolean }
): StandardizedQueryResult<T> {
    const result: StandardizedQueryResult<T> = [];

    for (const entityId in entities) {
        const entityData = entities[entityId];
        const parsedEntity: ParsedEntity<T> = {
            entityId,
            models: {} as ParsedEntity<T>["models"],
        };

        for (const modelName in entityData) {
            const [schemaKey, modelKey] = modelName.split("-") as [
                keyof T,
                string,
            ];

            if (!schemaKey || !modelKey) {
                if (options?.logging) {
                    console.warn(`Invalid modelName format: ${modelName}`);
                }
                continue;
            }

            if (!parsedEntity.models[schemaKey]) {
                parsedEntity.models[schemaKey] = {} as T[typeof schemaKey];
            }

            (parsedEntity.models[schemaKey] as any)[modelKey] = parseStruct(
                entityData[modelName]
            );
        }

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
