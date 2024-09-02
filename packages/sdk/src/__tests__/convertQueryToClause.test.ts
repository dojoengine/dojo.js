import { describe, it, expect, vi } from "vitest";
import { convertQueryToClause } from "../convertQuerytoClause";

describe("convertQueryToClause", () => {
    it("should convert a single model query with conditions", () => {
        const query = {
            Player: { id: "1", name: "Alice" },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Keys: {
                keys: ["1", "Alice"],
                pattern_matching: "FixedLen",
                models: ["Player"],
            },
        });
    });

    it("should convert a single model query without conditions", () => {
        const query = {
            Player: {},
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Keys: {
                keys: [],
                pattern_matching: "VariableLen",
                models: ["Player"],
            },
        });
    });

    it("should convert multiple model queries", () => {
        const query = {
            Player: { id: "1" },
            Game: { status: "active" },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [
                    {
                        Keys: {
                            keys: ["1"],
                            pattern_matching: "FixedLen",
                            models: ["Player"],
                        },
                    },
                    {
                        Keys: {
                            keys: ["active"],
                            pattern_matching: "FixedLen",
                            models: ["Game"],
                        },
                    },
                ],
            },
        });
    });

    it("should handle mixed queries with and without conditions", () => {
        const query = {
            Player: { id: "1" },
            Game: {},
            Item: { type: "weapon" },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [
                    {
                        Keys: {
                            keys: ["1"],
                            pattern_matching: "FixedLen",
                            models: ["Player"],
                        },
                    },
                    {
                        Keys: {
                            keys: [],
                            pattern_matching: "VariableLen",
                            models: ["Game"],
                        },
                    },
                    {
                        Keys: {
                            keys: ["weapon"],
                            pattern_matching: "FixedLen",
                            models: ["Item"],
                        },
                    },
                ],
            },
        });
    });

    it("should handle an empty query", () => {
        const query = {};

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [],
            },
        });
    });
});
