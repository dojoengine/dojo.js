import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { type BigNumberish, CairoOption, CairoOptionVariant } from "starknet";

// Type definition for `dojo_starter::models::DirectionsAvailable` struct
export type DirectionsAvailable = {
    player: string;
    directions: Array<Direction>;
};

// Type definition for `dojo_starter::models::DirectionsAvailableValue` struct
export type DirectionsAvailableValue = {
    directions: Array<Direction>;
};

// Type definition for `dojo_starter::models::Moves` struct
export type Moves = {
    player: string;
    remaining: BigNumberish;
    last_direction: CairoOption<Direction>;
    can_move: boolean;
};

// Type definition for `dojo_starter::models::MovesValue` struct
export type MovesValue = {
    remaining: BigNumberish;
    last_direction: CairoOption<Direction>;
    can_move: boolean;
};

// Type definition for `dojo_starter::models::Position` struct
export type Position = {
    player: string;
    vec: Vec2;
};

// Type definition for `dojo_starter::models::PositionValue` struct
export type PositionValue = {
    vec: Vec2;
};

// Type definition for `dojo_starter::models::Vec2` struct
export type Vec2 = {
    x: BigNumberish;
    y: BigNumberish;
};

// Type definition for `dojo_starter::systems::actions::actions::Moved` struct
export type Moved = {
    player: string;
    direction: Direction;
};

// Type definition for `dojo_starter::systems::actions::actions::MovedValue` struct
export type MovedValue = {
    direction: Direction;
};

// Type definition for `dojo_starter::models::Direction` enum
export enum Direction {
    Left,
    Right,
    Up,
    Down,
}

export type SchemaType = ISchemaType & {
    dojo_starter: {
        DirectionsAvailable: DirectionsAvailable;
        DirectionsAvailableValue: DirectionsAvailableValue;
        Moves: Moves;
        MovesValue: MovesValue;
        Position: Position;
        PositionValue: PositionValue;
        Vec2: Vec2;
        Moved: Moved;
        MovedValue: MovedValue;
    };
};
export const schema: SchemaType = {
    dojo_starter: {
        DirectionsAvailable: {
            player: "",
            directions: [Direction.Left],
        },
        DirectionsAvailableValue: {
            directions: [Direction.Left],
        },
        Moves: {
            player: "",
            remaining: 0,
            last_direction: new CairoOption(CairoOptionVariant.None),
            can_move: false,
        },
        MovesValue: {
            remaining: 0,
            last_direction: new CairoOption(CairoOptionVariant.None),
            can_move: false,
        },
        Position: {
            player: "",
            vec: { x: 0, y: 0 },
        },
        PositionValue: {
            vec: { x: 0, y: 0 },
        },
        Vec2: {
            x: 0,
            y: 0,
        },
        Moved: {
            player: "",
            direction: Direction.Left,
        },
        MovedValue: {
            direction: Direction.Left,
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
