# Effect.ts Functional Implementation

This document describes the Effect.ts-based functional implementation of the Torii gRPC client (`torii-client-functional.ts`).

## Overview

`makeToriiClient` is a factory function that creates a Torii client using Effect.ts internally while exposing a Promise-based API identical to `ToriiGrpcClient`. This provides:

- Functional composition with `pipe`
- OpenTelemetry telemetry via `Effect.withSpan`
- Automatic retry logic with exponential backoff
- Fiber-based subscription management
- Type-safe error handling

## Architecture

### Factory Function

```typescript
import { makeToriiClient } from "@dojoengine/grpc";

const client = makeToriiClient({
    toriiUrl: "http://localhost:8080",
    worldAddress: "0x...",
});

// Same API as ToriiGrpcClient
const entities = await client.getEntities(query);
client.destroy();
```

### Core Components

1. **WorldClientEffect** (`src/services/world-client-effect.ts`)
   - Wraps gRPC client methods with Effect types
   - Unary calls: `Effect<Response, GrpcError>`
   - Streaming calls: `Stream<Response, GrpcError>`
   - Automatic retry with exponential backoff
   - OpenTelemetry spans for each gRPC method

2. **Error Types** (`src/services/errors.ts`)
   - `ToriiGrpcError` - gRPC call failures
   - `ToriiNetworkError` - Connection issues
   - `ToriiValidationError` - Invalid parameters
   - `ToriiSubscriptionError` - Subscription failures
   - `ToriiTransformError` - Response mapping errors

3. **Query Execution Pattern**
   ```typescript
   const runQuery = <A, E>(effect: Effect<A, E>, method: string): Promise<A> =>
       pipe(
           effect,
           Effect.mapError((error) => mapGrpcError(method, toriiUrl)(error)),
           Effect.runPromise
       );
   ```

## Implementation Pattern

### Query Methods

Each query method follows this pattern:

```typescript
getEntities: (query: Query) =>
    pipe(
        Effect.sync(() => createRetrieveEntitiesRequest(query)),
        Effect.tap((req) => Effect.sync(() => {
            // Ensure world addresses
            if (req.query) {
                req.query.world_addresses = ensureWorldAddressesList(req.query.world_addresses);
            }
        })),
        Effect.flatMap((req) => worldClientEffect.retrieveEntities(req)),
        Effect.flatMap((response) =>
            Effect.try({
                try: () => mapEntitiesResponse(response),
                catch: mapTransformError("mapEntitiesResponse"),
            })
        ),
        Effect.withSpan("torii.getEntities", {
            attributes: {
                "torii.url": config.toriiUrl,
                "torii.world_address": worldAddress || "",
                "torii.operation": "getEntities",
            },
        }),
        (effect) => runQuery(effect, "getEntities")
    ),
```

### Subscription Methods

Subscriptions use Effect fibers for background processing:

```typescript
onEntityUpdated: (clause, world_addresses, callback, onError) => {
    const subscriptionId = state.nextId++;

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
        Effect.fork
    );

    return pipe(
        Effect.scoped(program),
        Effect.map((fiber) => new Subscription({
            id: subscriptionId,
            cancel: () => {
                Effect.runFork(Fiber.interrupt(fiber));
                state.subscriptions.delete(subscriptionId);
            },
        })),
        Effect.withSpan("torii.subscribeEntities", { ... }),
        Effect.runPromise
    );
},
```

## Telemetry

All operations include OpenTelemetry spans with attributes:

### gRPC Layer (world-client-effect.ts)
- `rpc.system`: "grpc"
- `rpc.service`: "dojo.world.v1.WorldService"
- `rpc.method`: Method name (e.g., "RetrieveEntities")
- `network.protocol.name`: "grpc"

### Client Layer (torii-client-functional.ts)
- `torii.url`: Server URL
- `torii.world_address`: World address
- `torii.operation`: Operation name
- `torii.subscription.id`: Subscription ID (for subscriptions)
- `torii.message_count`: Message count (for batch operations)

