import { ExtractAbiTypes } from "./index";

// There are two approaches to use compiled ABI with TypeScript:

// Approach 1: Import the JSON and use it at runtime (but types won't work automatically)
import compiledJson from "../../../../worlds/dojo-starter/compiled-abi.json";

// Approach 2: Use a code generation tool to create a TypeScript file from the JSON
// For example, create a compiled-abi.ts file that exports:
// export const compiledAbi = { abi: [...] } as const;

// For this example, we'll show how it would work with proper typing:
// You would need to generate this from your compiled-abi.json
declare const compiledAbi: {
    readonly abi: readonly [
        {
            readonly type: "struct";
            readonly name: "dojo_starter::models::Position";
            readonly members: readonly [
                {
                    readonly name: "player";
                    readonly type: "core::starknet::contract_address::ContractAddress";
                },
                {
                    readonly name: "vec";
                    readonly type: "dojo_starter::models::Vec2";
                },
            ];
        },
        {
            readonly type: "struct";
            readonly name: "dojo_starter::models::Vec2";
            readonly members: readonly [
                { readonly name: "x"; readonly type: "core::integer::u32" },
                { readonly name: "y"; readonly type: "core::integer::u32" },
            ];
        },
        {
            readonly type: "enum";
            readonly name: "dojo_starter::models::Direction";
            readonly variants: readonly [
                { readonly name: "None"; readonly type: "()" },
                { readonly name: "Up"; readonly type: "()" },
                { readonly name: "Down"; readonly type: "()" },
                { readonly name: "Left"; readonly type: "()" },
                { readonly name: "Right"; readonly type: "()" },
            ];
        },
        // ... more ABI entries
    ];
};

// Extract ABI types from the properly typed ABI
type MyAbi = ExtractAbiTypes<typeof compiledAbi>;

// Debug: Check the structure of MyAbi
type MyAbiStructs = MyAbi["structs"];
type MyAbiEnums = MyAbi["enums"];
type MyAbiFunctions = MyAbi["functions"];

// Now you can use the extracted types
type Position = MyAbi["structs"]["dojo_starter::models::Position"]; // { player: string; vec: Vec2 }
type Vec2 = MyAbi["structs"]["dojo_starter::models::Vec2"]; // { x: number; y: number }
type Direction = MyAbi["enums"]["dojo_starter::models::Direction"]; // "None" | "Up" | "Down" | "Left" | "Right"

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
