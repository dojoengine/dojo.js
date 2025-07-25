# @dojoengine/grpc

gRPC-Web client for Dojo, providing TypeScript bindings for torii's protobuf definitions.

## Installation

```bash
pnpm add @dojoengine/grpc
```

## Usage

```typescript
import { createDojoGrpcClient } from "@dojoengine/grpc";

// Create a client instance
const client = createDojoGrpcClient({
    url: "http://localhost:8080", // Your torii gRPC endpoint
});

// Example: Get world metadata
const metadata = await client.worldClient.worldMetadata({}).response;
console.log("World:", metadata.world);

// Example: Subscribe to entities
const subscription = client.worldClient.subscribeEntities({
    clause: {
        keys: {
            keys: [],
            patternMatching: PatternMatching.FixedLen,
            models: [],
        },
    },
});

// Handle streaming responses
for await (const response of subscription.responses) {
    console.log("Entity update:", response.entity);
}
```

## Development

### Update Proto Files

To update the proto files from the torii repository:

```bash
pnpm run update:proto
```

### Generate TypeScript Code

To regenerate the TypeScript bindings after updating proto files:

```bash
pnpm run build:proto
```

### Build

```bash
pnpm run build
```

### Test

```bash
pnpm run test
```

## API Reference

### `createDojoGrpcClient(config)`

Creates a new gRPC-Web client instance.

#### Parameters

- `config.url`: The base URL of the torii gRPC-Web endpoint
- `config.options`: Optional RPC options

#### Returns

A `DojoGrpcClient` instance with:

- `worldClient`: The generated World service client with all RPC methods

## Generated Types

All protobuf message types and enums are exported from the package:

```typescript
import type {
    Entity,
    Model,
    Query,
    Transaction,
    // ... other types
} from "@dojoengine/grpc";
```