## API Reference

### Configuration

```typescript
interface ToriiClientConfig {
    readonly toriiUrl: string;
    readonly worldAddress: string;
    readonly autoReconnect?: boolean;
    readonly maxReconnectAttempts?: number;
}
```

### Query Methods

| Method | Returns |
|--------|---------|
| `getEntities(query)` | `Promise<Entities>` |
| `getAllEntities(limit, cursor?)` | `Promise<Entities>` |
| `getEventMessages(query)` | `Promise<Entities>` |
| `getControllers(query)` | `Promise<Controllers>` |
| `getTransactions(query)` | `Promise<Transactions>` |
| `getTokens(query)` | `Promise<Tokens>` |
| `getTokenBalances(query)` | `Promise<TokenBalances>` |
| `getTokenContracts(query)` | `Promise<TokenContracts>` |
| `getTokenTransfers(query)` | `Promise<TokenTransfers>` |
| `getAchievements(query)` | `Promise<AchievementsPage>` |
| `getPlayerAchievements(query)` | `Promise<PlayerAchievementsPage>` |
| `getWorldMetadata()` | `Promise<any>` |
| `getWorlds(addresses?)` | `Promise<any[]>` |
| `getEvents(query)` | `Promise<any>` |
| `getContracts(query?)` | `Promise<any>` |
| `getAggregations(query)` | `Promise<AggregationsPage>` |
| `getActivities(query)` | `Promise<ActivitiesPage>` |
| `search(query)` | `Promise<SearchResultsView>` |
| `executeSql(query)` | `Promise<SqlQueryResponse>` |
| `publishMessage(message)` | `Promise<string>` |
| `publishMessageBatch(messages)` | `Promise<string[]>` |

### Subscription Methods

| Method | Returns |
|--------|---------|
| `onEntityUpdated(clause, addresses, callback, onError?)` | `Promise<Subscription>` |
| `onTokenUpdated(addresses, tokenIds, callback, onError?)` | `Promise<Subscription>` |
| `onTransaction(filter, callback)` | `Promise<Subscription>` |

### Lifecycle

| Method | Description |
|--------|-------------|
| `destroy()` | Cancels all subscriptions and cleans up resources |

## Usage Examples

### Basic Query

```typescript
import { makeToriiClient } from "@dojoengine/grpc";

const client = makeToriiClient({
    toriiUrl: "http://localhost:8080",
    worldAddress: "0x...",
});

const entities = await client.getEntities({
    clause: undefined,
    no_hashed_keys: true,
    models: [],
    historical: false,
    world_addresses: [],
    pagination: { limit: 100, direction: "Forward", order_by: [] },
});

console.log(`Found ${entities.items.length} entities`);
client.destroy();
```

### Subscription

```typescript
const client = makeToriiClient({
    toriiUrl: "http://localhost:8080",
    worldAddress: "0x...",
});

const sub = await client.onEntityUpdated(
    undefined,
    null,
    (entity, subscriptionId) => {
        console.log("Entity updated:", entity);
    },
    (error) => {
        console.error("Subscription error:", error);
    }
);

// Later: clean cancellation
sub.cancel();
client.destroy();
```

### Parallel Queries

```typescript
const [entities, tokens, metadata] = await Promise.all([
    client.getEntities(entitiesQuery),
    client.getTokens(tokensQuery),
    client.getWorldMetadata(),
]);
```

## Running Benchmarks

```bash
# Run benchmarks
bun run test:bench

# Run with custom Torii URL
TORII_URL=http://localhost:8080 bun run test:bench
```

## Benefits

1. **Functional Composition**: Clean `pipe`-based data flow
2. **Automatic Retry**: Exponential backoff for transient failures
3. **Telemetry**: Built-in OpenTelemetry tracing
4. **Resource Management**: Proper fiber cleanup for subscriptions
5. **Type Safety**: Effect's type-safe error handling
6. **API Compatibility**: Drop-in replacement for ToriiGrpcClient
