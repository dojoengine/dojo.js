/**
 * Interface representing a player's movement capabilities and state.
 */
interface Moves {
    /** Order of fields in the model */
    fieldOrder: string[];
    /** Player identifier */
    player: string;
    /** Number of moves remaining */
    remaining: number;
    /** Last direction moved */
    last_direction: Direction;
    /** Whether the player can currently move */
    can_move: boolean;
}

/**
 * Interface representing available movement directions for a player.
 */
interface DirectionsAvailable {
    /** Order of fields in the model */
    fieldOrder: string[];
    /** Player identifier */
    player: string;
    /** List of available directions */
    directions: Direction[];
}

/**
 * Interface representing a player's position in the game world.
 */
interface Position {
    /** Order of fields in the model */
    fieldOrder: string[];
    /** Player identifier */
    player: string;
    /** 2D vector representing position */
    vec: Vec2;
}

/**
 * Enum representing possible movement directions.
 */
enum Direction {
    None = "0",
    Left = "1",
    Right = "2",
    Up = "3",
    Down = "4",
}

/**
 * Interface representing a 2D vector.
 */
interface Vec2 {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
}

/**
 * Type representing the complete schema of game models.
 */
type Schema = {
    dojo_starter: {
        Moves: Moves;
        DirectionsAvailable: DirectionsAvailable;
        Position: Position;
    };
};

/**
 * Enum representing model identifiers in the format "namespace-modelName".
 */
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
