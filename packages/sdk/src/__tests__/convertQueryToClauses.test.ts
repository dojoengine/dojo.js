import { describe, it, expect } from "vitest";
import { QueryType } from "..";
import { convertQueryToClauses } from "../convertQueryToClauses";

// Define a mock SchemaType for testing purposes
interface MockSchemaType {
    Player: {
        id: string;
        name: string;
        score: number;
    };
    Item: {
        id: string;
        owner: string;
    };
}

describe("convertQueryToClauses", () => {
    it("should convert a query with direct key-value pairs to clauses", () => {
        const query: QueryType<MockSchemaType> = {
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
        const query: QueryType<MockSchemaType> = {
            Player: { $: {} },
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

    it("should convert a query with entityIds to HashedKeys clause", () => {
        const query: QueryType<MockSchemaType> = {
            entityIds: ["hash1", "hash2"],
        };

        const result = convertQueryToClauses(query);

        expect(result).toEqual([{ HashedKeys: ["hash1", "hash2"] }]);
    });

    it("should ignore $ key and nested queries", () => {
        const query: QueryType<MockSchemaType> = {
            Player: { $: { where: { score: { $gt: 100 } } }, id: "1" },
            Item: { $: {} },
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
            {
                Keys: {
                    keys: [],
                    pattern_matching: "VariableLen",
                    models: ["Item"],
                },
            },
        ]);
    });

    it("should return an empty array for an empty query", () => {
        const query: QueryType<MockSchemaType> = {};

        const result = convertQueryToClauses(query);

        expect(result).toEqual([]);
    });
});
