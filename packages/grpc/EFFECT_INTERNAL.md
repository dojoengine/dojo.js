# Effect.ts Internal Architecture

This document describes the internal architecture of the Effect.ts-based Torii gRPC client implementation.

## Overview

The implementation consists of three layers:

1. **Error Types** (`src/services/errors.ts`) - Tagged error classes for type-safe error handling
2. **World Client Effect** (`src/services/world-client-effect.ts`) - Effect wrapper around gRPC client
3. **Functional Client** (`src/torii-client-functional.ts`) - Promise-based API using Effect internally

## Error Types

All errors extend `Data.TaggedError` for pattern matching:

```typescript
import { Data } from "effect";

export class ToriiGrpcError extends Data.TaggedError("ToriiGrpcError")<{
    readonly message: string;
    readonly code?: string;
    readonly method: string;
    readonly details?: unknown;
}> {}

export class ToriiNetworkError extends Data.TaggedError("ToriiNetworkError")<{
    readonly message: string;
    readonly url: string;
    readonly cause?: unknown;
    readonly retryable: boolean;
}> {}

export class ToriiValidationError extends Data.TaggedError("ToriiValidationError")<{
    readonly message: string;
    readonly field: string;
    readonly value?: unknown;
    readonly expected?: string;
}> {}

export class ToriiSubscriptionError extends Data.TaggedError("ToriiSubscriptionError")<{
    readonly message: string;
    readonly subscriptionId?: bigint;
    readonly operation: "create" | "update" | "cancel";
    readonly cause?: unknown;
}> {}

export class ToriiTransformError extends Data.TaggedError("ToriiTransformError")<{
    readonly message: string;
    readonly transformer: string;
    readonly cause?: unknown;
}> {}
```

### Error Union Type

```typescript
export type ToriiError =
    | ToriiNetworkError
    | ToriiValidationError
    | ToriiSubscriptionError
    | ToriiConfigError
    | ToriiGrpcError
    | ToriiTimeoutError
    | ToriiTransformError;
```

## World Client Effect

The `WorldClientEffect` interface wraps each gRPC method with Effect types.

### Interface

```typescript
export interface WorldClientEffect {
    // Unary calls return Effect<Response, GrpcError>
    retrieveEntities(request: RetrieveEntitiesRequest): Effect.Effect<RetrieveEntitiesResponse, GrpcError>;
    retrieveTokens(request: RetrieveTokensRequest): Effect.Effect<RetrieveTokensResponse, GrpcError>;
    // ... 17 more unary methods

    // Streaming calls return Stream<Response, GrpcError>
    subscribeEntities(request: SubscribeEntitiesRequest): Stream.Stream<SubscribeEntityResponse, GrpcError>;
    subscribeTokens(request: SubscribeTokensRequest): Stream.Stream<SubscribeTokensResponse, GrpcError>;
    // ... 9 more streaming methods
}
```

### Unary Call Wrapper

```typescript
const wrapUnary = <TReq, TRes>(
    fn: (req: TReq) => { response: Promise<TRes> },
    methodName: string
) =>
    (request: TReq): Effect.Effect<TRes, GrpcError> =>
        Effect.tryPromise({
            try: () => fn(request).response,
            catch: mapError,
        }).pipe(
            Effect.retry(retryPolicy),
            Effect.withSpan(`dojo.world.v1.WorldService/${methodName}`, {
                attributes: {
                    "rpc.system": "grpc",
                    "rpc.service": "dojo.world.v1.WorldService",
                    "rpc.method": methodName,
                    "network.protocol.name": "grpc",
                },
            })
        );
```

### Stream Wrapper

```typescript
const wrapStream = <TReq, TRes>(
    fn: (req: TReq) => {
        responses: {
            onMessage: (fn: (msg: TRes) => void) => void;
            onError: (fn: (error: Error) => void) => void;
            onComplete: (fn: () => void) => void;
        };
    },
    methodName: string
) =>
    (request: TReq): Stream.Stream<TRes, GrpcError> =>
        Stream.async<TRes, GrpcError>((emit) => {
            const call = fn(request);
            call.responses.onMessage((message) => emit.single(message));
            call.responses.onError((error) => emit.fail(mapError(error)));
            call.responses.onComplete(() => emit.end());
        }).pipe(
            Stream.mapEffect((value) =>
                Effect.succeed(value).pipe(
                    Effect.withSpan(`dojo.world.v1.WorldService/${methodName}`, {
                        attributes: { /* OTel attributes */ },
                    })
                )
            )
        );
```

## Retry Policy

Network errors are automatically retried with exponential backoff:

