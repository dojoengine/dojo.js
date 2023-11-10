use starknet::ContractAddress;
use debug::PrintTrait;

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

#[derive(Serde, Copy, Drop, PartialEq, Introspect)]
enum RPS {
    Rock,
    Paper,
    Scissors
}

impl RPSPrintImpl of PrintTrait<RPS> {
    fn print(self: RPS) {
        match self {
            RPS::Rock => 'Rock'.print(),
            RPS::Paper => 'Paper'.print(),
            RPS::Scissors => 'Scissors'.print(),
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
struct PlayerAtPosition {
    #[key]
    x: u8,
    #[key]
    y: u8,
    id: u8,
}

#[derive(Model, Copy, Drop, Serde)]
struct Position {
    #[key]
    id: u8,
    x: u8,
    y: u8
}

#[derive(Model, Copy, Drop, Serde)]
struct RPSType {
    #[key]
    id: u8,
    rps: RPS,
}

#[derive(Model, Copy, Drop, Serde)]
struct Energy {
    #[key]
    id: u8,
    amt: u8,
}

#[derive(Model, Copy, Drop, Serde)]
struct PlayerID {
    #[key]
    player: ContractAddress,
    id: u8,
}

#[derive(Model, Copy, Drop, Serde)]
struct PlayerAddress {
    #[key]
    id: u8,
    player: ContractAddress,
}

#[derive(Model, Copy, Drop, Serde)]
struct GameData {
    #[key]
    game: felt252, // Always 'game'
    number_of_players: u8,
    available_ids: u256, // Packed u8s?
}
