//
export { setup, type SetupResult } from "./generated/setup.js";
export {
    createClientComponents,
    type ClientComponents,
} from "./createClientComponents.js";
export { createSystemCalls, type SystemCalls } from "./createSystemCalls.js";
export {
    Direction,
    DirectionValue,
    updatePositionWithDirection,
} from "../types.js";
export type {
    Vec2,
    Position,
    Moves,
    DirectionsAvailable,
    DirectionVariant,
    SpawnAction,
    MoveAction,
} from "../types.js";
export { dojoConfig } from "./config.js";
export type { ContractComponents } from "./generated/contractComponents.js";