```typescript
const isNetworkError = (error: unknown): boolean => {
    if (error instanceof ToriiGrpcError && error.details) {
        const details = error.details;
        if (details instanceof Error) {
            const msg = details.message.toLowerCase();
            return (
                msg.includes("network") ||
                msg.includes("fetch") ||
                msg.includes("body stream") ||
                msg.includes("connection") ||
                msg.includes("timeout")
            );
        }
    }
    return false;
};

const retryPolicy = Schedule.exponential("1 seconds").pipe(
    Schedule.compose(Schedule.recurs(5)),
    Schedule.whileInput((error: GrpcError) => isNetworkError(error.details))
);
```

- Base delay: 1 second
- Exponential backoff: 1s, 2s, 4s, 8s, 16s
- Maximum retries: 5
- Only retries network-related errors

## Telemetry

### OpenTelemetry Spans

Two levels of telemetry:

**gRPC Layer** (world-client-effect.ts):
```typescript
Effect.withSpan(`dojo.world.v1.WorldService/${methodName}`, {
    attributes: {
        "rpc.system": "grpc",
        "rpc.service": "dojo.world.v1.WorldService",
        "rpc.method": methodName,
        "network.protocol.name": "grpc",
    },
})
```

**Client Layer** (torii-client-functional.ts):
```typescript
Effect.withSpan("torii.getEntities", {
    attributes: {
        "torii.url": config.toriiUrl,
        "torii.world_address": worldAddress || "",
        "torii.operation": "getEntities",
    },
})
```

### Span Hierarchy

```
torii.getEntities
└── dojo.world.v1.WorldService/RetrieveEntities
```

## Subscription Architecture

### Fiber-Based Management

Subscriptions use Effect fibers for background processing:

```typescript
const program = pipe(
    worldClientEffect.subscribeEntities({ clause, world_addresses }),
    Stream.mapEffect((response) =>
        response.entity
            ? Effect.try({ try: () => mapEntity(response.entity!) })
            : Effect.fail(new Error("No entity in response"))
    ),
    Stream.tap((data) => Effect.sync(() => callback(data.entity, data.subscriptionId))),
    Stream.catchAll((error) =>
        pipe(
            Effect.sync(() => onError?.(error)),
            Effect.as(Stream.empty)
        )
    ),
    Stream.runDrain,
    Effect.fork  // Run in background fiber
);
```

### Cancellation

Subscriptions are cancelled using `Fiber.interrupt`:

```typescript
cancel: () => {
    Effect.runFork(Fiber.interrupt(fiber));
    state.subscriptions.delete(subscriptionId);
},
```

Note: `Effect.runFork` is used instead of `Effect.runSync` because fiber interruption is asynchronous.

### State Management

```typescript
const state = {
    nextId: 1,
    subscriptions: new Map<number, RuntimeFiber<void, unknown>>(),
};
```

## Query Execution Pattern

All queries follow this pattern:

```typescript
const runQuery = <A, E>(effect: Effect.Effect<A, E>, method: string): Promise<A> =>
    pipe(
        effect,
        Effect.mapError((error) => mapGrpcError(method, toriiUrl)(error)),
        Effect.runPromise
    );

// Usage:
getEntities: (query: Query) =>
    pipe(
        Effect.sync(() => createRetrieveEntitiesRequest(query)),
        Effect.flatMap((req) => worldClientEffect.retrieveEntities(req)),
        Effect.flatMap((response) =>
            Effect.try({
                try: () => mapEntitiesResponse(response),
                catch: mapTransformError("mapEntitiesResponse"),
            })
        ),
        Effect.withSpan("torii.getEntities", { attributes: { ... } }),
        (effect) => runQuery(effect, "getEntities")
    ),
```

## File Structure

```
src/
├── services/
│   ├── errors.ts              # Tagged error types
│   └── world-client-effect.ts # Effect-wrapped gRPC client
├── torii-client-functional.ts # Main client factory
└── benchmarks/
    └── effect-functional.bench.ts # Benchmark tests
```

## Dependencies

```json
{
    "@effect/opentelemetry": "^0.59.1",
    "@opentelemetry/api": "^1.9.0",
    "effect": "^3.19.4"
}
```

## Context Tag

The `WorldClientEffect` service is registered with Effect's Context:

```typescript
export const WorldClientEffect = Context.GenericTag<WorldClientEffect>(
    "@services/WorldClientEffect"
);
```

## Factory Function

```typescript
export const makeWorldClientEffect = (client: WorldClient): WorldClientEffect => ({
    retrieveEntities: wrapUnary(client.retrieveEntities.bind(client), "RetrieveEntities"),
    retrieveTokens: wrapUnary(client.retrieveTokens.bind(client), "RetrieveTokens"),
    // ... all other methods
});
```

## Error Mapping

Errors are mapped at the boundary:

```typescript
const mapError = (error: unknown): GrpcError => {
    if (error instanceof Error) {
        return new ToriiGrpcError({
            message: error.message,
            method: "unknown",
            details: error,
        });
    }
    return new ToriiGrpcError({
        message: String(error),
        method: "unknown",
        details: error,
    });
};
```
