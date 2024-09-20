import * as torii from "@dojoengine/torii-client";
import { describe, expect, it } from "vitest";

import { MockSchemaType, schema } from "../__example__/index";
import { convertQueryToEntityKeyClauses } from "../convertQueryToEntityKeyClauses";
import { SubscriptionQueryType } from "../types";

describe("convertQueryToEntityKeyClauses", () => {
    it("should handle multiple models within a single namespace with ordered keys", () => {
        const query: SubscriptionQueryType<MockSchemaType> = {
            world: {
                player: {
                    $: {},
                },
                item: {
                    $: {
                        where: { durability: { $is: 2 } },
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
        const query: SubscriptionQueryType<MockSchemaType> = {
            world: {
                player: {
                    $: {
                        where: { name: { $is: "Alice" }, score: { $is: 10 } },
                    },
                },
                item: {
                    $: {
                        where: {
                            type: { $is: "sword" },
                            durability: { $is: 5 },
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
        const query: SubscriptionQueryType<MockSchemaType> = {
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
        const query: SubscriptionQueryType<MockSchemaType> = {
            world: {
                item: {
                    $: {
                        where: {
                            type: { $is: "sword" },
                        },
                    },
                },
            },
        };

        const result = convertQueryToEntityKeyClauses(query, schema);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: [undefined, "sword", undefined], // ['id', 'type']
                    pattern_matching: "VariableLen",
                    models: ["world-item"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });

    it("should handle queries with multiple namespaces", () => {
        const query: SubscriptionQueryType<MockSchemaType> = {
            world: {
                player: {
                    $: {
                        where: { name: { $is: "Bob" }, score: { $is: 20 } },
                    },
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

        const result = convertQueryToEntityKeyClauses(query, schema);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: [undefined, "Bob", "20"], // ['id', 'name', 'score']
                    pattern_matching: "VariableLen",
                    models: ["world-player"],
                },
            },
            {
                Keys: {
                    keys: [undefined, "Milky Way"], // ['id', 'name']
                    pattern_matching: "VariableLen",
                    models: ["universe-galaxy"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });

    it("should handle queries with mixed conditions and entityIds", () => {
        const query: SubscriptionQueryType<MockSchemaType> = {
            world: {
                player: {
                    $: {
                        where: { name: { $is: "Charlie" } },
                    },
                },
                item: {
                    $: {
                        where: { durability: { $is: 10 } },
                    },
                },
            },
            universe: {
                galaxy: {
                    $: {
                        where: { name: { $is: "Andromeda" } },
                    },
                },
            },
        };

        const result = convertQueryToEntityKeyClauses(query, schema);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: [undefined, "Charlie", undefined], // ['id', 'name', 'score']
                    pattern_matching: "VariableLen",
                    models: ["world-player"],
                },
            },
            {
                Keys: {
                    keys: [undefined, undefined, "10"], // ['id', 'type', 'durability']
                    pattern_matching: "VariableLen",
                    models: ["world-item"],
                },
            },
            {
                Keys: {
                    keys: [undefined, "Andromeda"], // ['id', 'name']
                    pattern_matching: "VariableLen",
                    models: ["universe-galaxy"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });
});
