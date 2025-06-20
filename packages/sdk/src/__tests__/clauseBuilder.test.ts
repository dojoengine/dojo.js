import { describe, expect, it } from "vitest";
import {
    AndComposeClause,
    ClauseBuilder,
    HashedKeysClause,
    MemberClause,
    OrComposeClause,
} from "../internal/clauseBuilder";
import type {
    ComparisonOperator,
    PatternMatching,
} from "@dojoengine/torii-wasm";
import type { SchemaType } from "../internal/types";

// Test models interface
interface TestModels extends SchemaType {
    dojo_starter: {
        Moves: {
            fieldOrder: string[];
            remaining: number;
            player: string;
        };
        Position: {
            fieldOrder: string[];
            x: number;
            y: number;
        };
        GameState: {
            fieldOrder: string[];
            active: boolean;
            score: number;
            gameId: string;
        };
    };
}

describe("ClauseBuilder", () => {
    describe("whereKeys", () => {
        it("should create a Keys clause with default pattern matching", () => {
            const builder = new ClauseBuilder<TestModels>();
            const clause = builder
                .keys(["dojo_starter-Moves"], ["player1"])
                .build();

            expect(clause).toEqual({
                Keys: {
                    keys: ["player1"],
                    pattern_matching: "VariableLen" as PatternMatching,
                    models: ["dojo_starter-Moves"],
                },
            });
        });

        it("should create a Keys clause with custom pattern matching", () => {
            const builder = new ClauseBuilder<TestModels>();
            const clause = builder
                .keys(["dojo_starter-Moves"], ["player1"], "VariableLen")
                .build();

            expect(clause).toEqual({
                Keys: {
                    keys: ["player1"],
                    pattern_matching: "VariableLen" as PatternMatching,
                    models: ["dojo_starter-Moves"],
                },
            });
        });
    });

    describe("where", () => {
        it("should create a Member clause with number value", () => {
            const builder = new ClauseBuilder<TestModels>();
            const clause = builder
                .where("dojo_starter-Moves", "remaining", "Gt", 10)
                .build();

            expect(clause).toEqual({
                Member: {
                    model: "dojo_starter-Moves",
                    member: "remaining",
                    operator: "Gt" as ComparisonOperator,
                    value: { Primitive: { U32: 10 } },
                },
            });
        });

        it("should create a Member clause with string value", () => {
            const builder = new ClauseBuilder<TestModels>();
            const clause = builder
                .where("dojo_starter-Moves", "player", "Eq", "player1")
                .build();

            expect(clause).toEqual({
                Member: {
                    model: "dojo_starter-Moves",
                    member: "player",
                    operator: "Eq" as ComparisonOperator,
                    value: { String: "player1" },
                },
            });
        });
    });

    describe("compose", () => {
        it("should create a composite OR then AND clause", () => {
            const clause = new ClauseBuilder<TestModels>()
                .compose()
                .or([
                    new ClauseBuilder<TestModels>().where(
                        "dojo_starter-Position",
                        "x",
                        "Gt",
                        0
                    ),
                    new ClauseBuilder<TestModels>().where(
                        "dojo_starter-Position",
                        "y",
                        "Gt",
                        0
                    ),
                ])
                .and([
                    new ClauseBuilder<TestModels>().where(
                        "dojo_starter-GameState",
                        "active",
                        "Eq",
                        true
                    ),
                ])
                .build();

            expect(clause).toEqual({
                Composite: {
                    operator: "And",
                    clauses: [
                        {
                            Member: {
                                model: "dojo_starter-GameState",
                                member: "active",
                                operator: "Eq" as ComparisonOperator,
                                value: { Primitive: { Bool: true } },
                            },
                        },
                        {
                            Composite: {
                                operator: "Or",
                                clauses: [
                                    {
                                        Member: {
                                            model: "dojo_starter-Position",
                                            member: "x",
                                            operator:
                                                "Gt" as ComparisonOperator,
                                            value: { Primitive: { U32: 0 } },
                                        },
                                    },
                                    {
                                        Member: {
                                            model: "dojo_starter-Position",
                                            member: "y",
                                            operator:
                                                "Gt" as ComparisonOperator,
                                            value: { Primitive: { U32: 0 } },
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            });
        });

        it("should handle single composite operation", () => {
            const builder = new ClauseBuilder<TestModels>();
            const clauseA = new ClauseBuilder<TestModels>().where(
                "dojo_starter-Position",
                "x",
                "Gt",
                0
            );
            const clauseB = new ClauseBuilder<TestModels>().where(
                "dojo_starter-Position",
                "y",
                "Gt",
                0
            );

            const clause = builder.compose().or([clauseA, clauseB]).build();

            expect(clause).toEqual({
                Composite: {
                    operator: "Or",
                    clauses: [
                        {
                            Member: {
                                model: "dojo_starter-Position",
                                member: "x",
                                operator: "Gt" as ComparisonOperator,
                                value: { Primitive: { U32: 0 } },
                            },
                        },
                        {
                            Member: {
                                model: "dojo_starter-Position",
                                member: "y",
                                operator: "Gt" as ComparisonOperator,
                                value: { Primitive: { U32: 0 } },
                            },
                        },
                    ],
                },
            });
        });
    });

    it("should handle complex composition", () => {
        const clause = new ClauseBuilder()
            .compose()
            .and([
                new ClauseBuilder()
                    .compose()
                    .and([
                        new ClauseBuilder().where(
                            "world-player",
                            "score",
                            "Gt",
                            100
                        ),
                        new ClauseBuilder()
                            .compose()
                            .or([
                                new ClauseBuilder().where(
                                    "world-player",
                                    "name",
                                    "Eq",
                                    "Bob"
                                ),
                                new ClauseBuilder().where(
                                    "world-player",
                                    "name",
                                    "Eq",
                                    "Alice"
                                ),
                            ]),
                    ]),
                new ClauseBuilder().where("world-item", "durability", "Lt", 50),
            ])
            .build();

        expect(clause).toEqual({
            Composite: {
                operator: "And",
                clauses: [
                    {
                        Composite: {
                            operator: "And",
                            clauses: [
                                {
                                    Member: {
                                        model: "world-player",
                                        member: "score",
                                        operator: "Gt" as ComparisonOperator,
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
                                                    operator:
                                                        "Eq" as ComparisonOperator,
                                                    value: {
                                                        String: "Bob",
                                                    },
                                                },
                                            },

                                            {
                                                Member: {
                                                    model: "world-player",
                                                    member: "name",
                                                    operator:
                                                        "Eq" as ComparisonOperator,
                                                    value: {
                                                        String: "Alice",
                                                    },
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
                            operator: "Lt" as ComparisonOperator,
                            value: { Primitive: { U32: 50 } },
                        },
                    },
                ],
            },
        });
    });
    it("should be nice to use", () => {
        const clause = new ClauseBuilder()
            .compose()
            .and([
                new ClauseBuilder()
                    .compose()
                    .and([
                        new ClauseBuilder().where(
                            "world-player",
                            "score",
                            "Gt",
                            100
                        ),
                        new ClauseBuilder()
                            .compose()
                            .or([
                                new ClauseBuilder().where(
                                    "world-player",
                                    "name",
                                    "Eq",
                                    "Bob"
                                ),
                                new ClauseBuilder().where(
                                    "world-player",
                                    "name",
                                    "Eq",
                                    "Alice"
                                ),
                            ]),
                    ]),
                new ClauseBuilder().where("world-item", "durability", "Lt", 50),
            ])
            .build();

        const nicerClause = AndComposeClause([
            AndComposeClause([
                MemberClause("world-player", "score", "Gt", 100),
                OrComposeClause([
                    MemberClause("world-player", "name", "Eq", "Bob"),
                    MemberClause("world-player", "name", "Eq", "Alice"),
                ]),
            ]),
            MemberClause("world-item", "durability", "Lt", 50),
        ]).build();

        expect(clause).toEqual(nicerClause);
    });

    describe("hashed_keys", () => {
        it("should create a HashedKeys clause with valid number keys", () => {
            const builder = new ClauseBuilder<TestModels>();
            const clause = builder.hashed_keys([123, 456, 789]).build();

            expect(clause).toEqual({
                HashedKeys: ["0x7b", "0x1c8", "0x315"],
            });
        });

        it("should create a HashedKeys clause with valid string keys", () => {
            const builder = new ClauseBuilder<TestModels>();
            const clause = builder.hashed_keys(["123", "456", "789"]).build();

            expect(clause).toEqual({
                HashedKeys: ["0x7b", "0x1c8", "0x315"],
            });
        });

        it("should create a HashedKeys clause with mixed types", () => {
            const builder = new ClauseBuilder<TestModels>();
            const clause = builder
                .hashed_keys([123, "456", BigInt(789)])
                .build();

            expect(clause).toEqual({
                HashedKeys: ["0x7b", "0x1c8", "0x315"],
            });
        });

        it("should create a HashedKeys clause with hex string input", () => {
            const builder = new ClauseBuilder<TestModels>();
            const clause = builder
                .hashed_keys(["0x7b", "0x1c8", "0x315"])
                .build();

            expect(clause).toEqual({
                HashedKeys: ["0x7b", "0x1c8", "0x315"],
            });
        });

        it("should throw error for invalid key value", () => {
            const builder = new ClauseBuilder<TestModels>();

            expect(() => builder.hashed_keys(["invalid", 123]).build()).toThrow(
                "Invalid key value at index 0: invalid. Expected a valid BigNumberish value."
            );
        });

        it("should work with HashedKeysClause helper function", () => {
            const clause = HashedKeysClause<TestModels>([123, 456]).build();

            expect(clause).toEqual({
                HashedKeys: ["0x7b", "0x1c8"],
            });
        });
    });
});
