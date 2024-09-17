import { describe, it, expect } from "vitest";
import { convertQueryToEntityKeyClauses } from "../convertQueryToEntityKeyClauses";
import * as torii from "@dojoengine/torii-client";
import { SchemaType, SubscriptionQueryType } from "../types";

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

describe("convertQueryToEntityKeyClauses", () => {
    it("should return an empty array when query is undefined", () => {
        const query: SubscriptionQueryType<MockSchemaType> | undefined =
            undefined;
        const result = convertQueryToEntityKeyClauses(query);
        expect(result).toEqual([]);
    });

    it("should return an empty array when query is empty", () => {
        const query: SubscriptionQueryType<MockSchemaType> = {};
        const result = convertQueryToEntityKeyClauses(query);
        expect(result).toEqual([]);
    });

    it("should convert query with entityIds to HashedKeys clause", () => {
        const query: SubscriptionQueryType<MockSchemaType> = {
            entityIds: ["hash1", "hash2"],
        } as unknown as SubscriptionQueryType<MockSchemaType>;
        const result = convertQueryToEntityKeyClauses(query);
        const expected: torii.EntityKeysClause[] = [
            { HashedKeys: ["hash1", "hash2"] },
        ];
        expect(result).toEqual(expected);
    });

    it("should convert query with namespace and model set to true to VariableLen Keys clause", () => {
        const query: SubscriptionQueryType<MockSchemaType> = {
            world: {
                player: true,
            },
        };
        const result = convertQueryToEntityKeyClauses(query);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: [undefined],
                    pattern_matching: "VariableLen",
                    models: ["world-player"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });

    it("should convert query with namespace and model keys array to FixedLen Keys clause", () => {
        const query: SubscriptionQueryType<MockSchemaType> = {
            world: {
                item: ["key1", "key2"],
            },
        };
        const result = convertQueryToEntityKeyClauses(query);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: ["key1", "key2"],
                    pattern_matching: "FixedLen",
                    models: ["world-item"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });

    it("should handle multiple namespaces and models", () => {
        const query: SubscriptionQueryType<MockSchemaType> = {
            world: {
                player: true,
                item: ["keyA", "keyB"],
            },
            entityIds: ["hash1"],
        } as unknown as SubscriptionQueryType<MockSchemaType>;
        const result = convertQueryToEntityKeyClauses(query);
        const expected: torii.EntityKeysClause[] = [
            { HashedKeys: ["hash1"] },
            {
                Keys: {
                    keys: [undefined],
                    pattern_matching: "VariableLen",
                    models: ["world-player"],
                },
            },
            {
                Keys: {
                    keys: ["keyA", "keyB"],
                    pattern_matching: "FixedLen",
                    models: ["world-item"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });

    it("should ignore non-object entries except entityIds", () => {
        const query = {
            world: {
                player: "invalid",
                item: ["key1"],
            },
            entityIds: ["hash1"],
        } as unknown as SubscriptionQueryType<MockSchemaType>;
        const result = convertQueryToEntityKeyClauses(query);
        const expected: torii.EntityKeysClause[] = [
            { HashedKeys: ["hash1"] },
            {
                Keys: {
                    keys: ["key1"],
                    pattern_matching: "FixedLen",
                    models: ["world-item"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });

    it("should handle empty entityIds gracefully", () => {
        const query: SubscriptionQueryType<MockSchemaType> = {
            entityIds: [],
            world: {
                player: true,
            },
        } as unknown as SubscriptionQueryType<MockSchemaType>;
        const result = convertQueryToEntityKeyClauses(query);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: [undefined],
                    pattern_matching: "VariableLen",
                    models: ["world-player"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });

    it("should handle multiple models within a single namespace", () => {
        const query: SubscriptionQueryType<MockSchemaType> = {
            world: {
                player: true,
                item: ["keyX", "keyY"],
            },
        };
        const result = convertQueryToEntityKeyClauses(query);
        const expected: torii.EntityKeysClause[] = [
            {
                Keys: {
                    keys: [undefined],
                    pattern_matching: "VariableLen",
                    models: ["world-player"],
                },
            },
            {
                Keys: {
                    keys: ["keyX", "keyY"],
                    pattern_matching: "FixedLen",
                    models: ["world-item"],
                },
            },
        ];
        expect(result).toEqual(expected);
    });
});
