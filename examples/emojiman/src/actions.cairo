use dojo_examples::models::{Direction};

// define the interface
#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState, rps: u8) -> u8;
    fn queue_moves(self: @TContractState, m1: Direction, m2: Direction, m3: Direction);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use debug::PrintTrait;
    use dojo_examples::models::{
        GAME_DATA_KEY, GameData, Direction, MovesQueue, Vec2, Position, RPSType, PlayerID,
    };
    use super::IActions;

    fn assign_player_id(world: IWorldDispatcher, id: u8, mut player: ContractAddress) {
        set!(world, (PlayerID { player, id }));
    }

    // impl: implement functions specified in trait
    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        // Spawns the player on to the map
        fn spawn(self: @ContractState, rps: u8) -> u8 {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();

            let mut game_data = get!(world, GAME_DATA_KEY, (GameData));
            game_data.number_of_players += 1;
            let id = game_data.number_of_players; // id starts at 1
            set!(world, (game_data));

            let x = 10; // Pick randomly
            let y = 10; // Pick randomly

            set!(world, (Position { id, x, y }, RPSType { id, rps }));

            assign_player_id(world, id, player);
            id
        }

        // Queues move for player to be processed later
        fn queue_moves(self: @ContractState, m1: Direction, m2: Direction, m3: Direction) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            set!(world, (MovesQueue { player, m1, m2, m3 }));
        }
    }
}

#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;
    use starknet::ContractAddress;
    use debug::PrintTrait;

    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    // import test utils
    use dojo::test_utils::{spawn_test_world, deploy_contract};

    // import models
    use dojo_examples::models::{position, rps_type, moves_queue, player_id};
    use dojo_examples::models::{Position, RPSType, Direction, PlayerID, MovesQueue, Vec2};

    // import actions
    use super::{actions, IActionsDispatcher, IActionsDispatcherTrait};


    fn init() -> (ContractAddress, IWorldDispatcher, IActionsDispatcher) {
        let caller = starknet::contract_address_const::<'jon'>();
        // This sets caller for current function, but not passed to called contract functions
        starknet::testing::set_caller_address(caller);
        // This sets caller for called contract functions.
        starknet::testing::set_contract_address(caller);
        // models
        let mut models = array![
            position::TEST_CLASS_HASH,
            rps_type::TEST_CLASS_HASH,
            moves_queue::TEST_CLASS_HASH,
            player_id::TEST_CLASS_HASH
        ];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract('actions', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions = IActionsDispatcher { contract_address };
        (caller, world, actions)
    }

    #[test]
    #[available_gas(30000000)]
    fn spawn() {
        let (caller, world, actions) = init();

        actions.spawn('r');

        // Get player ID
        let player_id = get!(world, caller, (PlayerID)).id;
        assert(1 == player_id, 'incorrect id');

        // Get player from id
        let (position, rps_type) = get!(world, player_id, (Position, RPSType));
        assert(0 < position.x, 'incorrect position.x');
        assert(0 < position.y, 'incorrect position.y');
        assert('r' == rps_type.rps, 'incorrect rps');
    }

    #[test]
    #[available_gas(30000000)]
    fn moves() {
        let (caller, world, actions) = init();

        actions.queue_moves(Direction::Up, Direction::Left, Direction::Up);

        let moves = get!(world, caller, (MovesQueue));

        let dir_up: felt252 = Direction::Up.into();
        let dir_left: felt252 = Direction::Left.into();

        assert(dir_up == moves.m1.into(), 'incorrect move m1');
        assert(dir_left == moves.m2.into(), 'incorrect move m2');
        assert(dir_up == moves.m3.into(), 'incorrect move m3');
    }
}
