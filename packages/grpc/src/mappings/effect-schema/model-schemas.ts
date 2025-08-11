import { Schema } from "effect";
import type * as GrpcSchema from "../../generated/schema";
import type * as ToriiTypes from "@dojoengine/torii-wasm";
import { BufferToHex } from "./base-schemas";

const PrimitiveSchema = Schema.transform(
    Schema.Struct({
        primitive_type: Schema.Union(
            Schema.Struct({
                oneofKind: Schema.Literal("i8"),
                i8: Schema.Number,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("i16"),
                i16: Schema.Number,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("i32"),
                i32: Schema.Number,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("i64"),
                i64: Schema.BigIntFromSelf,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("i128"),
                i128: Schema.Uint8ArrayFromSelf,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("u8"),
                u8: Schema.Number,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("u16"),
                u16: Schema.Number,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("u32"),
                u32: Schema.Number,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("u64"),
                u64: Schema.BigIntFromSelf,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("u128"),
                u128: Schema.Uint8ArrayFromSelf,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("u256"),
                u256: Schema.Uint8ArrayFromSelf,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("bool"),
                bool: Schema.Boolean,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("felt252"),
                felt252: Schema.Uint8ArrayFromSelf,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("class_hash"),
                class_hash: Schema.Uint8ArrayFromSelf,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("contract_address"),
                contract_address: Schema.Uint8ArrayFromSelf,
            }),
            Schema.Struct({
                oneofKind: Schema.Literal("eth_address"),
                eth_address: Schema.Uint8ArrayFromSelf,
            })
        ).pipe(Schema.optional),
    }),
    Schema.Unknown,
    {
        decode: (primitive) => {
            if (!primitive.primitive_type) return null;

            switch (primitive.primitive_type.oneofKind) {
                case "i8":
                    return primitive.primitive_type.i8;
                case "i16":
                    return primitive.primitive_type.i16;
                case "i32":
                    return primitive.primitive_type.i32;
                case "i64":
                    return Number(primitive.primitive_type.i64);
                case "i128":
                    return BufferToHex.pipe(Schema.decodeSync)(
                        primitive.primitive_type.i128
                    );
                case "u8":
                    return primitive.primitive_type.u8;
                case "u16":
                    return primitive.primitive_type.u16;
                case "u32":
                    return primitive.primitive_type.u32;
                case "u64":
                    return Number(primitive.primitive_type.u64);
                case "u128":
                    return BufferToHex.pipe(Schema.decodeSync)(
                        primitive.primitive_type.u128
                    );
                case "u256":
                    return BufferToHex.pipe(Schema.decodeSync)(
                        primitive.primitive_type.u256
                    );
                case "bool":
                    return primitive.primitive_type.bool;
                case "felt252":
                    return BufferToHex.pipe(Schema.decodeSync)(
                        primitive.primitive_type.felt252
                    );
                case "class_hash":
                    return BufferToHex.pipe(Schema.decodeSync)(
                        primitive.primitive_type.class_hash
                    );
                case "contract_address":
                    return BufferToHex.pipe(Schema.decodeSync)(
                        primitive.primitive_type.contract_address
                    );
                case "eth_address":
                    return BufferToHex.pipe(Schema.decodeSync)(
                        primitive.primitive_type.eth_address
                    );
                default:
                    return null;
            }
        },
        encode: (value) => {
            throw new Error("Encoding not implemented for PrimitiveSchema");
        },
    }
);

interface TySchemaType extends Schema.Schema<ToriiTypes.Ty, GrpcSchema.Ty> {}
interface MemberSchemaType
    extends Schema.Schema<GrpcSchema.Member, GrpcSchema.Member> {}

