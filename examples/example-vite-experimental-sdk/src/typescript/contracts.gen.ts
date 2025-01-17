import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, CairoCustomEnum } from "starknet";

export function setupWorld(provider: DojoProvider) {
    const build_actions_move_calldata = (
        direction: CairoCustomEnum
    ): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "move",
            calldata: [direction],
        };
    };

    const actions_move = async (
        snAccount: Account | AccountInterface,
        direction: CairoCustomEnum
    ) => {
        try {
            return await provider.execute(
                snAccount,
                build_actions_move_calldata(direction),
                "dojo_starter"
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const build_actions_spawn_calldata = (): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "spawn",
            calldata: [],
        };
    };

    const actions_spawn = async (snAccount: Account | AccountInterface) => {
        try {
            return await provider.execute(
                snAccount,
                build_actions_spawn_calldata(),
                "dojo_starter"
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        actions: {
            move: actions_move,
            buildMoveCalldata: build_actions_move_calldata,
            spawn: actions_spawn,
            buildSpawnCalldata: build_actions_spawn_calldata,
        },
    };
}
