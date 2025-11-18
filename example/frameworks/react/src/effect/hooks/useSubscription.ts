import { useEffect, useRef } from "react";
import { Effect, Stream, Fiber, type ManagedRuntime } from "effect";

export function useStreamSubscription<A, E, R>(
    runtime: ManagedRuntime.ManagedRuntime<R, never>,
    streamEffect: Effect.Effect<Stream.Stream<A, E, never>, E, R>,
    onData: (data: A) => void,
    deps: React.DependencyList = []
) {
    const fiberRef = useRef<Fiber.RuntimeFiber<void, E> | null>(null);

    useEffect(() => {
        const program = Effect.gen(function* () {
            const stream = yield* streamEffect;

            yield* Stream.runForEach(stream, (data) =>
                Effect.sync(() => {
                    onData(data);
                })
            );
        });

        fiberRef.current = runtime.runFork(program);

        return () => {
            if (fiberRef.current) {
                Effect.runPromise(Fiber.interrupt(fiberRef.current)).catch(() => {});
            }
        };
    }, [runtime, ...deps]);
}

export function useEffectCallback<A, E, R>(
    runtime: ManagedRuntime.ManagedRuntime<R, never>,
    effect: Effect.Effect<A, E, R>
): () => Promise<A> {
    return () => runtime.runPromise(effect);
}
