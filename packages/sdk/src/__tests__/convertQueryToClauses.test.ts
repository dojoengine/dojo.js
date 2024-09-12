import { describe, it, expect } from "vitest";
import { QueryType } from "../types";
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
    // it("should convert a query with direct key-value pairs to clauses", () => {
    //     const query: QueryType<MockSchemaType> = {
    //         Player: {
    //             namespace: "PlayerNamespace",
    //             $: { where: { id: "1", name: "Alice" } },
    //         },
    //         Item: { namespace: "ItemNamespace", $: { where: { id: "2" } } },
    //     };
    //     const result = convertQueryToClauses(query);
    //     expect(result).toEqual([
    //         {
    //             Composite: {
    //                 operator: "And",
    //                 clauses: [
    //                     {
    //                         Member: {
    //                             model: "PlayerNamespace-Player",
    //                             member: "id",
    //                             operator: "Eq",
    //                             value: { Felt252: "1" },
    //                         },
    //                     },
    //                     {
    //                         Member: {
    //                             model: "PlayerNamespace-Player",
    //                             member: "name",
    //                             operator: "Eq",
    //                             value: { Felt252: "Alice" },
    //                         },
    //                     },
    //                 ],
    //             },
    //         },
    //         {
    //             Composite: {
    //                 operator: "And",
    //                 clauses: [
    //                     {
    //                         Member: {
    //                             model: "ItemNamespace-Item",
    //                             member: "id",
    //                             operator: "Eq",
    //                             value: { Felt252: "2" },
    //                         },
    //                     },
    //                 ],
    //             },
    //         },
    //     ]);
    // });
    // it("should handle empty conditions with VariableLen pattern matching", () => {
    //     const query: QueryType<MockSchemaType> = {
    //         Player: { namespace: "PlayerNamespace", $: {} },
    //         Item: { namespace: "ItemNamespace", $: {} },
    //     };
    //     const result = convertQueryToClauses(query);
    //     expect(result).toEqual([
    //         {
    //             Keys: {
    //                 keys: [],
    //                 pattern_matching: "VariableLen",
    //                 models: ["PlayerNamespace-Player"],
    //             },
    //         },
    //         {
    //             Keys: {
    //                 keys: [],
    //                 pattern_matching: "VariableLen",
    //                 models: ["ItemNamespace-Item"],
    //             },
    //         },
    //     ]);
    // });
    // it("should convert a query with entityIds to HashedKeys clause", () => {
    //     const query: QueryType<MockSchemaType> = {
    //         entityIds: ["hash1", "hash2"],
    //     };
    //     const result = convertQueryToClauses(query);
    //     expect(result).toEqual([{ HashedKeys: ["hash1", "hash2"] }]);
    // });
    // it("should ignore $ key and nested queries", () => {
    //     const query: QueryType<MockSchemaType> = {
    //         Player: {
    //             namespace: "PlayerNamespace",
    //             $: { where: { score: { $gt: 100 } } },
    //         },
    //         Item: { namespace: "ItemNamespace", $: {} },
    //     };
    //     const result = convertQueryToClauses(query);
    //     expect(result).toEqual([
    //         {
    //             Composite: {
    //                 operator: "And",
    //                 clauses: [
    //                     {
    //                         Member: {
    //                             model: "PlayerNamespace-Player",
    //                             member: "score",
    //                             operator: "Gt",
    //                             value: { I128: "100" },
    //                         },
    //                     },
    //                 ],
    //             },
    //         },
    //         {
    //             Keys: {
    //                 keys: [],
    //                 pattern_matching: "VariableLen",
    //                 models: ["ItemNamespace-Item"],
    //             },
    //         },
    //     ]);
    // });
    // it("should return an empty array for an empty query", () => {
    //     const query: QueryType<MockSchemaType> = {};
    //     const result = convertQueryToClauses(query);
    //     expect(result).toEqual([]);
    // });
});
