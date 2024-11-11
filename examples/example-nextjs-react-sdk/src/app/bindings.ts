interface Moves {
    fieldOrder: string[];
    player: string;
    remaining: number;
    last_direction: Direction;
    can_move: boolean;
}

interface DirectionsAvailable {
    fieldOrder: string[];
    player: string;
    directions: Direction[];
}

interface Position {
    fieldOrder: string[];
    player: string;
    vec: Vec2;
}

enum Direction {
    None = "0",
    Left = "1",
    Right = "2",
    Up = "3",
    Down = "4",
}

interface Vec2 {
    x: number;
    y: number;
}

type Schema = {
    dojo_starter: {
        Moves: Moves;
        DirectionsAvailable: DirectionsAvailable;
        Position: Position;
    };
};

enum Models {
    Moves = "dojo_starter-Moves",
    DirectionsAvailable = "dojo_starter-DirectionsAvailable",
    Position = "dojo_starter-Position",
}

const schema: Schema = {
    dojo_starter: {
        Moves: {
            fieldOrder: ["player", "remaining", "last_direction", "can_move"],
            player: "",
            remaining: 0,
            last_direction: Direction.None,
            can_move: false,
        },
        DirectionsAvailable: {
            fieldOrder: ["player", "directions"],
            player: "",
            directions: [],
        },
        Position: {
            fieldOrder: ["player", "vec"],
            player: "",
            vec: { x: 0, y: 0 },
        },
    },
};

export type { Schema, Moves, DirectionsAvailable, Position, Vec2 };
export { Direction, schema, Models };
