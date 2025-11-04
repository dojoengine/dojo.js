import {
    ExtractAbiTypes,
    ModelsFromAbi,
    GetModel,
    GetActionFunction,
    DojoProvider,
} from "@dojoengine/core";
import { compiledAbi } from "./compiled-abi.js";
import { CairoCustomEnum } from "starknet";

export type DojoStarterAbi = ExtractAbiTypes<typeof compiledAbi>;
export type DojoStarterSchema = ModelsFromAbi<typeof compiledAbi>;

// You can get models either like this.
export type Vec2 = DojoStarterSchema["dojo_starter"]["Vec2"];
export type Pos = DojoStarterSchema["dojo_starter"]["Position"];

// Or with the `GetModel` type util
export type Position = GetModel<typeof compiledAbi, "dojo_starter-Position">;
export type Moves = GetModel<typeof compiledAbi, "dojo_starter-Moves">;
export type DirectionsAvailable = GetModel<
    typeof compiledAbi,
    "dojo_starter-DirectionsAvailable"
>;

export type DirectionEnum =
    DojoStarterAbi["enums"]["dojo_starter::models::Direction"];
export type Direction = DirectionEnum["type"];
export type DirectionVariant = DirectionEnum["variantNames"];

// enum helper
export const DirectionValue = {
    None: () => new CairoCustomEnum({ None: "()" }),
    Left: () => new CairoCustomEnum({ Left: "()" }),
    Right: () => new CairoCustomEnum({ Right: "()" }),
    Up: () => new CairoCustomEnum({ Up: "()" }),
    Down: () => new CairoCustomEnum({ Down: "()" }),
} as const;

// Here your whole system
export type DojoStarterActions =
    DojoStarterAbi["interfaces"]["dojo_starter::systems::actions::IActions"];

// You can bind your systems to DojoProvider to have automatically bind functions
// this code is commented out because we don't have account here. Account is the user wallet.
// const provider = new DojoProvider<DojoStarterActions>();
//
// provider.spawn(account);
// provider.move(account, { direction: DirectionValue.Right() });

// Or single actions type
export type SpawnAction = GetActionFunction<
    typeof compiledAbi,
    "dojo_starter",
    "IActions",
    "spawn"
>;
export type MoveAction = GetActionFunction<
    typeof compiledAbi,
    "dojo_starter",
    "IActions",
    "move"
>;

export function updatePositionWithDirection(
    direction: Direction,
    value: { vec: Vec2 }
): { vec: Vec2 } {
    const activeVariant = direction.activeVariant();
    switch (activeVariant) {
        case "Left":
            value.vec.x--;
            break;
        case "Right":
            value.vec.x++;
            break;
        case "Up":
            value.vec.y--;
            break;
        case "Down":
            value.vec.y++;
            break;
        case "None":
            break;
        default:
            throw new Error("Invalid direction provided");
    }
    return value;
}
