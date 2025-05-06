import type { PaginationDirection } from "@dojoengine/torii-wasm/types";
import type { SchemaType, ToriiQueryBuilder } from "./types.ts";

/**
 * A generic pagination class that handles cursor-based pagination for query results.
 * This class manages the state of paginated items and provides methods to navigate through pages.
 *
 * @template T - The schema type that extends SchemaType
 * @template Inner - The type of items being paginated (must be an array type)
 */
export class Pagination<T extends SchemaType, Inner extends any[]> {
    private items: Inner;

    /**
     * Creates a new Pagination instance
     *
     * @param limit - The maximum number of items to return per page
     * @param cursor - Optional cursor string for pagination
     * @param direction - Optional direction of pagination (defaults to "Forward")
     */
    constructor(
        public limit: number,
        public cursor?: string,
        public direction?: string
    ) {
        this.items = [] as unknown as Inner;
        if (!direction) {
            this.direction = "Forward";
        }
    }

    /**
     * Creates a Pagination instance from a ToriiQueryBuilder
     *
     * @param query - The query builder to extract pagination parameters from
     * @returns A new Pagination instance configured with the query's pagination settings
     */
    static fromQuery<T extends SchemaType, Inner extends any[]>(
        query: ToriiQueryBuilder<T>
    ): Pagination<T, Inner> {
        const pagination = query.getPagination();
        return new Pagination(
            pagination.limit,
            pagination.cursor,
            pagination.direction
        );
    }

    /**
     * Sets the items for the current page
     *
     * @param items - The items to set for the current page
     * @returns The Pagination instance for method chaining
     */
    withItems(items: Inner) {
        this.items = items;
        return this;
    }

    /**
     * Gets the current page's items
     *
     * @returns The array of items for the current page
     */
    getItems(): Inner {
        return this.items;
    }

    /**
     * Gets a query builder configured for the next page
     *
     * @param query - The base query builder to configure
     * @returns A new query builder configured for the next page
     */
    getNextQuery(query: ToriiQueryBuilder<T>): ToriiQueryBuilder<T> {
        const q = query.withLimit(this.limit);
        if (this.cursor) {
            q.withCursor(this.cursor);
        }
        if (q.getPagination().direction !== this.direction) {
            q.withDirection(this.direction as PaginationDirection);
        }
        return q;
    }

    /**
     * Gets a query builder configured for the previous page
     *
     * @param query - The base query builder to configure
     * @returns A new query builder configured for the previous page
     */
    getPreviousQuery(query: ToriiQueryBuilder<T>): ToriiQueryBuilder<T> {
        const q = query.withLimit(this.limit);
        if (this.cursor) {
            q.withCursor(this.cursor);
        }
        if (q.getPagination().direction === this.direction) {
            q.withDirection(getReversedDirection(this.direction));
        }

        return q;
    }
}

/**
 * Returns the opposite pagination direction.
 *
 * This utility function takes a pagination direction and returns its opposite:
 * - "Forward" becomes "Backward"
 * - "Backward" becomes "Forward"
 * - Any other value defaults to "Forward" (though this should not occur with proper typing)
 *
 * @param direction - The current pagination direction
 * @returns The reversed pagination direction
 */
function getReversedDirection(
    direction: PaginationDirection
): PaginationDirection {
    if (direction === "Forward") return "Backward";
    if (direction === "Backward") return "Forward";
    // we should not go down here.
    return "Forward";
}
