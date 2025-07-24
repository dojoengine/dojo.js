import { Data, Effect, ParseResult, Schema } from "effect";
import type * as torii from "@dojoengine/torii-wasm/types";
import { CairoCustomEnum, CairoOption, CairoOptionVariant } from "starknet";
import type {
    ParsedEntity,
    SchemaType,
    StandardizedQueryResult,
} from "./types.ts";

class UnsupportedOperation extends Data.TaggedError("UnsupportedOperation")<{
    cause: string;
}> {}

// Forward declaration for recursive type
const TySchema: Schema.Schema<torii.Ty> = Schema.suspend(() =>
    Schema.Union(
        Schema.Struct({
            type: Schema.Literal("primitive"),
            type_name: Schema.String,
            value: Schema.Union(Schema.Boolean, Schema.Number, Schema.String),
            key: Schema.Boolean,
        }),
        Schema.Struct({
            type: Schema.Literal("struct"),
            type_name: Schema.String,
            value: Schema.Union(
                Schema.Record({
                    key: Schema.String,
                    value: TySchema,
                }),
                Schema.transform(
                    Schema.instanceOf(Map<string, torii.Ty>),
                    Schema.Record({
                        key: Schema.String,
                        value: TySchema,
                    }),
                    {
                        decode: (map) => Object.fromEntries(map),
                        encode: (record) => new Map(Object.entries(record)),
                    }
                )
            ),
            key: Schema.Boolean,
        }),
        Schema.Struct({
            type: Schema.Literal("enum"),
            type_name: Schema.String,
            value: EnumValueSchema,
            key: Schema.Boolean,
        }),
        Schema.Struct({
            type: Schema.Literal("array"),
            type_name: Schema.String,
            value: Schema.Array(TySchema),
            key: Schema.Boolean,
        }),
        Schema.Struct({
            type: Schema.Literal("tuple"),
            type_name: Schema.String,
            value: Schema.Array(TySchema),
            key: Schema.Boolean,
        }),
        Schema.Struct({
            type: Schema.Literal("bytearray"),
            type_name: Schema.String,
            value: Schema.Union(
                Schema.Boolean,
                Schema.Number,
                Schema.String,
                Schema.Array(TySchema),
                Schema.Record({
                    key: Schema.String,
                    value: TySchema,
                }),
                EnumValueSchema
            ),
            key: Schema.Boolean,
        })
    )
);

// EnumValue schema
const EnumValueSchema: Schema.Schema<torii.EnumValue> = Schema.Struct({
    option: Schema.String,
    value: TySchema,
});

// Model schema
const ModelSchema = Schema.Record({
    key: Schema.String,
    value: TySchema,
});

// Entity schema
export const EntitySchema = Schema.Struct({
    hashed_keys: Schema.String,
    models: Schema.Record({
        key: Schema.String,
        value: ModelSchema,
    }),
});

// Primitive value transformations
const hexToNumber = Schema.transform(Schema.String, Schema.Number, {
    decode: (hex: string) => Number.parseInt(hex, 16),
    encode: (num: number) => num.toString(16),
});

const hexToBigInt = Schema.transform(Schema.String, Schema.BigIntFromSelf, {
    decode: (hex: string) => BigInt(hex),
    encode: (bigInt: bigint) => bigInt.toString(16),
});

// Primitive parser based on type_name
export const parsePrimitiveValue = (value: torii.Ty): any => {
    if (value.type !== "primitive") return value.value;

    switch (value.type_name) {
        case "u64":
            return Schema.decodeSync(hexToNumber)(value.value as string);
        case "i256":
        case "i128":
        case "u256":
        case "u128":
            return Schema.decodeSync(hexToBigInt)(value.value as string);
        default:
            return Effect.succeed(value.value);
    }
};

// CairoOption schema creator
const createCairoOptionSchema = <T>(innerSchema: Schema.Schema<T>) =>
    Schema.Union(
        Schema.transform(
            Schema.Struct({
                option: Schema.Literal("Some"),
                value: innerSchema,
            }),
            Schema.instanceOf(CairoOption),
            {
                decode: ({ value }) =>
                    new CairoOption(CairoOptionVariant.Some, value),
                encode: (opt) => ({
                    option: "Some" as const,
                    value: opt.unwrap(),
                }),
            }
        ),
        Schema.transform(
            Schema.Struct({
                option: Schema.Literal("None"),
                value: Schema.Any,
            }),
            Schema.instanceOf(CairoOption),
            {
                decode: () => new CairoOption(CairoOptionVariant.None),
                encode: () => ({
                    option: "None" as const,
                    value: undefined,
                }),
            }
        )
    );

// CairoCustomEnum schema creator
const createCairoCustomEnumSchema = <T>(innerSchema: Schema.Schema<T>) =>
    Schema.transform(
        Schema.Record({
            key: Schema.String,
            value: innerSchema,
        }),
        Schema.instanceOf(CairoCustomEnum),
        {
            decode: (record) => new CairoCustomEnum(record),
            encode: (customEnum) => customEnum.activeVariant(),
        }
    );

