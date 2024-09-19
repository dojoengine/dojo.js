import { describe, it, expect } from "vitest";
import { convertQueryToEntityKeyClauses } from "../convertQueryToEntityKeyClauses";
import * as torii from "@dojoengine/torii-client";
import { QueryType } from "../types";
import { MockSchemaType, schema } from "../__example__/index";

describe("convertQueryToEntityKeyClauses", () => {
    it("should handle multiple models within a single namespace with ordered keys", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: {},
                },
                item: {
                    $: {
                        where: { durability: { $eq: 2 } },
                    },
                },
            },
        };

        const result = convertQueryToEntityKeyClauses(query, schema);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: Array(3).fill(undefined), // ['id', 'name', 'score']
                    pattern_matching: "VariableLen",
                    models: ["world-player"],
                },
            },
            {
                Keys: {
                    keys: [undefined, undefined, "2"], // ['id', 'type', 'durability']
                    pattern_matching: "VariableLen",
                    models: ["world-item"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });

    it("should handle queries with multiple where conditions", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: {
                        where: { name: { $eq: "Alice" }, score: { $gte: 10 } },
                    },
                },
                item: {
                    $: {
                        where: {
                            type: { $eq: "sword" },
                            durability: { $lt: 5 },
                        },
                    },
                },
            },
        };

        const result = convertQueryToEntityKeyClauses(query, schema);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: [undefined, "Alice", "10"], // ['id', 'name', 'score']
                    pattern_matching: "VariableLen",
                    models: ["world-player"],
                },
            },
            {
                Keys: {
                    keys: [undefined, "sword", "5"], // ['id', 'type', 'durability']
                    pattern_matching: "VariableLen",
                    models: ["world-item"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });

    it("should handle queries without where conditions", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: {},
                },
            },
        };

        const result = convertQueryToEntityKeyClauses(query, schema);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: Array(3).fill(undefined), // ['id', 'name', 'score']
                    pattern_matching: "VariableLen",
                    models: ["world-player"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });

    it("should handle queries with entityIds", () => {
        const query: QueryType<MockSchemaType> = {
            world: {
                player: {
                    $: {},
                },
            },
        };

        const result = convertQueryToEntityKeyClauses(query, schema);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: Array(3).fill(undefined), // ['id', 'name', 'score']
                    pattern_matching: "VariableLen",
                    models: ["world-player"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });
});
