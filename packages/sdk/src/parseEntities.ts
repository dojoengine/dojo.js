import { SchemaType } from "./types";
import * as torii from "@dojoengine/torii-client";

function parseValue(value: torii.Ty): any {
    if (value.type === "primitive") {
        return value.value;
    } else if (value.type === "struct") {
        return parseStruct(value.value as Record<string, torii.Ty>);
    } else if (value.type === "enum") {
        return (value.value as torii.EnumValue).option;
    } else if (value.type === "array") {
        return (value.value as torii.Ty[]).map(parseValue);
    }
    return value.value;
}

function parseStruct(struct: Record<string, torii.Ty>): any {
    const result: any = {};
    for (const key in struct) {
        result[key] = parseValue(struct[key]);
    }
    return result;
}

export function parseEntities<T extends SchemaType, K extends keyof T>(
    entities: torii.Entities,
    query: { [P in K]?: Partial<T[P]> }
): { [P in K]: T[P][] } {
    const result = {} as { [P in K]: T[P][] };

    for (const modelName in query) {
        if (entities[modelName]) {
            result[modelName as K] = Object.values(entities[modelName]).map(
                (entity) => {
                    return parseStruct(entity) as T[K];
                }
            );
        } else {
            result[modelName as K] = [];
        }
    }

    return result;
}