// Main value parser schema
export const parseValueSchema: Schema.Schema<any, torii.Ty> =
    Schema.transformOrFail(TySchema, Schema.Any, {
        decode: (value: torii.Ty) => {
            switch (value.type) {
                case "primitive":
                    return parsePrimitiveValue(value);

                case "struct": {
                    const struct = value.value as
                        | Record<string, torii.Ty>
                        | Map<string, torii.Ty>;
                    const entries =
                        struct instanceof Map
                            ? Array.from(struct.entries())
                            : Object.entries(struct);

                    const parsedEntries = entries.map(([key, val]) => [
                        key,
                        Schema.decodeSync(parseValueSchema)(val),
                    ]);

                    return Effect.succeed(Object.fromEntries(parsedEntries));
                }

                case "enum": {
                    const enumValue = value.value as torii.EnumValue;

                    // Handle CairoOption
                    if (
                        enumValue.option === "Some" ||
                        enumValue.option === "None"
                    ) {
                        if (enumValue.option === "Some") {
                            const innerValue = Schema.decodeSync(
                                parseValueSchema
                            )(enumValue.value);
                            return Effect.succeed(
                                new CairoOption(
                                    CairoOptionVariant.Some,
                                    innerValue
                                )
                            );
                        }

                        return Effect.succeed(
                            new CairoOption(CairoOptionVariant.None)
                        );
                    }

                    // Handle simple enum (when value is tuple)
                    if (enumValue.value.type === "tuple") {
                        return Effect.succeed(
                            new CairoCustomEnum({ [enumValue.option]: "()" })
                        );
                    }

                    // Handle CairoCustomEnum
                    const innerValue = Schema.decodeSync(parseValueSchema)(
                        enumValue.value
                    );
                    return Effect.succeed(
                        new CairoCustomEnum({
                            [enumValue.option]: innerValue,
                        })
                    );
                }

                case "tuple":
                case "array": {
                    const items = (value.value as torii.Ty[]).map((item) =>
                        Schema.decodeSync(parseValueSchema)(item)
                    );
                    return Effect.succeed(items);
                }

                default:
                    return Effect.succeed(value.value);
            }
        },
        encode: (input, options, ast) => {
            return ParseResult.fail(
                new ParseResult.Type(ast, input, "not supported yet")
            );
        },
    });

// Parse struct helper
const parseStructSchema = Schema.transformOrFail(
    Schema.Union(
        Schema.Record({
            key: Schema.String,
            value: TySchema,
        }),
        Schema.instanceOf(Map<string, torii.Ty>)
    ),
    Schema.Record({
        key: Schema.String,
        value: Schema.Any,
    }),
    {
        decode: (struct) => {
            const entries =
                struct instanceof Map
                    ? Array.from(struct.entries())
                    : Object.entries(struct);

            const parsedEntries = entries.map(([key, value]) => [
                key,
                Schema.decodeSync(parseValueSchema)(value),
            ]);

            return Effect.succeed(Object.fromEntries(parsedEntries));
        },
        encode: (input, options, ast) =>
            Effect.fail(
                new ParseResult.Type(ast, input, "encode not supported")
            ),
    }
);

// Parse single entity schema
const parseSingleEntitySchema = <T extends SchemaType>() =>
    Schema.transformOrFail(
        EntitySchema,
        Schema.Any as Schema.Schema<ParsedEntity<T>>,
        {
            decode: (entity: torii.Entity, options?: { logging?: boolean }) => {
                const parsedEntity: ParsedEntity<T> = {
                    entityId: entity.hashed_keys,
                    models: {} as ParsedEntity<T>["models"],
                };

                for (const modelName in entity.models) {
                    const [namespaceKey, modelKey] = modelName.split("-") as [
                        keyof T,
                        string
                    ];

                    if (!namespaceKey || !modelKey) {
                        if (options?.logging) {
                            console.warn(
                                `Invalid modelName format: ${modelName}`
                            );
                        }
                        continue;
                    }

                    if (!parsedEntity.models[namespaceKey]) {
                        parsedEntity.models[namespaceKey] =
                            {} as T[typeof namespaceKey];
                    }

                    const modelData = entity.models[modelName];
                    const parsedModelData =
                        Schema.decodeSync(parseStructSchema)(modelData);
                    parsedEntity.models[namespaceKey][modelKey] =
                        parsedModelData;
                }

                if (options?.logging) {
                    console.log(`Parsed entity:`, parsedEntity);
                }

                return Effect.succeed(parsedEntity);
            },
            encode: (input, options, ast) =>
                Effect.fail(
                    new ParseResult.Type(ast, input, "encode not supported")
                ),
        }
    );

// Main parseEntities schema
export const createParseEntitiesSchema = <T extends SchemaType>(options?: {
    logging?: boolean;
}) =>
    Schema.transform(
        Schema.Array(EntitySchema),
        Schema.Array(Schema.Any) as Schema.Schema<StandardizedQueryResult<T>>,
        {
            decode: (entities: torii.Entity[]) => {
                const result: ParsedEntity<T>[] = [];

                for (const entity of entities) {
                    const parsedEntity = Schema.decodeSync(
                        parseSingleEntitySchema<T>()
                    )(entity, options);
                    result.push(parsedEntity);
                }

                if (options?.logging) {
                    console.log("Parsed result:", result);
                }

                return result;
            },
            encode: (parsed) => {
                // For now, encoding is not implemented as it's not needed
                throw new Error(
                    "Encoding StandardizedQueryResult back to entities is not implemented"
                );
            },
        }
    );

// Convenience function that matches the original API
export function parseEntitiesWithSchema<T extends SchemaType>(
    entities: torii.Entity[],
    options?: { logging?: boolean }
): StandardizedQueryResult<T> {
    const schema = createParseEntitiesSchema<T>(options);
    return Schema.decodeSync(schema)(entities);
}
