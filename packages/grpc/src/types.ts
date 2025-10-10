import type { Pagination as ToriiPagination } from "@dojoengine/torii-wasm";

export interface AggregationQueryInput {
    aggregatorIds?: string[];
    entityIds?: string[];
    pagination?: ToriiPagination;
}

export interface AggregationEntryView {
    id: string;
    aggregatorId: string;
    entityId: string;
    value: string;
    displayValue: string;
    position: number;
    modelId: string;
    createdAt: number;
    updatedAt: number;
}

export interface AggregationsPage {
    items: AggregationEntryView[];
    nextCursor?: string;
    next_cursor?: string;
}

export interface ActivityQueryInput {
    worldAddresses?: string[];
    namespaces?: string[];
    callerAddresses?: string[];
    fromTime?: number | string;
    toTime?: number | string;
    pagination?: ToriiPagination;
}

export interface ActivitySubscriptionQuery {
    worldAddresses?: string[];
    namespaces?: string[];
    callerAddresses?: string[];
}

export interface ActivityEntry {
    id: string;
    worldAddress: string;
    namespace: string;
    callerAddress: string;
    sessionStart: number;
    sessionEnd: number;
    actionCount: number;
    actions: Record<string, number>;
    updatedAt: number;
}

export interface ActivitiesPage {
    items: ActivityEntry[];
    nextCursor?: string;
    next_cursor?: string;
}

export type SqlIntegerValue = bigint | string;
export type SqlQueryScalar = string | number | SqlIntegerValue | null;

export type SqlQueryRow = Record<string, SqlQueryScalar>;
export type SqlQueryResponse = SqlQueryRow[];
