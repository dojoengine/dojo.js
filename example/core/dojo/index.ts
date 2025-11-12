//
export { setup, type SetupResult } from "./generated/setup";
export {
    createClientComponents,
    type ClientComponents,
} from "./createClientComponents";
export { createSystemCalls, type SystemCalls } from "./createSystemCalls";
export {
    Direction,
    DirectionValue,
    updatePositionWithDirection,
} from "../types";
export type {
    Vec2,
    Position,
    Moves,
    DirectionsAvailable,
    DirectionVariant,
    SpawnAction,
    MoveAction,
} from "../types";
export { dojoConfig } from "./config";
export type { ContractComponents } from "./generated/contractComponents";
