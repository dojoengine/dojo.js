import { describe, expect, it } from "vitest";
import { ToriiQueryBuilder } from "../internal/toriiQueryBuilder";
import { Clause, OrderBy } from "@dojoengine/torii-wasm";
import { SchemaType } from "../internal/types";
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
            const builder = new ToriiQueryBuilder<TestModels>({ limit: 25 });
            const query = builder.build();

            expect(query).toEqual({
                limit: 25,
                offset: 0,
                clause: undefined,
                dont_include_hashed_keys: true,
                order_by: [],
                entity_models: [],
                entity_updated_after: 0,
            });
        });

        it("should create a query with default values", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.build();

            expect(query).toEqual({
                limit: 100,
                offset: 0,
                clause: undefined,
                dont_include_hashed_keys: true,
                order_by: [],
                entity_models: [],
                entity_updated_after: 0,
            });
        });

        it("should set limit and offset", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.withLimit(10).withOffset(20).build();

            expect(query.limit).toBe(10);
            expect(query.offset).toBe(20);
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

            expect(query.order_by).toEqual([
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

            expect(query.order_by).toEqual(orderBy);
        });
    });

    describe("entity models handling", () => {
        it("should add a single entity model", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.addEntityModel("dojo_starter").build();

            expect(query.entity_models).toEqual(["dojo_starter"]);
        });

        it("should set multiple entity models", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.withEntityModels(["dojo_starter"]).build();

            expect(query.entity_models).toEqual(["dojo_starter"]);
        });
    });

    describe("timestamp and hashed keys handling", () => {
        it("should set updated after timestamp", () => {
            const timestamp = Date.now();
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.updatedAfter(timestamp).build();

            expect(query.entity_updated_after).toBe(timestamp);
        });

        it("should handle hashed keys inclusion", () => {
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder.includeHashedKeys().build();

            expect(query.dont_include_hashed_keys).toBe(false);
        });
    });

    describe("static methods", () => {
        it("should create a paginated query", () => {
            const query = ToriiQueryBuilder.withPagination<TestModels>(
                2,
                25
            ).build();

            expect(query.limit).toBe(25);
            expect(query.offset).toBe(50);
        });
    });

    describe("chaining", () => {
        it("should support method chaining", () => {
            const timestamp = Date.now();
            const builder = new ToriiQueryBuilder<TestModels>();
            const query = builder
                .withLimit(10)
                .withOffset(20)
                .addEntityModel("dojo_starter-Position")
                .addOrderBy("dojo_starter-Position", "x", "Asc")
                .includeHashedKeys()
                .updatedAfter(timestamp)
                .build();

            expect(query).toEqual({
                limit: 10,
                offset: 20,
                clause: undefined,
                dont_include_hashed_keys: false,
                order_by: [
                    {
                        model: "dojo_starter-Position",
                        member: "x",
                        direction: "Asc",
                    },
                ],
                entity_models: ["dojo_starter-Position"],
                entity_updated_after: timestamp,
            });
        });
    });
});
