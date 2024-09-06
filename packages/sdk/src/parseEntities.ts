import { QueryResult, QueryType } from ".";
import { SchemaType } from "./types";
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

export function parseEntities<T extends SchemaType, K extends keyof T>(
    entities: torii.Entities,
    query: QueryType<T, K>
): QueryResult<T, K> {
    const result = {} as QueryResult<T, K>;

    for (const modelName in query) {
        if (modelName !== "entityIds" && entities[modelName]) {
            result[modelName as K] = Object.entries(entities[modelName]).map(
                ([entityKey, entity]) => {
                    let parsedEntity = parseStruct(entity) as T[K];
                    const subQuery = (query as any)[modelName];

                    // Handle nested queries
                    if (subQuery && typeof subQuery === "object") {
                        for (const key in subQuery) {
                            if (
                                key !== "$" &&
                                typeof subQuery[key] === "object"
                            ) {
                                const nestedEntity = entity[key] as torii.Ty;
                                if (nestedEntity?.type === "struct") {
                                    const nestedEntities: torii.Entities = {
                                        [key]: {
                                            [entityKey]:
                                                nestedEntity.value as torii.Model,
                                        },
                                    };
                                    const nestedResult = parseEntities(
                                        nestedEntities,
                                        { [key]: subQuery[key] } as any
                                    );
                                    (parsedEntity as any)[key] =
                                        nestedResult[
                                            key as keyof typeof nestedResult
                                        ]?.[0];
                                }
                            }
                        }
                    }

                    return parsedEntity as T[K] & {
                        [SubKey in keyof QueryType<T, K>]: SubKey extends "$"
                            ? never
                            : QueryResult<T, SubKey & keyof T>;
                    };
                }
            ) as (T[K] & {
                [SubKey in keyof QueryType<T, K>]: SubKey extends "$"
                    ? never
                    : QueryResult<T, SubKey & keyof T>;
            })[];
        } else {
            result[modelName as K] = [];
        }
    }

    return result;
}
