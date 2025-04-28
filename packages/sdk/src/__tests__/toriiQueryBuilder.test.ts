import { describe, expect, it } from "vitest";
import { ToriiQueryBuilder } from "../internal/toriiQueryBuilder";
import type { Clause, OrderBy } from "@dojoengine/torii-wasm";
import type { SchemaType } from "../internal/types";
import { ClauseBuilder } from "../web/clauseBuilder";

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
    };
}

describe("ToriiQueryBuilder", () => {
    describe("basic query building", () => {
        it("override default options", () => {
            const builder = new ToriiQueryBuilder<TestModels>({
                pagination: { limit: 25 },
            });
            const query = builder.build();

            expect(query).toEqual({
                pagination: { limit: 25 },
                clause: undefined,
                no_hashed_keys: true,
                models: [],
                historical: false,
            });
        });

        it("should create a query with default values", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.build();

            expect(query).toEqual({
                pagination: {
                    limit: 100,
                    cursor: undefined,
                    direction: "Forward",
                    order_by: [],
                },
                clause: undefined,
                no_hashed_keys: true,
                models: [],
                historical: false,
            });
        });

        it("should set limit and offset", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.withLimit(10).withCursor("cursor").build();

            expect(query.pagination.limit).toBe(10);
            expect(query.pagination.cursor).toBe("cursor");
        });

        it("should set clause", () => {
            const mockClause: Clause = {
                Member: {
                    model: "dojo_starter-Position",
                    member: "x",
                    operator: "Gt",
                    value: { Primitive: { U32: 10 } },
                },
            };
            const clause = new ClauseBuilder<TestModels>().where(
                "dojo_starter-Position",
                "x",
                "Gt",
                10
            );

            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.withClause(clause.build()).build();

            expect(query.clause).toEqual(mockClause);
        });
    });

    describe("order by handling", () => {
        it("should add a single order by", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder
                .addOrderBy("dojo_starter", "x", "Asc")
                .build();

            expect(query.pagination.order_by).toEqual([
                { model: "dojo_starter", member: "x", direction: "Asc" },
            ]);
        });

        it("should set multiple order by clauses", () => {
            const orderBy: OrderBy[] = [
                { model: "dojo_starter", member: "x", direction: "Asc" },
                { model: "dojo_starter", member: "y", direction: "Desc" },
            ];

            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.withOrderBy(orderBy).build();

            expect(query.pagination.order_by).toEqual(orderBy);
        });
    });

    describe("entity models handling", () => {
        it("should add a single entity model", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.addEntityModel("dojo_starter").build();

            expect(query.models).toEqual(["dojo_starter"]);
        });

        it("should set multiple entity models", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.withEntityModels(["dojo_starter"]).build();

            expect(query.models).toEqual(["dojo_starter"]);
        });
    });

    describe("hashed keys handling", () => {
        it("should handle hashed keys inclusion", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.includeHashedKeys().build();

            expect(query.no_hashed_keys).toBe(false);
        });
    });

    describe("static methods", () => {
        it("should create a paginated query", () => {
            const query = ToriiQueryBuilder.withPagination<TestModels>(
                "cursor",
                25,
                "Forward"
            ).build();

            expect(query.pagination.limit).toBe(25);
            expect(query.pagination.cursor).toBe("cursor");
        });
    });

    describe("chaining", () => {
        it("should support method chaining", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder
                .withLimit(10)
                .withCursor("cursor")
                .addEntityModel("dojo_starter-Position")
                .addOrderBy("dojo_starter-Position", "x", "Asc")
                .includeHashedKeys()
                .build();

            expect(query).toEqual({
                pagination: {
                    limit: 10,
                    cursor: "cursor",
                    direction: "Forward",
                    order_by: [
                        {
                            model: "dojo_starter-Position",
                            member: "x",
                            direction: "Asc",
                        },
                    ],
                },
                clause: undefined,
                no_hashed_keys: false,
                models: ["dojo_starter-Position"],
                historical: false,
            });
        });
    });
});
