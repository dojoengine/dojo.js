import { Type as RecsType, Schema } from "@dojoengine/recs";
import { describe, expect, it, beforeEach, vi } from "vitest";

import { convertValues } from "../utils";

describe("convertValues", () => {
    // Mock console.warn to suppress warnings during tests
    beforeEach(() => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
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

        it("should correctly convert huge hexadecimal BigInt values", () => {
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
                    type: "array",
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

        it("should handle empty StringArray", () => {
            const schema = { tags: RecsType.StringArray };
            const values = { tags: { type: "array", value: [] } };
            const result = convertValues(schema, values);
            expect(result.tags).toEqual([]);
        });

        it("should correctly convert StringArray with enum types", () => {
            const schema = { statuses: RecsType.StringArray };
            const values = {
                statuses: {
                    type: "array",
                    value: [
                        { type: "enum", value: { option: "ACTIVE" } },
                        { type: "enum", value: { option: "INACTIVE" } },
                    ],
                },
            };
            const result = convertValues(schema, values);
            expect(result.statuses).toEqual(["ACTIVE", "INACTIVE"]);
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
                nested: {
                    type: "struct",
                    value: { innerField: { value: "42" } },
                },
            };
            const result = convertValues(schema, values);

            expect(result.nested).toEqual({ innerField: 42 });
        });
    });

    describe("enum type handling", () => {
        it("should correctly convert enum values", () => {
            const schema = { status: RecsType.T };
            const values = {
                status: { type: "enum", value: { option: "ACTIVE" } },
            };
            const result = convertValues(schema, values);
            expect(result.status).toBe("ACTIVE");
        });
    });

    describe("BigInt conversion fallback", () => {
        it("should fallback to hexadecimal conversion for invalid BigInt strings", () => {
            const schema = { invalidBigInt: RecsType.BigInt };
            const values = { invalidBigInt: { value: "invalid_bigint" } };
            const result = convertValues(schema, values);
            // Since "invalid_bigint" is not a valid decimal or hexadecimal BigInt, expect undefined.
            expect(result.invalidBigInt).toBeUndefined();
        });
    });

    describe("array of structs", () => {
        it("should correctly convert array of structs", () => {
            const schema = {
                users: [
                    {
                        name: RecsType.String,
                        age: RecsType.Number,
                    },
                ],
            };
            const values = {
                users: {
                    type: "array",
                    value: [
                        {
                            type: "struct",
                            value: {
                                name: { value: "Alice" },
                                age: { value: "30" },
                            },
                        },
                        {
                            type: "struct",
                            value: {
                                name: { value: "Bob" },
                                age: { value: "25" },
                            },
                        },
                    ],
                },
            };
            const result = convertValues(schema as any, values);
            expect(result.users).toEqual([
                { name: "Alice", age: 30 },
                { name: "Bob", age: 25 },
            ]);
        });
    });

    describe("default case handling", () => {
        it("should assign value directly for unhandled schema types", () => {
            const schema = { miscellaneous: RecsType.T };
            const values = { miscellaneous: { value: { random: "data" } } };
            const result = convertValues(schema, values);
            expect(result.miscellaneous).toEqual({ random: "data" });
        });

        it("should handle struct with Map as value", () => {
            const schema = {
                config: {
                    settingA: RecsType.String,
                    settingB: RecsType.Number,
                },
            };
            const values = {
                config: {
                    type: "struct",
                    value: new Map([
                        ["settingA", { value: "Enabled" }],
                        ["settingB", { value: "100" }],
                    ]),
                },
            };
            const result = convertValues(schema, values);
            expect(result.config).toEqual({
                settingA: "Enabled",
                settingB: 100,
            });
        });

        it("should handle nested arrays of structs", () => {
            const schema = {
                departments: [
                    {
                        name: RecsType.String,
                        employees: [
                            {
                                name: RecsType.String,
                                role: RecsType.String,
                            },
                        ],
                    },
                ],
            };
            const values = {
                departments: {
                    type: "array",
                    value: [
                        {
                            type: "struct",
                            value: {
                                name: { value: "Engineering" },
                                employees: {
                                    type: "array",
                                    value: [
                                        {
                                            type: "struct",
                                            value: {
                                                name: { value: "Alice" },
                                                role: { value: "Developer" },
                                            },
                                        },
                                        {
                                            type: "struct",
                                            value: {
                                                name: { value: "Bob" },
                                                role: { value: "Designer" },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            type: "struct",
                            value: {
                                name: { value: "Marketing" },
                                employees: {
                                    type: "array",
                                    value: [
                                        {
                                            type: "struct",
                                            value: {
                                                name: { value: "Charlie" },
                                                role: { value: "Manager" },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                },
            };
            const result = convertValues(schema as any, values);
            expect(result.departments).toEqual([
                {
                    name: "Engineering",
                    employees: [
                        { name: "Alice", role: "Developer" },
                        { name: "Bob", role: "Designer" },
                    ],
                },
                {
                    name: "Marketing",
                    employees: [{ name: "Charlie", role: "Manager" }],
                },
            ]);
        });
    });
});
