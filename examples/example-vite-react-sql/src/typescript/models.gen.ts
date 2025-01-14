import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import {
    CairoCustomEnum,
    CairoOption,
    CairoOptionVariant,
    BigNumberish,
} from "starknet";

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `dojo_starter::models::DirectionsAvailable` struct
export interface DirectionsAvailable {
    player: string;
    directions: Array<DirectionEnum>;
}

// Type definition for `dojo_starter::models::DirectionsAvailableValue` struct
export interface DirectionsAvailableValue {
    directions: Array<DirectionEnum>;
}

// Type definition for `dojo_starter::models::Moves` struct
export interface Moves {
    player: string;
    remaining: BigNumberish;
    last_direction: CairoOption<DirectionEnum>;
    can_move: boolean;
}

// Type definition for `dojo_starter::models::MovesValue` struct
export interface MovesValue {
    remaining: BigNumberish;
    last_direction: CairoOption<DirectionEnum>;
    can_move: boolean;
}

// Type definition for `dojo_starter::models::Position` struct
export interface Position {
    player: string;
    vec: Vec2;
}

// Type definition for `dojo_starter::models::PositionValue` struct
export interface PositionValue {
    vec: Vec2;
}

// Type definition for `dojo_starter::models::Vec2` struct
export interface Vec2 {
    x: BigNumberish;
    y: BigNumberish;
}

// Type definition for `dojo_starter::systems::actions::actions::Moved` struct
export interface Moved {
    player: string;
    direction: DirectionEnum;
}

// Type definition for `dojo_starter::systems::actions::actions::MovedValue` struct
export interface MovedValue {
    direction: DirectionEnum;
}

// Type definition for `dojo_starter::models::Direction` enum
export type Direction = {
    Left: string;
    Right: string;
    Up: string;
    Down: string;
};
export type DirectionEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
    dojo_starter: {
        DirectionsAvailable: WithFieldOrder<DirectionsAvailable>;
        DirectionsAvailableValue: WithFieldOrder<DirectionsAvailableValue>;
        Moves: WithFieldOrder<Moves>;
        MovesValue: WithFieldOrder<MovesValue>;
        Position: WithFieldOrder<Position>;
        PositionValue: WithFieldOrder<PositionValue>;
        Vec2: WithFieldOrder<Vec2>;
        Moved: WithFieldOrder<Moved>;
        MovedValue: WithFieldOrder<MovedValue>;
    };
}
export const schema: SchemaType = {
    dojo_starter: {
        DirectionsAvailable: {
            fieldOrder: ["player", "directions"],
            player: "",
            directions: [
                new CairoCustomEnum({
                    Left: "",
                    Right: undefined,
                    Up: undefined,
                    Down: undefined,
                }),
            ],
        },
        DirectionsAvailableValue: {
            fieldOrder: ["directions"],
            directions: [
                new CairoCustomEnum({
                    Left: "",
                    Right: undefined,
                    Up: undefined,
                    Down: undefined,
                }),
            ],
        },
        Moves: {
            fieldOrder: ["player", "remaining", "last_direction", "can_move"],
            player: "",
            remaining: 0,
            last_direction: new CairoOption(CairoOptionVariant.None),
            can_move: false,
        },
        MovesValue: {
            fieldOrder: ["remaining", "last_direction", "can_move"],
            remaining: 0,
            last_direction: new CairoOption(CairoOptionVariant.None),
            can_move: false,
        },
        Position: {
            fieldOrder: ["player", "vec"],
            player: "",
            vec: { x: 0, y: 0 },
        },
        PositionValue: {
            fieldOrder: ["vec"],
            vec: { x: 0, y: 0 },
        },
        Vec2: {
            fieldOrder: ["x", "y"],
            x: 0,
            y: 0,
        },
        Moved: {
            fieldOrder: ["player", "direction"],
            player: "",
            direction: new CairoCustomEnum({
                Left: "",
                Right: undefined,
                Up: undefined,
                Down: undefined,
            }),
        },
        MovedValue: {
            fieldOrder: ["direction"],
            direction: new CairoCustomEnum({
                Left: "",
                Right: undefined,
                Up: undefined,
                Down: undefined,
            }),
        },
    },
};
export enum ModelsMapping {
    Direction = "dojo_starter-Direction",
    DirectionsAvailable = "dojo_starter-DirectionsAvailable",
    DirectionsAvailableValue = "dojo_starter-DirectionsAvailableValue",
    Moves = "dojo_starter-Moves",
    MovesValue = "dojo_starter-MovesValue",
    Position = "dojo_starter-Position",
    PositionValue = "dojo_starter-PositionValue",
    Vec2 = "dojo_starter-Vec2",
    Moved = "dojo_starter-Moved",
    MovedValue = "dojo_starter-MovedValue",
}
