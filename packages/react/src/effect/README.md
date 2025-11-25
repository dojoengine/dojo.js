# @dojoengine/react/effect

Effect-based state management for Dojo applications using React. This package provides reactive atoms powered by the [Effect](https://effect.website/) library and [effect-atom](https://github.com/tim-smart/effect-atom), enabling type-safe, composable state management with built-in error handling and retry logic for Torii client operations.

## Features

- **Effect-based**: Leverages Effect for composable, type-safe operations
- **Reactive atoms**: Powered by effect-atom for React integration
- **Automatic retry**: Exponential backoff on failures
- **Type-safe**: Full TypeScript support with Effect types
- **Real-time subscriptions**: WebSocket-based entity and event updates
- **Infinite scroll**: Cursor-based pagination built-in
- **Error handling**: Tagged errors with context
- **Telemetry**: OpenTelemetry integration

## Installation

```bash
npm install @dojoengine/react effect @effect-atom/atom-react
```

## Quick Start

### 1. Setup Runtime

Create a runtime with your Torii configuration:

```typescript
import { Atom } from "@effect-atom/atom-react";
import { makeToriiLayer } from "@dojoengine/react/effect";
import manifest from "./manifest.json";

// Create Torii layer
const toriiLayer = makeToriiLayer(
    {
        manifest,
        toriiUrl: "https://api.cartridge.gg/x/your-app/torii" OR "http://localhost:8080"
    },
    {
        autoReconnect: true,
        maxReconnectAttempts: 5
    }
);

// Create runtime
export const toriiRuntime = Atom.runtime(toriiLayer);
```

### 2. Create Atoms

```typescript
import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { createEntityQueryAtom } from "@dojoengine/react/effect";
import { toriiRuntime } from "./runtime";

const clause = KeysClause([], [], "VariableLen").build();

const entitiesAtom = createEntityQueryAtom(
  toriiRuntime,
  new ToriiQueryBuilder().withClause(clause).withLimit(100),
);
```

### 3. Use in Components

```typescript
import { useAtomValue } from "@effect-atom/atom-react";
import { Result } from "@effect-atom/atom-react";

function EntityList() {
    const entities = useAtomValue(entitiesAtom);

    return Result.match(entities, {
        onSuccess: ({ value }) => (
            <div>
                <h2>Entities: {value.items.length}</h2>
                <ul>
                    {value.items.map(entity => (
                        <li key={entity.entityId}>{entity.entityId}</li>
                    ))}
                </ul>
            </div>
        ),
        onFailure: (error) => (
            <div>Error: {error.message}</div>
        ),
        onInitial: () => <div>Loading...</div>
    });
}
```

## Core Concepts

### Atoms

Atoms are reactive values that automatically update when their dependencies change. This package provides three types of atoms:

1. **Query Atoms**: Fetch data once based on a query
2. **Update/Subscription Atoms**: Subscribe to real-time updates
3. **Infinite Scroll Atoms**: Handle cursor-based pagination

### Result Pattern

All atoms return a `Result` type that represents three states:

```typescript
Result.match(atomValue, {
  onSuccess: ({ value }) => {
    // Data loaded successfully
  },
  onFailure: (error) => {
    // Error occurred
  },
  onInitial: () => {
    // Still loading
  },
});
```

### Runtime

The runtime provides the Effect environment needed by atoms. It's created once and shared across your application:

```typescript
const runtime = Atom.runtime(toriiLayer);
```

## API Reference

### Entities

#### `createEntityQueryAtom(runtime, query)`

Fetch entities once based on a query.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `query: ToriiQueryBuilder<SchemaType>` - Query configuration

**Returns:** `Atom<Result<{ items: ParsedEntity[], next_cursor?: string }>>`

**Example:**

```typescript
const entitiesAtom = createEntityQueryAtom(
  toriiRuntime,
  new ToriiQueryBuilder()
    .withClause(KeysClause([], [], "VariableLen").build())
    .withLimit(100),
);
```

#### `createEntityUpdatesAtom(runtime, clause, worldAddresses?)`

Subscribe to real-time entity updates.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `clause: Clause | null` - Filter clause for entities
- `worldAddresses?: string[] | null` - Optional world addresses to filter

**Returns:** `Atom<Result<Map<string, EntityUpdate>>>`

**Features:**

- Auto-reconnect with exponential backoff
- Accumulates updates in a Map keyed by entity ID

**Example:**

```typescript
const subscriptionAtom = createEntityUpdatesAtom(
  toriiRuntime,
  KeysClause([], [], "VariableLen").build(),
);
```

#### `createEntitiesInfiniteScrollAtom(runtime, baseQuery, limit?)`

Handle cursor-based pagination for entities.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `baseQuery: ToriiQueryBuilder<SchemaType>` - Base query (without pagination)
- `limit?: number` - Items per page (default: 20)

**Returns:** `{ stateAtom, loadMoreAtom }`

**State Interface:**

```typescript
interface EntitiesInfiniteState {
  items: ParsedEntity[];
  cursor?: string;
  hasMore: boolean;
  isLoading: boolean;
  error?: ToriiGrpcClientError;
}
```

**Example:**

```typescript
const { stateAtom, loadMoreAtom } = createEntitiesInfiniteScrollAtom(
    toriiRuntime,
    new ToriiQueryBuilder().withClause(clause),
    20
);

function InfiniteList() {
    const state = useAtomValue(stateAtom);
    const loadMore = useAtomSet(loadMoreAtom);

    return (
        <div>
            {state.items.map(entity => <div key={entity.entityId}>...</div>)}
            {state.hasMore && (
                <button onClick={loadMore} disabled={state.isLoading}>
                    Load More
                </button>
            )}
        </div>
    );
}
```

### Events

#### `createEventQueryAtom(runtime, query)`

Fetch events once.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `query: { keys?: KeysClause, pagination?: Pagination }` - Event query

**Returns:** `Atom<Result<Events>>`

**Example:**

```typescript
const eventsAtom = createEventQueryAtom(toriiRuntime, {
  keys: KeysClause([], [], "VariableLen").build(),
  pagination: { limit: 50 },
});
```

#### `createEventUpdatesAtom(runtime, clauses)`

Subscribe to real-time StarkNet events.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `clauses: KeysClause[]` - Event filter clauses

**Returns:** `Atom<Result<unknown[]>>`

**Example:**

```typescript
const eventUpdates = createEventUpdatesAtom(toriiRuntime, [
  KeysClause([], [], "VariableLen").build(),
]);
```

#### `createEventsInfiniteScrollAtom(runtime, baseQuery, limit?)`

Handle paginated event loading.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `baseQuery: { keys?: KeysClause }` - Base query
- `limit?: number` - Events per page (default: 20)

**Returns:** `{ stateAtom, loadMoreAtom }`

**State:** `EventsInfiniteState`

### Tokens

#### `createTokenQueryAtom(runtime, query)`

Fetch tokens once.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `query: TokenQuery` - Token query with filters

**Returns:** `Atom<Result<Tokens>>`

**Example:**

```typescript
const tokensAtom = createTokenQueryAtom(toriiRuntime, {
  contract_addresses: ["0x123"],
  pagination: { limit: 100 },
});
```

#### `createTokenUpdatesAtom(runtime, contractAddresses?, tokenIds?)`

Subscribe to token updates.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `contractAddresses?: string[] | null` - Contract addresses to watch
- `tokenIds?: string[] | null` - Token IDs to watch

**Returns:** `Atom<Result<unknown[]>>`

**Example:**

```typescript
const tokenUpdates = createTokenUpdatesAtom(
  toriiRuntime,
  ["0x123"], // contract addresses
  null, // all token IDs
);
```

#### `createTokensInfiniteScrollAtom(runtime, baseQuery, limit?)`

Handle paginated token loading.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `baseQuery: Omit<TokenQuery, "pagination">` - Base query
- `limit?: number` - Tokens per page (default: 20)

**Returns:** `{ stateAtom, loadMoreAtom }`

**State:** `TokensInfiniteState`

### Token Balances

#### `createTokenBalanceQueryAtom(runtime, query)`

Fetch token balances once.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `query: TokenBalanceQuery` - Balance query

**Returns:** `Atom<Result<TokenBalances>>`

**Example:**

```typescript
const balancesAtom = createTokenBalanceQueryAtom(toriiRuntime, {
  account_addresses: ["0xabc"],
  contract_addresses: ["0x123"],
  pagination: { limit: 50 },
});
```

#### `createTokenBalanceUpdatesAtom(runtime, query, pollingIntervalMs?)`

Poll for balance updates (no native subscription available).

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `query: TokenBalanceQuery` - Balance query
- `pollingIntervalMs?: number` - Polling interval (default: 5000ms)

**Returns:** `Atom<Result<TokenBalances>>`

**Example:**

```typescript
const balanceUpdates = createTokenBalanceUpdatesAtom(
  toriiRuntime,
  { account_addresses: ["0xabc"] },
  3000, // poll every 3 seconds
);
```

#### `createTokenBalancesInfiniteScrollAtom(runtime, baseQuery, limit?)`

Handle paginated balance loading.

**Parameters:**

- `runtime: Atom.AtomRuntime<ToriiGrpcClient>` - The atom runtime
- `baseQuery: Omit<TokenBalanceQuery, "pagination">` - Base query
- `limit?: number` - Balances per page (default: 20)

**Returns:** `{ stateAtom, loadMoreAtom }`

**State:** `TokenBalancesInfiniteState`

## Usage Examples

### Pattern 1: Query + Subscription

Combine a one-time query with real-time updates:

```typescript
import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import {
  createEntityQueryAtom,
  createEntityUpdatesAtom,
} from "@dojoengine/react/effect";

const clause = KeysClause([], [], "VariableLen").build();

// Initial data load
const entitiesAtom = createEntityQueryAtom(
  toriiRuntime,
  new ToriiQueryBuilder().withClause(clause).withLimit(1000),
);

// Real-time updates
const subscriptionAtom = createEntityUpdatesAtom(toriiRuntime, clause);

function MyComponent() {
  const entities = useAtomValue(entitiesAtom);
  const updates = useAtomValue(subscriptionAtom);

  // Render both initial data and updates
}
```

### Pattern 2: Infinite Scroll

Implement infinite scrolling with load more:

```typescript
const { stateAtom, loadMoreAtom } = createEntitiesInfiniteScrollAtom(
    toriiRuntime,
    new ToriiQueryBuilder().withClause(clause),
    20
);

function InfiniteList() {
    const state = useAtomValue(stateAtom);
    const loadMore = useAtomSet(loadMoreAtom);

    return (
        <div>
            <p>Loaded: {state.items.length}</p>
            <ul>
                {state.items.map(entity => (
                    <li key={entity.entityId}>
                        {entity.entityId}
                    </li>
                ))}
            </ul>
            {state.hasMore && (
                <button onClick={loadMore} disabled={state.isLoading}>
                    {state.isLoading ? "Loading..." : "Load More"}
                </button>
            )}
            {state.error && (
                <div>Error: {state.error.message}</div>
            )}
        </div>
    );
}
```

### Pattern 3: Derived Atoms

Create filtered/transformed views of data:

```typescript
import { Atom } from "@effect-atom/atom-react";
import { Result } from "@effect-atom/atom-react";

// Base atom
const entitiesAtom = createEntityQueryAtom(
    toriiRuntime,
    new ToriiQueryBuilder().withClause(clause)
);

// Derived atom - filter and transform
const gamesAtom = Atom.make((get) => {
    const entities = get(entitiesAtom);

    return Result.map(entities, (value) => {
        return value.items
            .filter(entity => entity.models.NUMS?.Game)
            .map(entity => ({
                entityId: entity.entityId,
                ...entity.models.NUMS.Game
            }));
    });
});

function GameList() {
    const games = useAtomValue(gamesAtom);

    return Result.match(games, {
        onSuccess: ({ value: games }) => (
            <ul>
                {games.map(game => (
                    <li key={game.entityId}>Game #{game.id}</li>
                ))}
            </ul>
        ),
        onFailure: (error) => <div>Error: {error.message}</div>,
        onInitial: () => <div>Loading games...</div>
    });
}
```

### Pattern 4: Polling Updates

Use polling for data without native subscriptions:

```typescript
const balanceUpdates = createTokenBalanceUpdatesAtom(
    toriiRuntime,
    {
        account_addresses: ["0xabc"],
        contract_addresses: ["0x123"]
    },
    5000 // poll every 5 seconds
);

function BalanceDisplay() {
    const balances = useAtomValue(balanceUpdates);

    return Result.match(balances, {
        onSuccess: ({ value }) => (
            <div>Balance: {value.items[0]?.balance || 0}</div>
        ),
        onFailure: () => <div>Failed to load balance</div>,
        onInitial: () => <div>Loading balance...</div>
    });
}
```

## Advanced Patterns

### Combining Multiple Atoms

Derive data from multiple sources:

```typescript
const combinedAtom = Atom.make((get) => {
  const entities = get(entitiesAtom);
  const events = get(eventsAtom);

  // Combine results
  if (Result.isSuccess(entities) && Result.isSuccess(events)) {
    return Result.succeed({
      entities: entities.value.items,
      events: events.value.items,
    });
  }

  return Result.initial();
});
```

### Error Handling

Handle errors gracefully:

```typescript
function ComponentWithErrorHandling() {
    const data = useAtomValue(myAtom);

    return Result.match(data, {
        onSuccess: ({ value }) => <SuccessView data={value} />,
        onFailure: (error) => {
            if (error instanceof ToriiGrpcClientError) {
                console.error("Torii error:", error.cause);
                return <div>Connection error. Retrying...</div>;
            }
            return <div>Unknown error occurred</div>;
        },
        onInitial: () => <LoadingSpinner />
    });
}
```

### Custom Transformations

Transform entity data with parsing utilities:

```typescript
import { parseEntity } from "@dojoengine/react/effect";

const transformedAtom = Atom.make((get) => {
  const entities = get(entitiesAtom);

  return Result.flatMap(entities, (value) =>
    Effect.gen(function* () {
      // Parse each entity
      const parsed = yield* Effect.forEach(value.items, parseEntity, {
        concurrency: "unbounded",
      });

      return { items: parsed, next_cursor: value.next_cursor };
    }),
  );
});
```

## Type Reference

### ParsedEntity

Structure of a parsed entity:

```typescript
interface ParsedEntity {
  entityId: string;
  models: Record<string, Record<string, unknown>>;
}
```

**Model Access:**

```typescript
// Access model data
const game = entity.models.NUMS?.Game;
const player = entity.models.MySchema?.Player;
```

### EntityUpdate

Raw entity update from subscription:

```typescript
interface EntityUpdate {
  hashed_keys: string;
  models: Record<string, Ty>;
}
```

### InfiniteState

Generic state for infinite scroll atoms:

```typescript
interface InfiniteState<T> {
  items: T[];
  cursor?: string;
  hasMore: boolean;
  isLoading: boolean;
  error?: ToriiGrpcClientError;
}
```

### ToriiGrpcClientError

Tagged error for Torii operations:

```typescript
class ToriiGrpcClientError {
  readonly _tag = "ToriiGrpcClientError";
  readonly cause: unknown;
  readonly message: string;
}
```

## Parsing Utilities

Entity data from Torii uses custom Cairo types that need parsing:

### `parseEntity(entity: EntityUpdate)`

Parse a single entity with model namespacing.

**Returns:** `Effect<ParsedEntity>`

### `parseEntities(entities: Entities)`

Batch parse entities with unbounded concurrency.

**Returns:** `Effect<{ items: ParsedEntity[], next_cursor?: string }>`

### `parseValue(value: Ty)`

Parse Cairo value to JavaScript type:

```typescript
parseValue(ty); // Returns:
// - Number for u8, u16, u32, u64, i8, i16, i32, i64
// - BigInt for u128, u256, i128
// - CairoOption for Option<T>
// - CairoCustomEnum for custom enums
// - Plain object for structs
// - Array for arrays/tuples
```

### `parseStruct(struct: Record<string, Ty>)`

Parse Cairo struct to plain JavaScript object.

### `parsePrimitive(value: Ty)`

Parse primitive Cairo types (u8, u16, u32, u64, u128, u256, felt252, etc).

## Examples

See the example application for complete usage:

- [Entities](../../../example/frameworks/react/src/pages/Home.tsx)
- [Events](../../../example/frameworks/react/src/pages/Events.tsx)
- [Tokens](../../../example/frameworks/react/src/pages/Tokens.tsx)
- [Token Balances](../../../example/frameworks/react/src/pages/TokenBalances.tsx)
- [Runtime Setup](../../../example/frameworks/react/src/effect/atoms/index.ts)

## License

MIT