const TySchema: TySchemaType = Schema.suspend(() =>
    Schema.transform(
        Schema.Struct({
            ty_type: Schema.Union(
                Schema.Struct({
                    oneofKind: Schema.Literal("primitive"),
                    primitive: PrimitiveSchema,
                }),
                Schema.Struct({
                    oneofKind: Schema.Literal("struct"),
                    struct: Schema.Struct({
                        name: Schema.String,
                        children: Schema.Array(MemberSchema),
                    }),
                }),
                Schema.Struct({
                    oneofKind: Schema.Literal("enum"),
                    enum: Schema.Struct({
                        name: Schema.String,
                        option: Schema.Number,
                        options: Schema.Array(MemberSchema),
                    }),
                }),
                Schema.Struct({
                    oneofKind: Schema.Literal("array"),
                    array: Schema.Struct({
                        children: Schema.Array(TySchema),
                    }),
                }),
                Schema.Struct({
                    oneofKind: Schema.Literal("tuple"),
                    tuple: Schema.Struct({
                        children: Schema.Array(TySchema),
                    }),
                }),
                Schema.Struct({
                    oneofKind: Schema.Literal("bytearray"),
                    bytearray: Schema.String,
                })
            ).pipe(Schema.optional),
        }),
        Schema.Struct({
            type: Schema.String,
            type_name: Schema.String,
            value: Schema.Unknown,
            key: Schema.Boolean,
        }),
        {
            decode: (ty, isKey = false) => {
                if (!ty.ty_type) {
                    return {
                        type: "primitive",
                        type_name: "",
                        value: null,
                        key: isKey,
                    };
                }

                switch (ty.ty_type.oneofKind) {
                    case "primitive": {
                        const primitiveValue = PrimitiveSchema.pipe(
                            Schema.decodeSync
                        )(ty.ty_type.primitive);
                        return {
                            type: "primitive",
                            type_name:
                                ty.ty_type.primitive.primitive_type
                                    ?.oneofKind || "",
                            value: primitiveValue,
                            key: isKey,
                        };
                    }
                    case "struct": {
                        const struct = ty.ty_type.struct;
                        const structValue: Record<string, ToriiTypes.Ty> = {};

                        for (const member of struct.children) {
                            if (member.ty) {
                                structValue[member.name] = TySchema.pipe(
                                    Schema.decodeSync
                                )(member.ty);
                            }
                        }

                        return {
                            type: "struct",
                            type_name: struct.name,
                            value: structValue,
                            key: isKey,
                        };
                    }
                    case "enum": {
                        const enumType = ty.ty_type.enum;
                        const selectedOption =
                            enumType.options[enumType.option];

                        return {
                            type: "enum",
                            type_name: enumType.name,
                            value:
                                selectedOption && selectedOption.ty
                                    ? {
                                          option: selectedOption.name,
                                          value: TySchema.pipe(
                                              Schema.decodeSync
                                          )(selectedOption.ty),
                                      }
                                    : null,
                            key: isKey,
                        };
                    }
                    case "array": {
                        const array = ty.ty_type.array;
                        return {
                            type: "array",
                            type_name: "array",
                            value: array.children.map((child) =>
                                TySchema.pipe(Schema.decodeSync)(child)
                            ),
                            key: isKey,
                        };
                    }
                    case "tuple": {
                        const tuple = ty.ty_type.tuple;
                        return {
                            type: "tuple",
                            type_name: "tuple",
                            value: tuple.children.map((child) =>
                                TySchema.pipe(Schema.decodeSync)(child)
                            ),
                            key: isKey,
                        };
                    }
                    case "bytearray": {
                        return {
                            type: "bytearray",
                            type_name: "bytearray",
                            value: ty.ty_type.bytearray,
                            key: isKey,
                        };
                    }
                    default:
                        return {
                            type: "primitive",
                            type_name: "",
                            value: null,
                            key: isKey,
                        };
                }
            },
            encode: (torii) => {
                throw new Error("Encoding not implemented for TySchema");
            },
        }
    )
);

const MemberSchema: MemberSchemaType = Schema.suspend(() =>
    Schema.Struct({
        name: Schema.String,
        ty: Schema.optional(TySchema),
        key: Schema.Boolean,
    })
);

export const ModelSchema = Schema.transform(
    Schema.Array(MemberSchema),
    Schema.Record({ key: Schema.String, value: TySchema }),
    {
        decode: (members) => {
            const model: ToriiTypes.Model = {};
            if (members && Array.isArray(members)) {
                for (const member of members) {
                    if (member.ty) {
                        const ty = TySchema.pipe(Schema.decodeSync)(member.ty);
                        model[member.name] = { ...ty, key: member.key };
                    }
                }
            }
            return model;
        },
        encode: (model) => {
            throw new Error("Encoding not implemented for ModelSchema");
        },
    }
);

export const EntitySchema = Schema.transform(
    Schema.Struct({
        hashed_keys: Schema.Uint8ArrayFromSelf,
        models: Schema.Array(
            Schema.Struct({
                name: Schema.String,
                children: Schema.Array(MemberSchema),
            })
        ),
    }),
    Schema.Struct({
        hashed_keys: BufferToHex,
        models: Schema.Record({ key: Schema.String, value: ModelSchema }),
    }),
    {
        decode: (grpc) => {
            const models: Record<string, ToriiTypes.Model> = {};
            for (const model of grpc.models) {
                models[model.name] = ModelSchema.pipe(Schema.decodeSync)(
                    model.children
                );
            }
            return {
                hashed_keys: BufferToHex.pipe(Schema.decodeSync)(
                    grpc.hashed_keys
                ),
                models,
            };
        },
        encode: (torii) => {
            throw new Error("Encoding not implemented for EntitySchema");
        },
    }
);

export const EntitiesResponseSchema = Schema.transform(
    Schema.Struct({
        entities: Schema.Array(EntitySchema),
        next_cursor: Schema.optional(Schema.String),
    }),
    Schema.Struct({
        items: Schema.Array(EntitySchema),
        next_cursor: Schema.optional(Schema.String),
    }),
    {
        decode: (grpc) => ({
            items: grpc.entities,
            next_cursor: grpc.next_cursor,
        }),
        encode: (torii) => ({
            entities: torii.items,
            next_cursor: torii.next_cursor,
        }),
    }
);
