import {
    QueryResult,
    QueryType,
    SchemaType,
    SubscriptionQueryType,
} from "./types";
import * as torii from "@dojoengine/torii-client";

function parseValue(value: torii.Ty): any {
    switch (value.type) {
        case "primitive":
            return value.value;
        case "struct":
            return parseStruct(value.value as Record<string, torii.Ty>);
        case "enum":
            return (value.value as torii.EnumValue).option;
        case "array":
            return (value.value as torii.Ty[]).map(parseValue);
        default:
            return value.value;
    }
}

function parseStruct(struct: Record<string, torii.Ty>): any {
    return Object.fromEntries(
        Object.entries(struct).map(([key, value]) => [key, parseValue(value)])
    );
}

export function parseEntities<T extends SchemaType>(
    entities: torii.Entities,
    query?: QueryType<T> | SubscriptionQueryType<T>,
    options?: { logging?: boolean }
): QueryResult<T> {
    const result = {} as QueryResult<T>;

    if (options?.logging) {
        console.log("Parsing entities:", entities);
        console.log("Query:", query);
    }

    for (const entityId in entities) {
        const entityData = entities[entityId];
        for (const modelName in entityData) {
            const [namespace, model] = modelName.split("-");
            const lowerModel = model.toLowerCase();

            if (!result[namespace]) {
                (result as any)[namespace] = {};
            }
            if (!(result as any)[namespace][lowerModel]) {
                (result as any)[namespace][lowerModel] = [];
            }

            const parsedEntity = parseStruct(
                entityData[modelName] as Record<string, torii.Ty>
            );
            (result[namespace][lowerModel] as any[]).push(parsedEntity);

            if (options?.logging) {
                console.log(
                    `Parsed entity for model ${lowerModel}:`,
                    parsedEntity
                );
            }
        }
    }

    if (options?.logging) {
        console.log("Parsed result:", result);
    }

    return result;
}
