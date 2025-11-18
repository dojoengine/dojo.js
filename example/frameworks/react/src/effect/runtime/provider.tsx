import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
import { ManagedRuntime, type Layer } from "effect";

type RuntimeContextValue<R> = ManagedRuntime.ManagedRuntime<R, never> | null;

const RuntimeContext = createContext<RuntimeContextValue<unknown>>(null);

export function createRuntimeProvider<R>() {
    function RuntimeProvider({
        layer,
        children,
    }: {
        layer: Layer.Layer<R, never, never>;
        children: ReactNode;
    }) {
        const runtimeRef = useRef<ManagedRuntime.ManagedRuntime<R, never> | null>(null);

        if (!runtimeRef.current) {
            runtimeRef.current = ManagedRuntime.make(layer);
        }

        useEffect(() => {
            return () => {
                runtimeRef.current?.dispose();
            };
        }, []);

        return (
            <RuntimeContext.Provider value={runtimeRef.current as RuntimeContextValue<unknown>}>
                {children}
            </RuntimeContext.Provider>
        );
    }

    function useRuntime(): ManagedRuntime.ManagedRuntime<R, never> {
        const runtime = useContext(RuntimeContext);
        if (!runtime) {
            throw new Error("useRuntime must be used within a RuntimeProvider");
        }
        return runtime as ManagedRuntime.ManagedRuntime<R, never>;
    }

    return { RuntimeProvider, useRuntime, RuntimeContext };
}
