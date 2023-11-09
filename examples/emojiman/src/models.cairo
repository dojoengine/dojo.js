use starknet::ContractAddress;

#[derive(Serde, Copy, Drop, Introspect)]
enum Direction {
    None,
    Left,
    Right,
    Up,
    Down,
}

impl DirectionIntoFelt252 of Into<Direction, felt252> {
    fn into(self: Direction) -> felt252 {
        match self {
            Direction::None(()) => 0,
            Direction::Left(()) => 1,
            Direction::Right(()) => 2,
            Direction::Up(()) => 3,
            Direction::Down(()) => 4,
        }
    }
}

const GAME_DATA_KEY: felt252 = 'game';

#[derive(Copy, Drop, Serde, Introspect)]
struct Vec2 {
    x: u32,
    y: u32
}

#[derive(Model, Copy, Drop, Serde)]
struct Position {
    #[key]
    id: u8,
    x: u32,
    y: u32
}

#[derive(Model, Copy, Drop, Serde)]
struct RPSType {
    #[key]
    id: u8,
    rps: u8, // one character
}

#[derive(Model, Copy, Drop, Serde)]
struct PlayerID {
    #[key]
    player: ContractAddress,
    id: u8,
}

// Three moves for the player
#[derive(Model, Copy, Drop, Serde)]
struct MovesQueue {
    #[key]
    player: ContractAddress,
    m1: Direction,
    m2: Direction,
    m3: Direction,
}

#[derive(Model, Copy, Drop, Serde)]
struct GameData {
    #[key]
    game: felt252, // Always 'game'
    number_of_players: u8,
    available_ids: u256, // Packed u8s?
}
