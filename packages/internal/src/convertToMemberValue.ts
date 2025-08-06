import type * as torii from "@dojoengine/torii-wasm/types";

type ToUnion<T> = T extends infer U ? U : never;
type ExtractPrimitiveKeys<T> = T extends Record<infer K, any> ? K : never;
type PrimitiveTypeKeys = ToUnion<ExtractPrimitiveKeys<torii.Primitive>>;

export type MemberValueParam = { type: PrimitiveTypeKeys; value: any } | any;

/**
 * Converts a value to a Torii primitive type.
 *
 * @param {MemberValue} value - The value to convert.
 * @returns {torii.MemberValue} - The converted primitive value.
 * @throws {Error} - If the value type is unsupported.
 */
export function convertToPrimitive(
    value: MemberValueParam,
    shortStringToFelt: typeof torii.cairoShortStringToFelt
): torii.MemberValue {
    // if you want to have more control over type passed to torii
    if (Object.hasOwn(value, "type") && Object.hasOwn(value, "value")) {
        return { Primitive: { [value.type]: value.value } as torii.Primitive };
    }

    if (typeof value === "number") {
        return { Primitive: { U32: value } };
    }

    if (typeof value === "boolean") {
        return { Primitive: { Bool: value } };
    }

    if (typeof value === "bigint") {
        return {
            Primitive: {
                Felt252: shortStringToFelt(value.toString()),
            },
        };
    }

    if (typeof value === "string") {
        return { String: value };
    }

    if (Array.isArray(value)) {
        return {
            List: value.map((item) =>
                convertToPrimitive(item, shortStringToFelt)
            ),
        };
    }

    // Add more type conversions as needed
    throw new Error(`Unsupported primitive type: ${typeof value}`);
}
