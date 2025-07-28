import type {
    Ty,
    Entity as ToriiEntity,
    EnumValue,
} from "@dojoengine/torii-wasm";

import { CairoCustomEnum, CairoOption, CairoOptionVariant } from "starknet";

export type SchemaType = {
    [namespace: string]: {
        [model: string]: {
            [field: string]: any;
        };
    };
};

export type ParsedEntity<T extends SchemaType> = {
    entityId: string;
    models: {
        [K in keyof T]: {
            [M in keyof T[K]]?: T[K][M] extends object
                ? Partial<T[K][M]>
                : T[K][M];
        };
    };
};

export type StandardizedQueryResult<T extends SchemaType> = Array<
    ParsedEntity<T>
>;

function parsePrimitive(value: Ty): any {
    switch (value.type_name) {
        case "u64":
            return Number.parseInt(value.value as string, 16);
        case "i256":
        case "i128":
        case "u256":
        case "u128":
            return BigInt(value.value as string);
        default:
            return value.value;
    }
}

function parseStruct(struct: Record<string, Ty> | Map<string, Ty>): any {
    const entries =
        struct instanceof Map
            ? Array.from(struct.entries())
            : Object.entries(struct);
    return Object.fromEntries(
        entries.map(([key, value]) => [key, parseValue(value)])
    );
}

function parseCustomEnum(value: Ty): CairoCustomEnum | string {
    const enumValue = value.value as EnumValue;
    // enum is a simple enum
    if (enumValue.value.type === "tuple") {
        // we keep retrocompatibility
        return enumValue.option;
    }

    return new CairoCustomEnum({
        [enumValue.option]: parseValue(enumValue.value),
    });
}

function parseValue(value: Ty): any {
    switch (value.type) {
        case "primitive":
            return parsePrimitive(value);
        case "struct":
            return parseStruct(
                value.value as Record<string, Ty> | Map<string, Ty>
            );
        case "enum":
            const enumValue = value.value as EnumValue;
            // Handling Options
            if ("Some" === enumValue.option) {
                return new CairoOption(
                    CairoOptionVariant.Some,
                    parseValue(enumValue.value)
                );
            }
            if ("None" === enumValue.option) {
                return new CairoOption(CairoOptionVariant.None);
            }

            // Handling simple enum as default case
            // Handling CairoCustomEnum for more complex types
            return parseCustomEnum(value);
        case "tuple":
        case "array":
            return (value.value as Ty[]).map(parseValue);
        default:
            return value.value;
    }
}

export function parseEntities<T extends SchemaType>(
    entities: ToriiEntity[],
    options?: { logging?: boolean }
): StandardizedQueryResult<T> {
    // @ts-ignore
    const result: ParsedEntity<T>[] = [];

    for (const entity of entities) {
        const entityId = entity.hashed_keys;
        const entityData = entity.models;
        const parsedEntity: ParsedEntity<T> = {
            entityId,
            models: {} as ParsedEntity<T>["models"],
        };

        for (const modelName in entity.models) {
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

    return Object.values(result);
}
