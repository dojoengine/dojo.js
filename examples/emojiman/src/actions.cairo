use dojo_examples::models::{Direction, RPS};

const INITIAL_ENERGY: u8 = 3;
const RENEWED_ENERGY: u8 = 3;
const MOVE_ENERGY_COST: u8 = 1;

// define the interface
#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState, rps: RPS);
    fn move(self: @TContractState, dir: Direction);
    fn tick(self: @TContractState);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use debug::PrintTrait;
    use dojo_examples::models::{
        GAME_DATA_KEY, GameData, Direction, RPS, RPSPrintImpl, Vec2, Position, PlayerAtPosition,
        RPSType, Energy, PlayerID, PlayerAddress
    };
    use dojo_examples::utils::next_position;
    use super::{INITIAL_ENERGY, RENEWED_ENERGY, MOVE_ENERGY_COST, IActions};

    // region player id assignment
    fn assign_player_id(world: IWorldDispatcher, num_players: u8, player: ContractAddress) -> u8 {
        let id = num_players;
        set!(world, (PlayerID { player, id }, PlayerAddress { player, id }));
        return id;
    }

    fn clear_player_id(world: IWorldDispatcher, id: u8, mut player: ContractAddress) {
        let empty_player = starknet::contract_address_const::<0>();
        // Empty player id
        set!(world, (PlayerID { player, id: 0 }));
        // Empty player address for id
        set!(world, (PlayerAddress { player: empty_player, id }));
    }
    // endregion player id assignment

    // region player position
    fn clear_player_at_position(world: IWorldDispatcher, pos: Position) {
        let Position{id, x, y } = pos;
        // Set no player at position
        set!(world, (PlayerAtPosition { x, y, id: 0 }));
    }

    fn player_at_position(world: IWorldDispatcher, x: u8, y: u8) -> u8 {
        get!(world, (x, y), (PlayerAtPosition)).id
    }
    // endregion player position

    // region game ops
    fn player_position_and_energy(world: IWorldDispatcher, id: u8, x: u8, y: u8, amt: u8) {
        set!(world, (PlayerAtPosition { x, y, id }, Position { x, y, id }, Energy { id, amt },));
    }

    fn player_died(world: IWorldDispatcher, id: u8) {
        let pos = get!(world, id, (Position));
        clear_player_at_position(world, pos);
        let Position{id, x, y } = pos;

        set!(world, (Position { id, x: 0, y: 0 }, Energy { id, amt: 0 },));
    }

    // panics if players are of same type (move cancelled)
    // if the player dies returns false
    // if the player kills the other player returns true
    fn encounter(world: IWorldDispatcher, player: u8, adversary: u8) -> bool {
        let adv_type = get!(world, adversary, (RPSType)).rps;
        let ply_type = get!(world, adversary, (RPSType)).rps;
        encounter_type(ply_type, adv_type)
    }

    fn encounter_type(ply_type: RPS, adv_type: RPS) -> bool {
        assert(adv_type != ply_type, 'occupied by same type');
        if (ply_type == RPS::Rock && adv_type == RPS::Scissors)
            || (ply_type == RPS::Paper && adv_type == RPS::Rock)
            || (ply_type == RPS::Scissors && adv_type == RPS::Paper) {
            return true;
        }
        false
    }
    // endregion game ops

    // impl: implement functions specified in trait
    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        // Spawns the player on to the map
        fn spawn(self: @ContractState, rps: RPS) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();

            let mut game_data = get!(world, GAME_DATA_KEY, (GameData));
            game_data.number_of_players += 1;
            let number_of_players = game_data.number_of_players; // id starts at 1
            set!(world, (game_data));

            let id = assign_player_id(world, number_of_players, player);

            set!(world, (RPSType { id, rps }));

            let x = 10; // Pick randomly
            let y = 10; // Pick randomly
            player_position_and_energy(world, id, x, y, INITIAL_ENERGY);
        }

        // Queues move for player to be processed later
        fn move(self: @ContractState, dir: Direction) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();

            // player id
            let id = get!(world, player, (PlayerID)).id;

            let (pos, energy) = get!(world, id, (Position, Energy));

            // assert(energy.amt > MOVE_ENERGY_COST, 'Not enough energy');

            // Clear old position
            clear_player_at_position(world, pos);

            let Position{id, x, y } = next_position(pos, dir);

            let adversary = player_at_position(world, x, y);
            if 0 == adversary {
                // Empty cell, move
                player_position_and_energy(world, id, x, y, energy.amt - MOVE_ENERGY_COST);
            } else {
                if encounter(world, id, adversary) {
                    // Move the player
                    player_position_and_energy(world, id, x, y, energy.amt - MOVE_ENERGY_COST);
                }
            }
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
    use dojo_examples::models::{
        position, player_at_position, rps_type, energy, player_id, player_address,
    };
    use dojo_examples::models::{
        Position, RPSType, Energy, Direction, RPS, RPSPrintImpl, Vec2, PlayerAtPosition, PlayerID,
        PlayerAddress,
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
            player_id::TEST_CLASS_HASH,
            player_address::TEST_CLASS_HASH,
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

        actions.spawn(RPS::Rock);

        // Get player ID
        let player_id = get!(world, caller, (PlayerID)).id;
        assert(1 == player_id, 'incorrect id');

        // Get player from id
        let (position, rps_type, energy) = get!(world, player_id, (Position, RPSType, Energy));
        assert(0 < position.x, 'incorrect position.x');
        assert(0 < position.y, 'incorrect position.y');
        assert(RPS::Rock == rps_type.rps, 'incorrect rps');
        assert(INITIAL_ENERGY == energy.amt, 'incorrect energy');
    }

    #[test]
    #[available_gas(30000000)]
    fn moves_test() {
        let (caller, world, actions) = init();

        actions.spawn(RPS::Rock);

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

        actions_.spawn(RPS::Rock);

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

    use RPS::{Rock, Paper, Scissors};

    #[test]
    #[available_gas(30000000)]
    fn encounter_test() {
        let (caller, world, actions_) = init();
        assert(false == actions::encounter_type(RPS::Rock, RPS::Paper), 'R v P should lose');
        assert(true == actions::encounter_type(RPS::Rock, RPS::Scissors), 'R v S should win');
        assert(false == actions::encounter_type(RPS::Scissors, RPS::Rock), 'S v R should lose');
        assert(true == actions::encounter_type(RPS::Scissors, RPS::Paper), 'S v P should win');
        assert(false == actions::encounter_type(RPS::Paper, RPS::Scissors), 'P v S should lose');
        assert(true == actions::encounter_type(RPS::Paper, RPS::Rock), 'P v R should win');
    }

    #[test]
    #[available_gas(2000000)]
    #[should_panic()]
    fn encounter_rock_tie_panic() {
        actions::encounter_type(RPS::Rock, RPS::Rock);
    }

    #[test]
    #[available_gas(2000000)]
    #[should_panic()]
    fn encounter_paper_tie_panic() {
        actions::encounter_type(RPS::Paper, RPS::Paper);
    }

    #[test]
    #[available_gas(2000000)]
    #[should_panic()]
    fn encounter_scissor_tie_panic() {
        actions::encounter_type(RPS::Scissors, RPS::Scissors);
    }
}
