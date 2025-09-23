# Dynamic Type System for Dojo ABIs

This module turns a Dojo world's ABI into rich TypeScript types that can be used across the SDK. After aggregating your world's JSON ABIs into a single `compiled-abi.json`, you can generate a TypeScript file with literal-preserving `const` data and derive types directly from it.

## Generate the aggregated ABI

Run the bundled CLI from the root of your Dojo world:

```bash
npx @dojoengine/core compile-abi --generate-types
```

Need a custom location? Append `--output path/to/compiled-abi.json` (relative paths are resolved from your Dojo root). The TypeScript file will be emitted alongside the JSON with a `.ts` extension.

The command collects every ABI entry from `manifest_<env>.json` and `target/<env>/**/*.json`, deduplicates them, writes a consolidated `compiled-abi.json`, and emits a matching `compiled-abi.ts` that exports the ABI with `as const`.

## Getting started in TypeScript

```ts
import { compiledAbi } from "./compiled-abi";
import {
    ExtractAbiTypes,
    ModelsFromAbi,
    ModelPathFromAbi,
    GetModel,
    GetActionFunction,
} from "@dojoengine/core";

// Primary entry point – exposes structs, enums, interfaces, models, and actions
type Abi = ExtractAbiTypes<typeof compiledAbi>;

// Schema of Dojo models keyed by namespace → model name
type Schema = ModelsFromAbi<typeof compiledAbi>;

type Position = GetModel<typeof compiledAbi, "dojo_starter-Position">;

type Move = GetActionFunction<
    typeof compiledAbi,
    "dojo_starter",
    "IActions",
    "move"
>;

// Use strongly typed model paths with torii query builders
type ModelPath = ModelPathFromAbi<typeof compiledAbi>; // e.g. "dojo_starter-Position"
```

## Extracted type groups

- **`structs`** – Cairo structs mapped to TypeScript objects with nested references resolved.
- **`enums`** – Cairo enums with both the variant union (`type`) and a `variants` object.
- **`interfaces`** – Contract interfaces keyed by fully qualified name with typed function signatures.
- **`models`** – Dojo models grouped by namespace; the shape aligns with `SchemaType` used throughout the SDK.
- **`actions`** – System action interfaces grouped by namespace, preserving typed inputs and outputs.

```ts
type Direction = Abi["enums"]["dojo_starter::models::Direction"]["type"]; // "Up" | "Down" | ...

type Actions = Abi["actions"]["dojo_starter"]["IActions"];
type SpawnInputs = Actions["spawn"]["inputs"]; // { entity: Position; ... }
```

## From types to runtime helpers

All helpers operate purely on types, so the generated `compiled-abi.ts` can be tree-shaken in applications that only need compile-time support. At runtime you can still import the JSON version alongside it if required.

The derived schema satisfies the `SchemaType` consumed by internal utilities, allowing seamless wiring with query builders and the SDK's entity helpers without manually writing model definitions.
