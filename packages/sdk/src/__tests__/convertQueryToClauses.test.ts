import { describe, it, expect, vi } from "vitest";

import { SchemaType } from "../types";
import { convertQueryToClauses } from "../convertQueryToClauses";

describe("convertQueryToClauses", () => {
    it("should convert a query with conditions to clauses", () => {
        const query: Partial<SchemaType> = {
            Player: { id: "1", name: "Alice" },
            Item: { id: "2" },
        };

        const result = convertQueryToClauses(query);

        expect(result).toEqual([
            {
                Keys: {
                    keys: ["1", "Alice"],
                    pattern_matching: "FixedLen",
                    models: ["Player"],
                },
            },
            {
                Keys: {
                    keys: ["2"],
                    pattern_matching: "FixedLen",
                    models: ["Item"],
                },
            },
        ]);
    });

    it("should handle empty conditions with VariableLen pattern matching", () => {
        const query: Partial<SchemaType> = {
            Player: {},
            Item: { id: "2" },
        };

        const result = convertQueryToClauses(query);

        expect(result).toEqual([
            {
                Keys: {
                    keys: [],
                    pattern_matching: "VariableLen",
                    models: ["Player"],
                },
            },
            {
                Keys: {
                    keys: ["2"],
                    pattern_matching: "FixedLen",
                    models: ["Item"],
                },
            },
        ]);
    });

    it("should ignore non-object conditions", () => {
        const query: Partial<SchemaType> = {
            Player: { id: "1" },
            Item: null as any,
            Enemy: undefined as any,
        };

        const result = convertQueryToClauses(query);

        expect(result).toEqual([
            {
                Keys: {
                    keys: ["1"],
                    pattern_matching: "FixedLen",
                    models: ["Player"],
                },
            },
        ]);
    });

    it("should return an empty array for an empty query", () => {
        const query: Partial<SchemaType> = {};

        const result = convertQueryToClauses(query);

        expect(result).toEqual([]);
    });
});
