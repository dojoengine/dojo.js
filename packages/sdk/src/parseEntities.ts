import * as torii from "@dojoengine/torii-client";

import { ParsedEntity, SchemaType, StandardizedQueryResult } from "./types";

/**
 * Parses a collection of entities into a standardized query result format.
 *
 * @template T - The schema type.
 * @param {torii.Entities} entities - The collection of entities to parse.
 * @param {{ logging?: boolean }} [options] - Optional settings for logging.
 * @returns {StandardizedQueryResult<T>} - The parsed entities in a standardized query result format.
 *
 * @example
 * const parsedResult = parseEntities(entities, { logging: true });
 * console.log(parsedResult);
 */
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

/**
 * Parses a value based on its type.
 *
 * @param {torii.Ty} value - The value to parse.
 * @returns {any} - The parsed value.
 */
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

/**
 * Parses a struct (record or map) into an object with parsed values.
 *
 * @param {Record<string, torii.Ty> | Map<string, torii.Ty>} struct - The struct to parse.
 * @returns {any} - The parsed struct as an object.
 */
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
