import type { Draft, Patch } from "immer";
import type { StoreApi } from "zustand";
import { createStore } from "zustand/vanilla";
import type { ParsedEntity, SchemaType } from "@dojoengine/internal";
import { createDojoStoreFactory } from "./zustand";

interface PendingTransaction {
    transactionId: string;
    patches: Patch[];
    inversePatches: Patch[];
}

export interface GameState<T extends SchemaType> {
    entities: Record<string, ParsedEntity<T>>;
    historical_entities: Record<string, ParsedEntity<T>[]>;
    pendingTransactions: Record<string, PendingTransaction>;
    setEntities: (entities: ParsedEntity<T>[]) => void;
    mergeEntities: (entities: ParsedEntity<T>[]) => void;
    updateEntity: (entity: Partial<ParsedEntity<T>>) => void;
    setHistoricalEntities: (entities: ParsedEntity<T>[]) => void;
    mergeHistoricalEntities: (entities: ParsedEntity<T>[]) => void;
    updateHistoricalEntity: (entity: Partial<ParsedEntity<T>>) => void;
    applyOptimisticUpdate: (
        transactionId: string,
        updateFn: (draft: Draft<GameState<T>>) => void
    ) => void;
    revertOptimisticUpdate: (transactionId: string) => void;
    confirmTransaction: (transactionId: string) => void;
    subscribeToEntity: (
        entityId: string,
        listener: (entity: ParsedEntity<T> | undefined) => void
    ) => () => void;
    waitForEntityChange: (
        entityId: string,
        predicate: (entity: ParsedEntity<T> | undefined) => boolean,
        timeout?: number
    ) => Promise<ParsedEntity<T> | undefined>;
    getEntity: (entityId: string) => ParsedEntity<T> | undefined;
    getEntities: (
        filter?: (entity: ParsedEntity<T>) => boolean
    ) => ParsedEntity<T>[];
    getEntitiesByModel: (
        namespace: keyof T,
        model: keyof T[keyof T]
    ) => ParsedEntity<T>[];
    getHistoricalEntities: (entityId: string) => ParsedEntity<T>[];
    getEntityAtIndex: (
        entityId: string,
        index: number
    ) => ParsedEntity<T> | undefined;
    clearHistoricalEntities: (entityId?: string) => void;
    resetStore: () => void;
}

// Define the store type
export type DojoStore<T extends SchemaType> = StoreApi<GameState<T>>;

// Re-export the factory function
export { createDojoStoreFactory } from "./zustand";

/**
 * Factory function to create a Vanilla Zustand store based on a given SchemaType.
 *
 * @template T - The schema type.
 * @returns A Zustand hook tailored to the provided schema.
 */
export function createDojoStore<T extends SchemaType>() {
    return createDojoStoreFactory<T>(createStore);
}
