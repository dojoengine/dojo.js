import type * as torii from "@dojoengine/torii-wasm/types";
import { CairoCustomEnum, CairoOption, CairoOptionVariant } from "starknet";
import type {
    ParsedEntity,
    SchemaType,
    StandardizedQueryResult,
} from "./types.ts";

export function parseEntities<T extends SchemaType>(
    entities: torii.Entity[],
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

/**
 * Parses a value based on its type.
 *
 * @param {torii.Ty} value - The value to parse.
 * @returns {any} - The parsed value.
 */
function parseValue(value: torii.Ty): any {
    switch (value.type) {
        case "primitive":
            return parsePrimitive(value);
        case "struct":
            return parseStruct(
                value.value as Record<string, torii.Ty> | Map<string, torii.Ty>
            );
        case "enum":
            // Handling Options
            if ("Some" === (value.value as torii.EnumValue).option) {
                return new CairoOption(
                    CairoOptionVariant.Some,
                    parseValue((value.value as torii.EnumValue).value)
                );
            }
            if ("None" === (value.value as torii.EnumValue).option) {
                return new CairoOption(CairoOptionVariant.None);
            }

            // Handling simple enum as default case
            // Handling CairoCustomEnum for more complex types
            return parseCustomEnum(value);
        case "tuple":
        case "array":
            return (value.value as torii.Ty[]).map(parseValue);
        default:
            return value.value;
    }
}

/**
 * Parses a value identified as enum either returns a single string matching enum value
 * or CairoCustomEnum matching more complex cairo types
 *
 * @param {torii.Ty} value - The value to parse.
 * @returns {CairoCustomEnum | string} - The parsed value.
 */
function parseCustomEnum(value: torii.Ty): CairoCustomEnum | string {
    // enum is a simple enum
    if ((value.value as torii.EnumValue).value.type === "tuple") {
        // we keep retrocompatibility
        return (value.value as torii.EnumValue).option;
    }

    return new CairoCustomEnum({
        [(value.value as torii.EnumValue).option]: parseValue(
            (value.value as torii.EnumValue).value
        ),
    });
}

/**
 * Parses a value based on its primitive type.
 *
 * @param {torii.Ty} value - The value to parse.
 * @returns {any} - The parsed value.
 */
function parsePrimitive(value: torii.Ty): any {
    switch (value.type_name) {
        case "u64":
        case "i64":
            return Number(value.value as string);
        case "u128":
        case "i128":
            return BigInt(value.value as string);
        case "u256":
            return BigInt(value.value as string);
        case "u8":
        case "u16":
        case "u32":
        case "i8":
        case "i16":
        case "i32":
        case "bool":
        case "ContractAddress":
        case "ClassHash":
        case "felt252":
        case "EthAddress":
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
