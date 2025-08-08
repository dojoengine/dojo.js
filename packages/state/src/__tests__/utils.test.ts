import { Type as RecsType, Schema } from "@dojoengine/recs";
import { afterEach, describe, expect, it, spyOn } from "bun:test";

import { convertValues } from "../utils";

describe("convertValues", () => {
    // ... existing tests ...
    const consoleSpy = spyOn(console, "warn").mockImplementation(
        () => undefined
    );
    afterEach(() => {
        consoleSpy.mockReset();
    });

    describe("huge numbers", () => {
        it("should correctly convert huge BigInt values", () => {
            const schema = { hugeNumber: RecsType.BigInt };
            const values = {
                hugeNumber: {
                    value: "1000000000000000000000000000000000000000000000000000000000000001",
                },
            };
            const result = convertValues(schema, values);
            expect(result.hugeNumber).toBe(
                BigInt(
                    "1000000000000000000000000000000000000000000000000000000000000001"
                )
            );
        });

        it("should correctly convert huge BigInt values", () => {
            const schema = { hugeNumber: RecsType.BigInt };
            const values = {
                hugeNumber: {
                    value: "7f000000000000000000000000000000000000000000000000000000103fffff",
                },
            };
            const result = convertValues(schema, values);
            expect(result.hugeNumber).toBe(
                BigInt(
                    "0x7f000000000000000000000000000000000000000000000000000000103fffff"
                )
            );
        });

        it("should correctly convert huge Number values", () => {
            const schema = { hugeNumber: RecsType.Number };
            const values = { hugeNumber: { value: "1e+308" } }; // Max safe double
            const result = convertValues(schema, values);
            expect(result.hugeNumber).toBe(1e308);
        });

        it("should handle overflow for Number type", () => {
            const schema = { overflowNumber: RecsType.Number };
            const values = { overflowNumber: { value: "1e+309" } }; // Beyond max safe double
            const result = convertValues(schema, values);
            expect(result.overflowNumber).toBe(Infinity);
        });

        it("should correctly convert huge numbers in StringArray", () => {
            const schema = { hugeArray: RecsType.StringArray };
            const values = {
                hugeArray: {
                    value: [
                        { value: "12345678901234567890" },
                        { value: "98765432109876543210" },
                    ],
                },
            };
            const result = convertValues(schema, values);
            expect(result.hugeArray).toEqual([
                12345678901234567890n,
                98765432109876543210n,
            ]);
        });
    });

    describe("additional test cases", () => {
        it("should correctly convert boolean values", () => {
            const schema = { isActive: RecsType.Boolean };
            const values = { isActive: { value: true } };
            const result = convertValues(schema, values);
            expect(result.isActive).toBe(true);
        });

        it("should correctly convert string values", () => {
            const schema = { name: RecsType.String };
            const values = { name: { value: "Test Name" } };
            const result = convertValues(schema, values);
            expect(result.name).toBe("Test Name");
        });

        it("should handle null values", () => {
            const schema = { nullableField: RecsType.String };
            const values = { nullableField: { value: null } };
            const result = convertValues(schema, values);
            expect(result.nullableField).toBeNull();
        });

        it("should handle undefined values", () => {
            const schema = { undefinedField: RecsType.String };
            const values = { undefinedField: { value: undefined } };
            const result = convertValues(schema, values);
            expect(result.undefinedField).toBeUndefined();
        });

        it("should correctly convert nested schema values", () => {
            const schema = { nested: { innerField: RecsType.Number } };
            const values = {
                nested: { value: { innerField: { value: "42" } } },
            };
            const result = convertValues(schema, values);

            expect(result.nested).toEqual({ innerField: { value: "42" } });
        });
    });

    it("should handle null and undefined values", () => {
        const schema: Schema = {
            name: RecsType.String,
            age: RecsType.Number,
        };
        const values = {
            name: { value: "Alice", type: "string" },
            age: undefined,
        };
        const expected = {
            name: "Alice",
            age: undefined,
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should convert enum types correctly", () => {
        const schema: Schema = {
            status: RecsType.String,
        };
        const values = {
            status: { value: { option: "ACTIVE" }, type: "enum" },
        };
        const expected = {
            status: "ACTIVE",
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should handle RecsType.StringArray with empty array", () => {
        const schema: Schema = {
            tags: RecsType.StringArray,
        };
        const values = {
            tags: { value: [], type: "array" },
        };
        const expected = {
            tags: [],
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should handle RecsType.StringArray with enum items", () => {
        const schema: Schema = {
            tags: RecsType.StringArray,
        };
        const values = {
            tags: {
                value: [
                    { value: { option: "TAG1" }, type: "enum" },
                    { value: { option: "TAG2" }, type: "enum" },
                ],
                type: "array",
            },
        };
        const expected = {
            tags: ["TAG1", "TAG2"],
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should handle RecsType.StringArray with BigInt conversion", () => {
        const schema: Schema = {
            ids: RecsType.StringArray,
        };
        const values = {
            ids: {
                value: [
                    { value: "12345678901234567890", type: "string" },
                    { value: "98765432109876543210", type: "string" },
                ],
                type: "array",
            },
        };
        const expected = {
            ids: [
                BigInt("12345678901234567890"),
                BigInt("98765432109876543210"),
            ],
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should fallback to string if BigInt conversion fails", () => {
        const schema: Schema = {
            ids: RecsType.StringArray,
        };
        const values = {
            ids: {
                value: [{ value: "invalid_bigint", type: "string" }],
                type: "array",
            },
        };
        const expected = {
            ids: ["invalid_bigint"],
        };
        expect(convertValues(schema, values)).toEqual(expected);

        // TODO: fix console mocking
        // expect(consoleSpy).toHaveBeenCalled();
        // expect(consoleSpy).toHaveBeenCalledWith(
        //   "Failed to convert invalid_bigint to BigInt. Using string value instead."
        // );
    });

    it("should handle RecsType.String", () => {
        const schema: Schema = {
            name: RecsType.String,
        };
        const values = {
            name: { value: "Bob", type: "string" },
        };
        const expected = {
            name: "Bob",
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should handle RecsType.BigInt with valid BigInt", () => {
        const schema: Schema = {
            balance: RecsType.BigInt,
        };
        const values = {
            balance: { value: "1000000000000000000", type: "string" },
        };
        const expected = {
            balance: BigInt("1000000000000000000"),
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should handle RecsType.Boolean", () => {
        const schema: Schema = {
            isActive: RecsType.Boolean,
        };
        const values = {
            isActive: { value: true, type: "boolean" },
        };
        const expected = {
            isActive: true,
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should handle RecsType.Number", () => {
        const schema: Schema = {
            score: RecsType.Number,
        };
        const values = {
            score: { value: "42", type: "string" },
        };
        const expected = {
            score: 42,
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should handle nested structs", () => {
        const nestedSchema: Schema = {
            street: RecsType.String,
            zip: RecsType.Number,
        };
        const schema: Schema = {
            name: RecsType.String,
            address: nestedSchema,
        };
        const values = {
            name: { value: "Charlie", type: "string" },
            address: {
                value: {
                    street: { value: "123 Main St", type: "string" },
                    zip: { value: "12345", type: "string" },
                },
                type: "struct",
            },
        };
        const expected = {
            name: "Charlie",
            address: {
                street: "123 Main St",
                zip: 12345,
            },
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should handle map structures", () => {
        const nestedSchema: Schema = {
            key1: RecsType.String,
            key2: RecsType.Number,
        };
        const schema: Schema = {
            config: nestedSchema,
        };
        const values = {
            config: {
                value: new Map([
                    ["key1", { value: "value1", type: "string" }],
                    ["key2", { value: "100", type: "string" }],
                ]),
                type: "struct",
            },
        };
        const expected = {
            config: {
                key1: "value1",
                key2: 100,
            },
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should handle primitive fallback in default case", () => {
        const schema: Schema = {
            miscellaneous: RecsType.String,
        };
        const values = {
            miscellaneous: { value: "some value", type: "unknown" },
        };
        const expected = {
            miscellaneous: "some value",
        };
        expect(convertValues(schema, values)).toEqual(expected);
    });

    it("should handle empty schema", () => {
        const schema: Schema = {};
        const values = {
            anyKey: { value: "any value", type: "string" },
        };
        const expected = {};
        expect(convertValues(schema, values)).toEqual(expected);
    });
    it("should not set value to undefined", () => {
        const schema: Schema = {
            name: RecsType.String,
            age: RecsType.Number,
        };
        const values = {
            name: { value: "Alice", type: "string" },
        };
        const expected = {
            name: "Alice",
        };
        expect(convertValues(schema, values)).toStrictEqual(expected);
    });
});
