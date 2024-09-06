import { describe, it, expect } from "vitest";
import { convertQueryToClause } from "../convertQuerytoClause";
import { QueryType } from "..";

// Define a mock SchemaType for testing purposes
interface MockSchemaType {
    Player: {
        id: string;
        name: string;
        score: number;
    };
    Game: {
        id: string;
        status: string;
    };
    Item: {
        id: string;
        type: string;
        durability: number;
    };
}

describe("convertQueryToClause", () => {
    it("should convert a single model query with conditions", () => {
        const query: QueryType<MockSchemaType> = {
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
        const query: QueryType<MockSchemaType> = {
            Player: { $: {} },
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
        const query: QueryType<MockSchemaType> = {
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
        const query: QueryType<MockSchemaType> = {
            Player: { id: "1" },
            Game: { $: {} },
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
        const query: QueryType<MockSchemaType> = {};

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [],
            },
        });
    });

    it("should handle $ key with where conditions", () => {
        const query: QueryType<MockSchemaType> = {
            Player: { $: { where: { score: 100 } }, id: "1" },
            Item: { $: { where: { durability: 50 } } },
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
                        Member: {
                            model: "Player",
                            member: "score",
                            operator: "Eq",
                            value: { I128: "100" },
                        },
                    },
                    {
                        Member: {
                            model: "Item",
                            member: "durability",
                            operator: "Eq",
                            value: { I128: "50" },
                        },
                    },
                ],
            },
        });
    });
});
