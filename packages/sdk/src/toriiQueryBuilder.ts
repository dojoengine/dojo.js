import { Clause, OrderBy, Query } from "@dojoengine/torii-client";
import { SchemaType } from "./types";

const defaultToriiOptions = {
    limit: 100, // default limit
    offset: 0,
    clause: undefined,
    dont_include_hashed_keys: true,
    order_by: [],
    entity_models: [],
    entity_updated_after: 0,
};

type ToriiQueryBuilderOptions = Omit<Partial<Query>, "clause">;

export class ToriiQueryBuilder<T extends SchemaType> {
    private query: Query;

    constructor(options?: ToriiQueryBuilderOptions) {
        this.query = { ...defaultToriiOptions, ...options };
    }

    /**
     * Set the maximum number of results to return
     */
    withLimit(limit: number): ToriiQueryBuilder<T> {
        this.query.limit = limit;
        return this;
    }

    /**
     * Set the offset for pagination
     */
    withOffset(offset: number): ToriiQueryBuilder<T> {
        this.query.offset = offset;
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
        this.query.dont_include_hashed_keys = false;
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
        this.query.order_by.push({
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
        this.query.order_by = orderBy;
        return this;
    }

    /**
     * Add a single entity model to filter
     */
    addEntityModel(model: keyof T & string): ToriiQueryBuilder<T> {
        this.query.entity_models.push(model);
        return this;
    }

    /**
     * Set multiple entity models at once
     */
    withEntityModels(models: (keyof T & string)[]): ToriiQueryBuilder<T> {
        this.query.entity_models = models;
        return this;
    }

    /**
     * Set the minimum timestamp for entity updates
     */
    updatedAfter(timestamp: number): ToriiQueryBuilder<T> {
        this.query.entity_updated_after = timestamp;
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
     */
    static withPagination<T extends Record<string, Record<string, any>>>(
        page: number,
        pageSize: number
    ): ToriiQueryBuilder<T> {
        return new ToriiQueryBuilder<T>()
            .withLimit(pageSize)
            .withOffset(page * pageSize);
    }
}
