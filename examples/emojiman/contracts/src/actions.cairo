use dojo_examples::models::{Direction};

// define the interface
#[starknet::interface]
trait IActions<TContractState> {
    fn spawn(self: @TContractState, rps: u8) -> u8;
}

// dojo decorator
#[dojo::contract]
mod actions {
    use starknet::{ContractAddress, get_caller_address};
    use debug::PrintTrait;
    use dojo_examples::models::{GAME_DATA_KEY, GameData, Direction, Vec2, Player};
    use super::IActions;

    // impl: implement functions specified in trait
    #[external(v0)]
    impl ActionsImpl of IActions<ContractState> {
        // ContractState is defined by system decorator expansion
        fn spawn(self: @ContractState, rps: u8) -> u8 {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            player.print();
            let position = Vec2 { x: 10, y: 10 };

            let mut game_data = get!(world, GAME_DATA_KEY, (GameData));
            game_data.number_of_players += 1;
            let id = game_data.number_of_players; // id starts at 1
            set!(world, (game_data));

            set!(world, (Player { id, player, position, energy: 100, rps }));

            id
        }
    }
}

#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;
    use debug::PrintTrait;

    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    // import test utils
    use dojo::test_utils::{spawn_test_world, deploy_contract};

    // import models
    use dojo_examples::models::{player};
    use dojo_examples::models::{Player, Direction, Vec2};

    // import actions
    use super::{actions, IActionsDispatcher, IActionsDispatcherTrait};

    #[test]
    #[available_gas(30000000)]
    fn test() {
        // caller
        let caller = starknet::contract_address_const::<'jon'>();
        // This sets caller for current function, but not passed to called contract functions
        // starknet::testing::set_caller_address(caller);
        // This sets caller for called contract functions.
        starknet::testing::set_contract_address(caller);
        // models
        let mut models = array![];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract('actions', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        actions_system.spawn('r');

        let p = get!(world, 1, (Player));

        assert(1 == p.id, 'incorrect id');
        assert(caller == p.player, 'incorrect player');
        assert(10 == p.position.x, 'incorrect position.x');
        assert(10 == p.position.y, 'incorrect position.y');
        assert(100 == p.energy, 'incorrect energy');
        assert('r' == p.rps, 'incorrect rps');
    }
}
