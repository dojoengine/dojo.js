import type { Pagination } from "@dojoengine/torii-wasm";
import type {
    Clause,
    OrderBy,
    PaginationDirection,
    Query,
} from "@dojoengine/torii-wasm/types";
import { type Result, err, ok } from "neverthrow";
import { UNDEFINED_CLAUSE } from "./errors.ts";
import type { SchemaType } from "./types.ts";

const defaultToriiOptions = () => ({
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

type ToriiQueryBuilderOptions = Omit<Partial<Query>, "clause">;

export class ToriiQueryBuilder<T extends SchemaType> {
    private query: Query;

    constructor(options?: ToriiQueryBuilderOptions) {
        this.query = { ...(defaultToriiOptions() as Query), ...options };
    }

    /**
     * Set the maximum number of results to return
     */
    withLimit(limit: number): ToriiQueryBuilder<T> {
        this.query.pagination.limit = limit;
        return this;
    }

    /**
     * Set the offset for pagination
     * @deprecated Use `withCursor` instead
     */
    withOffset(): ToriiQueryBuilder<T> {
        return this;
    }

    /**
     * Set the cursor for pagination
     * undefined is default, fetch from starting point
     * `next_cursor` is return from queries
     */
    withCursor(cursor: string): ToriiQueryBuilder<T> {
        this.query.pagination.cursor = cursor;
        return this;
    }

    /**
     * Set the maximum number of results to return
     */
    withDirection(direction: PaginationDirection): ToriiQueryBuilder<T> {
        this.query.pagination.direction = direction;
        return this;
    }

    /**
     * Add the clause to filter results
     */
    withClause(clause: Clause): ToriiQueryBuilder<T> {
        this.query.clause = clause;
        return this;
    }

    /**
     * Set whether to include hashed keys in the response
     * HashedKeys represent internal torii entity id.
     */
    includeHashedKeys(): ToriiQueryBuilder<T> {
        this.query.no_hashed_keys = false;
        return this;
    }

    /**
     * Add a single order by clause
     */
    addOrderBy(
        model: keyof T & string,
        member: string,
        direction: "Asc" | "Desc"
    ): ToriiQueryBuilder<T> {
        this.query.pagination.order_by.push({
            model,
            member,
            direction,
        });
        return this;
    }

    /**
     * Add multiple order by clauses at once
     */
    withOrderBy(orderBy: OrderBy[]): ToriiQueryBuilder<T> {
        this.query.pagination.order_by = orderBy;
        return this;
    }

    /**
     * Add a single entity model to filter
     */
    addEntityModel(model: keyof T & string): ToriiQueryBuilder<T> {
        this.query.models.push(model);
        return this;
    }

    /**
     * Set multiple entity models at once
     */
    withEntityModels(models: (keyof T & string)[]): ToriiQueryBuilder<T> {
        this.query.models = models;
        return this;
    }

    /**
     * Build the final query
     */
    build(): Query {
        return this.query;
    }

    /**
     * Create a new builder instance with pagination settings
     *
     */
    static withPagination<T extends Record<string, Record<string, any>>>(
        cursor: string,
        limit: number,
        direction: PaginationDirection
    ): ToriiQueryBuilder<T> {
        return new ToriiQueryBuilder<T>()
            .withLimit(limit)
            .withCursor(cursor)
            .withDirection(direction);
    }

    /**
     * Returns inner clause inside a Result wrapper.
     */
    getClause(): Result<Clause, string> {
        if (!this.query.clause) {
            return err(UNDEFINED_CLAUSE);
        }
        return ok(this.query.clause);
    }

    getPagination(): Pagination {
        return this.query.pagination;
    }
}

export type HistoricalToriiQueryBuilderOptions = Omit<
    Partial<ToriiQueryBuilderOptions>,
    "historical"
>;
export class HistoricalToriiQueryBuilder<
    T extends SchemaType
> extends ToriiQueryBuilder<T> {
    constructor(options?: ToriiQueryBuilderOptions) {
        super({
            ...(defaultToriiOptions() as Query),
            ...options,
            historical: true,
        });
    }
}
