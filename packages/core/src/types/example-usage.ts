import { ExtractAbiTypes } from "./index";

// Example manifest types (these would come from your actual manifest JSON files)
declare const manifest1: {
    world: {
        abi: [
            {
                type: "struct";
                name: "Position";
                members: [
                    { name: "x"; type: "core::integer::u32" },
                    { name: "y"; type: "core::integer::u32" },
                ];
            },
        ];
    };
    contracts: [
        {
            tag: "actions";
            abi: [
                {
                    type: "function";
                    name: "move";
                    inputs: [
                        { name: "entity"; type: "core::felt252" },
                        { name: "direction"; type: "core::integer::u8" },
                    ];
                    outputs: [];
                },
            ];
        },
    ];
};

declare const manifest2: {
    world: {
        abi: [
            {
                type: "enum";
                name: "Direction";
                variants: [
                    { name: "Up"; type: "()" },
                    { name: "Down"; type: "()" },
                    { name: "Left"; type: "()" },
                    { name: "Right"; type: "()" },
                ];
            },
        ];
    };
    contracts: [];
};

declare const manifest3: {
    contracts: [
        {
            tag: "combat";
            abi: [
                {
                    type: "struct";
                    name: "Health";
                    members: [
                        { name: "current"; type: "core::integer::u32" },
                        { name: "max"; type: "core::integer::u32" },
                    ];
                },
                {
                    type: "function";
                    name: "attack";
                    inputs: [
                        { name: "attacker"; type: "core::felt252" },
                        { name: "target"; type: "core::felt252" },
                        { name: "damage"; type: "core::integer::u32" },
                    ];
                    outputs: [{ type: "core::bool" }];
                },
            ];
        },
    ];
};

// Extract ABI types from multiple manifests
type MyAbi = ExtractAbiTypes<
    [typeof manifest1, typeof manifest2, typeof manifest3]
>;

// Now you can use the extracted types
type Position = MyAbi["structs"]["Position"]; // { x: number; y: number }
type Direction = MyAbi["enums"]["Direction"]; // "Up" | "Down" | "Left" | "Right"
type Health = MyAbi["structs"]["Health"]; // { current: number; max: number }
type MoveFunction = MyAbi["functions"]["move"]; // { inputs: { entity: string; direction: number }; outputs: void }
type AttackFunction = MyAbi["functions"]["attack"]; // { inputs: { attacker: string; target: string; damage: number }; outputs: boolean }

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
