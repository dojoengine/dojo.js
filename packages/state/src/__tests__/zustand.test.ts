import { beforeEach, describe, expect, it, test, vi } from "vitest";

import { createTypedStore } from "../zustand";

describe("createTypedStore", () => {
    interface TestStore {
        count: number;
        name: string;
        set: <K extends keyof TestStore>(key: K, value: TestStore[K]) => void;
        get: <K extends keyof TestStore>(key: K) => TestStore[K];
    }

    let useStore: ReturnType<typeof createTypedStore<TestStore>>;
    let store: TestStore;

    beforeEach(() => {
        useStore = createTypedStore<TestStore>();
        useStore.setState({ count: 0, name: "Test" });
        store = useStore.getState();
    });

    test("should set and get values correctly", () => {
        store.set("count", 5);
        expect(store.get("count")).toBe(5);

        store.set("name", "Updated");
        expect(store.get("name")).toBe("Updated");
    });

    test("should update state without affecting other properties", () => {
        store.set("count", 10);
        expect(store.get("count")).toBe(10);
        expect(store.get("name")).toBe("Test");
    });

    test("should return the current state", () => {
        const state = useStore.getState();
        expect(state).toEqual(
            expect.objectContaining({ count: 0, name: "Test" })
        );
    });

    test("should update state using setState", () => {
        useStore.setState({ count: 20, name: "New Name" });
        store = useStore.getState();
        expect(store.get("count")).toBe(20);
        expect(store.get("name")).toBe("New Name");
    });

    test("should subscribe to state changes", () => {
        const listener = vi.fn();
        const unsubscribe = useStore.subscribe(listener);

        store.set("count", 15);
        expect(listener).toHaveBeenCalledTimes(1);

        store.set("name", "Another");
        expect(listener).toHaveBeenCalledTimes(2);

        unsubscribe();
        store.set("count", 25);
        expect(listener).toHaveBeenCalledTimes(2);
    });
});
