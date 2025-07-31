import { ExtractAbiTypes } from "./index";

// Problem: Importing JSON directly doesn't preserve literal types in TypeScript
import compiledJson from "../../../../worlds/dojo-starter/compiled-abi.json";

// Solution 1: Import the generated TypeScript file instead
import { compiledAbi } from "../../../../worlds/dojo-starter/compiled-abi";

// Extract ABI types from the TypeScript version (this works!)
type MyAbi = ExtractAbiTypes<typeof compiledAbi>;

// Note: If you need the JSON at runtime, you can still import it separately
// The types come from the TypeScript file, the runtime data from JSON

// IMPORTANT: TypeScript limitation with JSON imports
// When you import JSON files directly, TypeScript converts all string literals
// to generic 'string' type, which breaks ExtractAbiTypes.
//
// To extract types from JSON files, you must:
// 1. Run `npx generate-abi-types` in your world directory to create a .ts file
// 2. Import from the generated .ts file instead of .json
//
// The JSON file can still be used at runtime if needed:
// const runtimeAbi = compiledJson; // This has the actual data
// type CompileTimeTypes = ExtractAbiTypes<typeof compiledAbi>; // This has the types

// Debug: Check the structure of MyAbi
type MyAbiStructs = MyAbi["structs"];
type MyAbiEnums = MyAbi["enums"];
type MyAbiFunctions = MyAbi["functions"];
type MyAbiInterfaces = MyAbi["interfaces"];

// Now you can use the extracted types
type Position = MyAbi["structs"]["dojo_starter::models::Position"]; // { player: string; vec: Vec2 }
type Vec2 = MyAbi["structs"]["dojo_starter::models::Vec2"]; // { x: number; y: number }

// Enum types now include variants structure
type Direction = MyAbi["enums"]["dojo_starter::models::Direction"];
// Direction will be: {
//   variants: { None: void; Up: void; Down: void; Left: void; Right: void };
//   type: "None" | "Up" | "Down" | "Left" | "Right";
// }
type DirectionType = Direction["type"]; // Union type: "None" | "Up" | "Down" | "Left" | "Right"
type DirectionVariants = Direction["variants"]; // Object with variant names as keys

// Interface types - access interface functions
type IWorld = MyAbi["interfaces"]["dojo::world::iworld::IWorld"];
type WorldResourceFunction = IWorld["resource"]; // { inputs: { selector: string }, outputs: Resource }
type WorldUuidFunction = IWorld["uuid"]; // { inputs: {}, outputs: number }

// Action interface example
type IActions = MyAbi["interfaces"]["dojo_starter::systems::actions::IActions"];
type SpawnFunction = IActions["spawn"]; // { inputs: {}, outputs: void }
type MoveFunction = IActions["move"]; // { inputs: { direction: Direction["type"] }, outputs: void }

// To make this work with your actual compiled-abi.json, you need to:
// 1. Create a script that converts compiled-abi.json to a TypeScript file with proper const assertions
// 2. Or use a build tool that preserves literal types when importing JSON

// Example of what the generated TypeScript file would look like:
// compiled-abi.generated.ts:
// export const compiledAbi = {
//   "abi": [
//     { "type": "struct", "name": "...", "members": [...] },
//     // ... rest of your ABI
//   ]
// } as const;

// Backward compatibility - still works with raw ABI arrays
declare const abi: [
    {
        type: "struct";
        name: "User";
        members: [{ name: "name"; type: "core::byte_array::ByteArray" }];
    },
];

type SingleAbiTypes = ExtractAbiTypes<typeof abi>;
type UserType = SingleAbiTypes["structs"]["User"]; // { name: string }
