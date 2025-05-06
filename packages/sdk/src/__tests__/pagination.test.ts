import { describe, it, expect } from "vitest";
import { Pagination } from "../internal/pagination";
import { ToriiQueryBuilder } from "../internal/toriiQueryBuilder";
import type { schema } from "./models.gen";
import { CairoOption, CairoOptionVariant, CairoCustomEnum } from "starknet";

describe("Pagination", () => {
    it("should create a Pagination instance with default direction", () => {
        const pagination = new Pagination<typeof schema, (typeof schema)[]>(10);
        expect(pagination.limit).toBe(10);
        expect(pagination.direction).toBe("Forward");
        expect(pagination.getItems()).toHaveLength(0);
    });

    it("should create a Pagination instance with custom direction", () => {
        const pagination = new Pagination<typeof schema, (typeof schema)[]>(
            10,
            "cursor123",
            "Backward"
        );
        expect(pagination.limit).toBe(10);
        expect(pagination.cursor).toBe("cursor123");
        expect(pagination.direction).toBe("Backward");
    });

    it("should create a Pagination instance from a query builder", () => {
        const query = new ToriiQueryBuilder<typeof schema>()
            .withLimit(20)
            .withCursor("test-cursor");

        const pagination = Pagination.fromQuery<
            typeof schema,
            (typeof schema)[]
        >(query);
        expect(pagination.limit).toBe(20);
        expect(pagination.cursor).toBe("test-cursor");
    });

    it("should set items and return the instance", () => {
        const pagination = new Pagination<typeof schema, (typeof schema)[]>(10);
        const items: (typeof schema)[] = [
            {
                onchain_dash: {
                    CallerCounter: {
                        caller: "test1",
                        counter: 1,
                        timestamp: new CairoOption(
                            CairoOptionVariant.Some,
                            123
                        ),
                    },
                    CallerCounterValue: {
                        counter: 0,
                        timestamp: new CairoOption(CairoOptionVariant.None),
                    },
                    CustomTheme: {
                        classname: 0,
                    },
                    GlobalCounter: {
                        global_counter_key: 0,
                        counter: 0,
                    },
                    GlobalCounterValue: {
                        counter: 0,
                    },
                    Message: {
                        identity: "",
                        content: "",
                        timestamp: 0,
                    },
                    MessageValue: {
                        content: "",
                    },
                    Theme: {
                        theme_key: 0,
                        value: new CairoCustomEnum({
                            Predefined: 0,
                            Custom: undefined,
                        }),
                        caller: "",
                        timestamp: 0,
                    },
                    ThemeValue: {
                        value: new CairoCustomEnum({
                            Predefined: 0,
                            Custom: undefined,
                        }),
                        caller: "",
                        timestamp: 0,
                    },
                },
            },
            {
                onchain_dash: {
                    CallerCounter: {
                        caller: "test2",
                        counter: 2,
                        timestamp: new CairoOption(
                            CairoOptionVariant.Some,
                            456
                        ),
                    },
                    CallerCounterValue: {
                        counter: 0,
                        timestamp: new CairoOption(CairoOptionVariant.None),
                    },
                    CustomTheme: {
                        classname: 0,
                    },
                    GlobalCounter: {
                        global_counter_key: 0,
                        counter: 0,
                    },
                    GlobalCounterValue: {
                        counter: 0,
                    },
                    Message: {
                        identity: "",
                        content: "",
                        timestamp: 0,
                    },
                    MessageValue: {
                        content: "",
                    },
                    Theme: {
                        theme_key: 0,
                        value: new CairoCustomEnum({
                            Predefined: 0,
                            Custom: undefined,
                        }),
                        caller: "",
                        timestamp: 0,
                    },
                    ThemeValue: {
                        value: new CairoCustomEnum({
                            Predefined: 0,
                            Custom: undefined,
                        }),
                        caller: "",
                        timestamp: 0,
                    },
                },
            },
        ];

        const result = pagination.withItems(items);
        expect(result).toBe(pagination);
        expect(pagination.getItems()).toHaveLength(2);
        expect(pagination.getItems()[0].onchain_dash.CallerCounter.caller).toBe(
            "test1"
        );
    });

    it("should return a query with the same limit and cursor", () => {
        const pagination = new Pagination<typeof schema, (typeof schema)[]>(
            10,
            "cursor123"
        );
        const query = new ToriiQueryBuilder<typeof schema>();

        const nextQuery = pagination.getNextQuery(query);
        const paginationParams = nextQuery.getPagination();

        expect(paginationParams.limit).toBe(10);
        expect(paginationParams.cursor).toBe("cursor123");
    });

    it("should work without a cursor", () => {
        const pagination = new Pagination<typeof schema, (typeof schema)[]>(10);
        const query = new ToriiQueryBuilder<typeof schema>();

        const nextQuery = pagination.getNextQuery(query);
        const paginationParams = nextQuery.getPagination();

        expect(paginationParams.limit).toBe(10);
        expect(paginationParams.cursor).toBeUndefined();
    });

    it("should return a query with the same limit and cursor for previous query", () => {
        const pagination = new Pagination<typeof schema, (typeof schema)[]>(
            10,
            "cursor123",
            "Forward"
        );
        const query = new ToriiQueryBuilder<typeof schema>();

        const prevQuery = pagination.getPreviousQuery(query);
        const paginationParams = prevQuery.getPagination();

        expect(paginationParams.limit).toBe(10);
        expect(paginationParams.cursor).toBe("cursor123");
        expect(paginationParams.direction).toBe("Backward");
    });
    it("should keep same direction", () => {
        const pagination = new Pagination<typeof schema, (typeof schema)[]>(
            10,
            "cursor123",
            "Forward"
        );
        const query = new ToriiQueryBuilder<typeof schema>();

        const prevQuery = pagination.getNextQuery(query);
        const paginationParams = prevQuery.getPagination();

        expect(paginationParams.limit).toBe(10);
        expect(paginationParams.cursor).toBe("cursor123");
        expect(paginationParams.direction).toBe("Forward");
    });
    it("should invert direction", () => {
        const pagination = new Pagination<typeof schema, (typeof schema)[]>(
            10,
            "cursor123",
            "Backward"
        );
        const query = new ToriiQueryBuilder<typeof schema>();

        const prevQuery = pagination.getPreviousQuery(query);
        const paginationParams = prevQuery.getPagination();

        expect(paginationParams.limit).toBe(10);
        expect(paginationParams.cursor).toBe("cursor123");
        expect(paginationParams.direction).toBe("Forward");
    });

    it("should work without a cursor for previous query", () => {
        const pagination = new Pagination<typeof schema, (typeof schema)[]>(10);
        const query = new ToriiQueryBuilder<typeof schema>();

        const prevQuery = pagination.getPreviousQuery(query);
        const paginationParams = prevQuery.getPagination();

        expect(paginationParams.limit).toBe(10);
        expect(paginationParams.cursor).toBeUndefined();
    });
});
