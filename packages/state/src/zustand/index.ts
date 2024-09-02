import { create } from "zustand";

export const createTypedStore = <T extends object>() => {
    return create<
        T & {
            set: <K extends keyof T>(key: K, value: T[K]) => void;
            get: <K extends keyof T>(key: K) => T[K];
        }
    >(
        (set, get) =>
            ({
                set: <K extends keyof T>(key: K, value: T[K]) =>
                    set((state) => ({ ...state, [key]: value }) as T),
                get: <K extends keyof T>(key: K) => get()[key],
            }) as T & { set: any; get: any }
    );
};
