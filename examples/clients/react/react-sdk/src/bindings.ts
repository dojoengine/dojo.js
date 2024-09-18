interface Moves {
    player: string;
    remaining: number;
    last_direction: Direction;
    can_move: boolean;
}

interface DirectionsAvailable {
    player: string;
    directions: Direction[];
}

interface Position {
    player: string;
    vec: Vec2;
}

enum Direction {
    None,
    Left,
    Right,
    Up,
    Down,
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

export type { Schema, Moves, DirectionsAvailable, Position, Vec2 };
export { Direction };
