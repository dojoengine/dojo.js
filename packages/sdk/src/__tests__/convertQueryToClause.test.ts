import { describe, it, expect } from "vitest";
import { convertQueryToClause } from "../convertQuerytoClause";
import { QueryType, SchemaType } from "../types";

// Define a mock SchemaType for testing purposes
interface MockSchemaType extends SchemaType {
    world: {
        player: {
            id: string;
            name: string;
            score: number;
        };
        game: {
            id: string;
            status: string;
        };
        item: {
            id: string;
            type: string;
            durability: number;
        };
    };
}

describe("convertQueryToClause", () => {
    it("should convert a single model query with conditions", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: { where: { id: "1", name: "Alice" } },
                },
            },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [
                    {
                        Member: {
                            model: "world-player",
                            member: "id",
                            operator: "Eq",
                            value: { Felt252: "1" },
                        },
                    },
                    {
                        Member: {
                            model: "world-player",
                            member: "name",
                            operator: "Eq",
                            value: { Felt252: "Alice" },
                        },
                    },
                ],
            },
        });
    });

    it("should convert a single model query without conditions", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {},
            },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Keys: {
                keys: [],
                pattern_matching: "VariableLen",
                models: ["world-player"],
            },
        });
    });

    it("should convert multiple model queries", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: { $: { where: { id: "1" } } },
                game: {
                    $: { where: { status: "active" } },
                },
            },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [
                    {
                        Member: {
                            model: "world-player",
                            member: "id",
                            operator: "Eq",
                            value: { Felt252: "1" },
                        },
                    },
                    {
                        Member: {
                            model: "world-game",
                            member: "status",
                            operator: "Eq",
                            value: { Felt252: "active" },
                        },
                    },
                ],
            },
        });
    });
    it("should handle complex conditions with multiple operators", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: { where: { score: { $gt: 100, $lt: 1000 } } },
                },
            },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [
                    {
                        Member: {
                            model: "world-player",
                            member: "score",
                            operator: "Gt",
                            value: { U32: 100 },
                        },
                    },
                    {
                        Member: {
                            model: "world-player",
                            member: "score",
                            operator: "Lt",
                            value: { U32: 1000 },
                        },
                    },
                ],
            },
        });
    });

    it("should handle queries with entityIds", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: { where: { name: "Alice" } },
                },
            },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [
                    {
                        Member: {
                            model: "world-player",
                            member: "name",
                            operator: "Eq",
                            value: { Felt252: "Alice" },
                        },
                    },
                ],
            },
        });
    });

    it("should handle queries with limit and offset", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: { where: { score: { $gt: 50 } }, limit: 10, offset: 5 },
                },
            },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [
                    {
                        Member: {
                            model: "world-player",
                            member: "score",
                            operator: "Gt",
                            value: { U32: 50 },
                        },
                    },
                ],
            },
        });
    });

    it("should handle queries with multiple models and complex conditions", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: { where: { score: { $gt: 100 } } },
                },
                game: {
                    $: { where: { status: "active" } },
                },
                item: {
                    $: { where: { durability: { $lt: 50 } } },
                },
            },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [
                    {
                        Member: {
                            model: "world-player",
                            member: "score",
                            operator: "Gt",
                            value: { U32: 100 },
                        },
                    },
                    {
                        Member: {
                            model: "world-game",
                            member: "status",
                            operator: "Eq",
                            value: { Felt252: "active" },
                        },
                    },
                    {
                        Member: {
                            model: "world-item",
                            member: "durability",
                            operator: "Lt",
                            value: { U32: 50 },
                        },
                    },
                ],
            },
        });
    });

    it("should handle queries with boolean values", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: { where: { isActive: true } },
                },
            },
        };

        const result = convertQueryToClause(query);

        expect(result).toEqual({
            Composite: {
                operator: "And",
                clauses: [
                    {
                        Member: {
                            model: "world-player",
                            member: "isActive",
                            operator: "Eq",
                            value: { Bool: true },
                        },
                    },
                ],
            },
        });
    });
});
