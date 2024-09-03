import { describe, it, expect } from "vitest";
import { parseEntities } from "../getEntities";
import { SchemaType } from "../types";
import * as torii from "@dojoengine/torii-client";

// Mock SchemaType for testing
interface TestSchema extends SchemaType {
    player: {
        id: string;
        name: string;
        score: number;
    };
    item: {
        id: string;
        name: string;
        rarity: string;
    };
}

describe("parseEntities", () => {
    it("should parse entities correctly", () => {
        const mockEntities: torii.Entities = {
            player: {
                "0x1": {
                    id: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "0x1",
                        key: true,
                    },
                    name: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "Alice",
                        key: false,
                    },
                    score: {
                        type: "primitive",
                        type_name: "u32",
                        value: 100,
                        key: false,
                    },
                },
                "0x2": {
                    id: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "0x2",
                        key: true,
                    },
                    name: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "Bob",
                        key: false,
                    },
                    score: {
                        type: "primitive",
                        type_name: "u32",
                        value: 200,
                        key: false,
                    },
                },
            },
            item: {
                "0x3": {
                    id: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "0x3",
                        key: true,
                    },
                    name: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "Sword",
                        key: false,
                    },
                    rarity: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "Rare",
                        key: false,
                    },
                },
            },
        };

        const query: { [P in keyof TestSchema]?: Partial<TestSchema[P]> } = {
            player: {},
            item: {},
        };

        const result = parseEntities<TestSchema, keyof TestSchema>(
            mockEntities,
            query
        );

        expect(result).toEqual({
            player: [
                { id: "0x1", name: "Alice", score: 100 },
                { id: "0x2", name: "Bob", score: 200 },
            ],
            item: [{ id: "0x3", name: "Sword", rarity: "Rare" }],
        });
    });

    it("should handle empty entities", () => {
        const mockEntities: torii.Entities = {};
        const query: { [P in keyof TestSchema]?: Partial<TestSchema[P]> } = {
            player: {},
            item: {},
        };

        const result = parseEntities<TestSchema, keyof TestSchema>(
            mockEntities,
            query
        );

        expect(result).toEqual({
            player: [],
            item: [],
        });
    });

    it("should handle partial queries", () => {
        const mockEntities: torii.Entities = {
            player: {
                "0x1": {
                    id: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "0x1",
                        key: true,
                    },
                    name: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "Alice",
                        key: false,
                    },
                    score: {
                        type: "primitive",
                        type_name: "u32",
                        value: 100,
                        key: false,
                    },
                },
            },
        };

        const query: { [P in keyof TestSchema]?: Partial<TestSchema[P]> } = {
            player: {},
        };

        const result = parseEntities<TestSchema, keyof TestSchema>(
            mockEntities,
            query
        );

        expect(result).toEqual({
            player: [{ id: "0x1", name: "Alice", score: 100 }],
        });
    });

    it("should handle entities with missing fields", () => {
        const mockEntities: torii.Entities = {
            player: {
                "0x1": {
                    id: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "0x1",
                        key: true,
                    },
                    name: {
                        type: "primitive",
                        type_name: "felt252",
                        value: "Alice",
                        key: false,
                    },
                    // score is missing
                },
            },
        };

        const query: { [P in keyof TestSchema]?: Partial<TestSchema[P]> } = {
            player: {},
        };

        const result = parseEntities<TestSchema, keyof TestSchema>(
            mockEntities,
            query
        );

        expect(result).toEqual({
            player: [{ id: "0x1", name: "Alice" }],
        });
    });
});
