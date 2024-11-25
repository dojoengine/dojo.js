// packages/sdk/src/__tests__/convertQueryToClause.test.ts

import { describe, expect, it } from "vitest";

import { MockSchemaType, schema } from "../__example__/index";
import { convertQueryToClause } from "../convertQuerytoClause";
import { QueryType } from "../types";

describe("convertQueryToClause", () => {
    it("should convert a single model query with conditions", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: { where: { id: { $eq: "1" }, name: { $eq: "Alice" } } },
                },
            },
            universe: {
                galaxy: {
                    $: {
                        where: { name: { $is: "Milky Way" } },
                    },
                },
            },
        };

        const result = convertQueryToClause(query, schema);

        expect(result).toEqual({
            Composite: {
                operator: "Or",
                clauses: [
                    {
                        Composite: {
                            operator: "And",
                            clauses: [
                                {
                                    Member: {
                                        model: "world-player",
                                        member: "id",
                                        operator: "Eq",
                                        value: { String: "1" },
                                    },
                                },
                                {
                                    Member: {
                                        model: "world-player",
                                        member: "name",
                                        operator: "Eq",
                                        value: { String: "Alice" },
                                    },
                                },
                            ],
                        },
                    },
                    {
                        Keys: {
                            keys: [undefined, "Milky Way"], // ['id', 'name']
                            pattern_matching: "VariableLen",
                            models: ["universe-galaxy"],
                        },
                    },
                ],
            },
        });
    });

    it("should return undefined, indicating fetch all", () => {
        const query: QueryType<MockSchemaType> = {
            world: {},
        };

        const result = convertQueryToClause(query, schema);

        expect(result).toEqual(undefined);
    });

    it("should convert multiple model queries", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: { $: { where: { id: { $eq: "1" } } } },
                game: {
                    $: { where: { status: { $eq: "active" } } },
                },
            },
        };

        const result = convertQueryToClause(query, schema);

        expect(result).toEqual({
            Composite: {
                operator: "Or",
                clauses: [
                    {
                        Member: {
                            model: "world-player",
                            member: "id",
                            operator: "Eq",
                            value: { String: "1" },
                        },
                    },
                    {
                        Member: {
                            model: "world-game",
                            member: "status",
                            operator: "Eq",
                            value: { String: "active" },
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
                    $: {
                        where: {
                            And: [
                                { score: { $gt: 100 } },
                                {
                                    Or: [
                                        { name: { $eq: "Alice" } },
                                        { name: { $eq: "Bob" } },
                                    ],
                                },
                            ],
                        },
                    },
                },
                item: {
                    $: {
                        where: {
                            And: [{ durability: { $lt: 50 } }],
                        },
                    },
                },
            },
        };

        const result = convertQueryToClause(query, schema);

        // Updated expectation to match the actual output
        expect(result).toEqual({
            Composite: {
                operator: "Or",
                clauses: [
                    {
                        Composite: {
                            operator: "And",
                            clauses: [
                                {
                                    Member: {
                                        model: "world-player",
                                        member: "score",
                                        operator: "Gt",
                                        value: { Primitive: { U32: 100 } },
                                    },
                                },
                                {
                                    Composite: {
                                        operator: "Or",
                                        clauses: [
                                            {
                                                Member: {
                                                    model: "world-player",
                                                    member: "name",
                                                    operator: "Eq",
                                                    value: { String: "Alice" },
                                                },
                                            },
                                            {
                                                Member: {
                                                    model: "world-player",
                                                    member: "name",
                                                    operator: "Eq",
                                                    value: { String: "Bob" },
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        Member: {
                            model: "world-item",
                            member: "durability",
                            operator: "Lt",
                            value: { Primitive: { U32: 50 } },
                        },
                    },
                ],
            },
        });
    });
});
