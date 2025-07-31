# Dynamic Type System for Dojo Manifests

This module provides a powerful TypeScript type system that dynamically extracts types from Dojo manifest files, providing full type safety when working with contracts, models, and events.

## Features

- **Automatic Type Extraction**: Extracts types from manifest JSON files
- **Cairo to TypeScript Mapping**: Automatically converts Cairo types to TypeScript equivalents
- **Full ABI Support**: Extracts structs, enums, functions, and events from ABIs
- **Type-Safe Contract Calls**: Get typed function inputs and outputs
- **Model Type Generation**: Generate TypeScript interfaces for your Dojo models

## Usage

### Basic Setup

```typescript
import { ExtractManifestTypes } from "@dojoengine/core";
import manifest from "./manifest_dev.json";

// Extract all types from the manifest
type MyTypes = ExtractManifestTypes<typeof manifest>;
```

### Working with Contracts

```typescript
// Access contract types
type Contracts = MyTypes["contracts"];
type ActionsContract = Contracts["dojo_starter-actions"];

// Get function types
type MoveFunction = ActionsContract["abi"]["functions"]["move"];
type MoveInputs = MoveFunction["inputs"]; // { direction: Direction }
type MoveOutput = MoveFunction["outputs"]; // void

// Use in your code
function callMove(inputs: MoveInputs): MoveOutput {
    // Type-safe contract call
}
```

### Working with Models

```typescript
// Access model types
type Models = MyTypes["models"];
type Position = Models["dojo_starter-Position"];
type PositionFields = Position["fields"];

// Or use the helper
import { GetModel } from "@dojoengine/core";
type PositionData = GetModel<typeof manifest, "dojo_starter-Position">;
```

### Working with Events

```typescript
// Access event types
type Events = MyTypes["events"];
type MovedEvent = Events["dojo_starter-Moved"];
type MovedEventData = MovedEvent["data"];

// Type-safe event handler
function handleMoved(data: MovedEventData) {
    // Handle event with typed data
}
```

## Type Mappings

The system automatically maps Cairo types to TypeScript:

| Cairo Type                                          | TypeScript Type |
| --------------------------------------------------- | --------------- |
| `core::felt252`                                     | `string`        |
| `core::integer::u8`                                 | `number`        |
| `core::integer::u16`                                | `number`        |
| `core::integer::u32`                                | `number`        |
| `core::integer::u64`                                | `bigint`        |
| `core::integer::u128`                               | `bigint`        |
| `core::bool`                                        | `boolean`       |
| `core::starknet::contract_address::ContractAddress` | `string`        |
| `core::byte_array::ByteArray`                       | `string`        |
| `core::array::Array<T>`                             | `T[]`           |
| `core::array::Span<T>`                              | `T[]`           |

## Advanced Usage

### Extract Specific Function Type

```typescript
import { GetContractFunction } from "@dojoengine/core";

type SpawnFunction = GetContractFunction<
    typeof manifest,
    "dojo_starter-actions",
    "spawn"
>;
```

### Working with Enums

```typescript
// Access enum types from ABI
type Direction =
    ActionsContract["abi"]["enums"]["dojo_starter::models::Direction"];

// Use in your code
const direction: Direction = { Left: {} };
```

## Example

See `example-usage.ts` for a complete example of using the type system with a real manifest file.
