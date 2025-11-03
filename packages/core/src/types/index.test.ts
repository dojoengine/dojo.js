import { describe, it, expectTypeOf } from "vitest";
import { CairoCustomEnum, CairoOption } from "starknet";
import {
    ExtractAbiTypes,
    ModelPathFromAbi,
    GetModel,
    ModelsFromAbi,
    ActionsFromAbi,
    GetActionFunction,
} from "./index";

const sampleAbi = {
    abi: [
        {
            type: "struct",
            name: "demo::models::Player",
            members: [
                { name: "id", type: "core::felt252" },
                { name: "score", type: "core::integer::u32" },
            ],
        },
        {
            type: "struct",
            name: "demo::models::Position",
            members: [
                { name: "player", type: "demo::models::Player" },
                { name: "x", type: "core::integer::u16" },
                { name: "y", type: "core::integer::u16" },
            ],
        },
        {
            type: "enum",
            name: "demo::models::Direction",
            variants: [
                { name: "Up", type: "()" },
                { name: "Down", type: "()" },
                { name: "Left", type: "()" },
                { name: "Right", type: "()" },
            ],
        },
        {
            type: "enum",
            name: "core::option::Option::<demo::models::Direction>",
            variants: [
                { name: "Some", type: "demo::models::Direction" },
                { name: "None", type: "()" },
            ],
        },
        {
            type: "enum",
            name: "core::option::Option::<core::integer::u32>",
            variants: [
                { name: "Some", type: "core::integer::u32" },
                { name: "None", type: "()" },
            ],
        },
        {
            type: "function",
            name: "move",
            inputs: [
                { name: "entity", type: "demo::models::Position" },
                { name: "direction", type: "demo::models::Direction" },
            ],
            outputs: [{ type: "()" }],
        },
        {
            type: "interface",
            name: "demo::systems::actions::IActions",
            items: [
                {
                    type: "function",
                    name: "move",
                    inputs: [
                        { name: "entity", type: "demo::models::Position" },
                        { name: "direction", type: "demo::models::Direction" },
                    ],
                    outputs: [{ type: "()" }],
                    state_mutability: "external",
                },
            ],
        },
    ],
} as const;

type Extracted = ExtractAbiTypes<typeof sampleAbi>;

describe("ExtractAbiTypes", () => {
    it("maps Cairo structs to TypeScript models", () => {
        expectTypeOf<
            Extracted["structs"]["demo::models::Player"]
        >().toEqualTypeOf<{
            id: string;
            score: number;
        }>();

        expectTypeOf<Extracted["models"]["demo"]["Position"]>().toEqualTypeOf<{
            player: Extracted["models"]["demo"]["Player"];
            x: number;
            y: number;
        }>();
    });

    it("provides model paths and lookups", () => {
        type Paths = ModelPathFromAbi<typeof sampleAbi>;
        expectTypeOf<Paths>().toEqualTypeOf<"demo-Player" | "demo-Position">();

        expectTypeOf<
            GetModel<typeof sampleAbi, "demo-Player">
        >().toEqualTypeOf<{
            id: string;
            score: number;
        }>();
    });

    it("exposes enums and actions with typed members", () => {
        type DirectionEnum = Extracted["enums"]["demo::models::Direction"];

        expectTypeOf<DirectionEnum["type"]>().toMatchTypeOf<CairoCustomEnum>();
        expectTypeOf<CairoCustomEnum>().toMatchTypeOf<DirectionEnum["type"]>();

        expectTypeOf<DirectionEnum["variantNames"]>().toEqualTypeOf<
            "Up" | "Down" | "Left" | "Right"
        >();
        expectTypeOf<keyof DirectionEnum["variants"]>().toEqualTypeOf<
            "Up" | "Down" | "Left" | "Right"
        >();

        type OptionalDirection =
            Extracted["enums"]["core::option::Option::<demo::models::Direction>"];

        expectTypeOf<OptionalDirection["type"]>().toEqualTypeOf<
            CairoOption<DirectionEnum["type"]>
        >();
        expectTypeOf<OptionalDirection["variantNames"]>().toEqualTypeOf<
            "Some" | "None"
        >();
        expectTypeOf<OptionalDirection["variants"]["Some"]>().toEqualTypeOf<
            DirectionEnum["type"]
        >();
        expectTypeOf<
            OptionalDirection["variants"]["None"]
        >().toEqualTypeOf<void>();

        type OptionalScore =
            Extracted["enums"]["core::option::Option::<core::integer::u32>"];

        expectTypeOf<OptionalScore["type"]>().toEqualTypeOf<
            CairoOption<number>
        >();
        expectTypeOf<
            OptionalScore["variants"]["Some"]
        >().toEqualTypeOf<number>();

        type Actions = ActionsFromAbi<typeof sampleAbi>;
        expectTypeOf<keyof Actions>().toEqualTypeOf<"demo">();
        expectTypeOf<keyof Actions["demo"]>().toEqualTypeOf<"IActions">();

        type Move = GetActionFunction<
            typeof sampleAbi,
            "demo",
            "IActions",
            "move"
        >;

        expectTypeOf<Move["inputs"]>().toEqualTypeOf<{
            entity: ModelsFromAbi<typeof sampleAbi>["demo"]["Position"];
            direction: DirectionEnum["type"];
        }>();
        expectTypeOf<Move["outputs"]>().toEqualTypeOf<void>();
        expectTypeOf<Move["stateMutability"]>().toEqualTypeOf<"external">();
    });
});
