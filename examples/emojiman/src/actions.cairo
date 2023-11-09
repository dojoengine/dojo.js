use dojo_examples::models::{Direction};

const INITIAL_ENERGY: u8 = 3;
const RENEWED_ENERGY: u8 = 3;
const MOVE_ENERGY_COST: u8 = 1;

// define the interface
#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState, rps: u8) -> u8;
    fn move(self: @TContractState, dir: Direction);
    fn tick(self: @TContractState);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use debug::PrintTrait;
    use dojo_examples::models::{
        GAME_DATA_KEY, GameData, Direction, Vec2, Position, PlayerAtPosition, RPSType, Energy,
        PlayerID,
    };
    use dojo_examples::utils::next_position;
    use super::{INITIAL_ENERGY, RENEWED_ENERGY, MOVE_ENERGY_COST, IActions};

    fn assign_player_id(world: IWorldDispatcher, id: u8, mut player: ContractAddress) {
        set!(world, (PlayerID { player, id }));
    }

    fn clear_player_position(world: IWorldDispatcher, pos: Position) {
        let Position{id, x, y } = pos;
        // Set no player at position
        set!(world, (PlayerAtPosition { x, y, id: 0 }));
    }

    fn player_at_position(world: IWorldDispatcher, x: u8, y: u8) -> u8 {
        get!(world, (x, y), (PlayerAtPosition)).id
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

            set!(
                world,
                (
                    Position { id, x, y },
                    PlayerAtPosition { id, x, y },
                    RPSType { id, rps },
                    Energy { id, amt: INITIAL_ENERGY },
                )
            );

            assign_player_id(world, id, player);
            id
        }

        // Queues move for player to be processed later
        fn move(self: @ContractState, dir: Direction) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();

            // player id
            let id = get!(world, player, (PlayerID)).id;

            let (pos, energy) = get!(world, id, (Position, Energy));

            assert(energy.amt > MOVE_ENERGY_COST, 'Not enough energy');

            clear_player_position(world, pos);

            let Position{id, x, y } = next_position(pos, dir);

            set!(
                world,
                (
                    Position { id, x, y },
                    PlayerAtPosition { id, x, y },
                    Energy { id, amt: energy.amt - MOVE_ENERGY_COST },
                )
            );
        }

        // Process player move queues
        // @TODO do the killing
        // @TODO update player entities
        // @TODO keep score
        fn tick(self: @ContractState) {}
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
    use dojo_examples::models::{position, player_at_position, rps_type, player_id, energy};
    use dojo_examples::models::{
        Position, RPSType, Energy, Direction, PlayerID, Vec2, PlayerAtPosition
    };

    // import actions
    use super::{actions, IActionsDispatcher, IActionsDispatcherTrait};
    use super::{INITIAL_ENERGY, RENEWED_ENERGY, MOVE_ENERGY_COST};

    fn init() -> (ContractAddress, IWorldDispatcher, IActionsDispatcher) {
        let caller = starknet::contract_address_const::<'jon'>();
        // This sets caller for current function, but not passed to called contract functions
        starknet::testing::set_caller_address(caller);
        // This sets caller for called contract functions.
        starknet::testing::set_contract_address(caller);
        // models
        let mut models = array![
            player_at_position::TEST_CLASS_HASH,
            position::TEST_CLASS_HASH,
            energy::TEST_CLASS_HASH,
            rps_type::TEST_CLASS_HASH,
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
    fn spawn_test() {
        let (caller, world, actions) = init();

        actions.spawn('r');

        // Get player ID
        let player_id = get!(world, caller, (PlayerID)).id;
        assert(1 == player_id, 'incorrect id');

        // Get player from id
        let (position, rps_type, energy) = get!(world, player_id, (Position, RPSType, Energy));
        assert(0 < position.x, 'incorrect position.x');
        assert(0 < position.y, 'incorrect position.y');
        assert('r' == rps_type.rps, 'incorrect rps');
        assert(INITIAL_ENERGY == energy.amt, 'incorrect energy');
    }

    #[test]
    #[available_gas(30000000)]
    fn moves_test() {
        let (caller, world, actions) = init();

        actions.spawn('r');

        // Get player ID
        let player_id = get!(world, caller, (PlayerID)).id;
        assert(1 == player_id, 'incorrect id');

        let (spawn_pos, spawn_energy) = get!(world, player_id, (Position, Energy));

        actions.move(Direction::Up);
        // Get player from id
        let (pos, energy) = get!(world, player_id, (Position, Energy));

        assert(energy.amt == spawn_energy.amt - MOVE_ENERGY_COST, 'incorrect energy');
        assert(spawn_pos.x == pos.x, 'incorrect position.x');
        assert(spawn_pos.y - 1 == pos.y, 'incorrect position.y');
    }

    #[test]
    #[available_gas(30000000)]
    fn player_at_position_test() {
        let (caller, world, actions_) = init();

        actions_.spawn('r');

        // Get player ID
        let player_id = get!(world, caller, (PlayerID)).id;

        // Get player position
        let Position{x, y, id } = get!(world, player_id, Position);

        // Player should be at position
        assert(actions::player_at_position(world, x, y) == player_id, 'player should be at pos');

        // Player moves
        actions_.move(Direction::Up);

        // Player shouldn't be at old position
        assert(actions::player_at_position(world, x, y) == 0, 'player should not be at pos');

        // Get new player position
        let Position{x, y, id } = get!(world, player_id, Position);

        // Player should be at new position
        assert(actions::player_at_position(world, x, y) == player_id, 'player should be at pos');
    }
}
