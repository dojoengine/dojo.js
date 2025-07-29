import type { DojoCall, DojoProvider } from "@dojoengine/core";
import type { Account, AccountInterface, CairoCustomEnum } from "starknet";

export function setupWorld(provider: DojoProvider) {
    const build_actions_changeTheme_calldata = (
        value: CairoCustomEnum
    ): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "change_theme",
            calldata: [value],
        };
    };

    const actions_changeTheme = async (
        snAccount: Account | AccountInterface,
        value: CairoCustomEnum
    ) => {
        try {
            return await provider.execute(
                snAccount,
                build_actions_changeTheme_calldata(value),
                "onchain_dash"
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const build_actions_incrementCallerCounter_calldata = (): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "increment_caller_counter",
            calldata: [],
        };
    };

    const actions_incrementCallerCounter = async (
        snAccount: Account | AccountInterface
    ) => {
        try {
            return await provider.execute(
                snAccount,
                build_actions_incrementCallerCounter_calldata(),
                "onchain_dash"
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const build_actions_incrementGlobalCounter_calldata = (): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "increment_global_counter",
            calldata: [],
        };
    };

    const actions_incrementGlobalCounter = async (
        snAccount: Account | AccountInterface
    ) => {
        try {
            return await provider.execute(
                snAccount,
                build_actions_incrementGlobalCounter_calldata(),
                "onchain_dash"
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    return {
        actions: {
            changeTheme: actions_changeTheme,
            buildChangeThemeCalldata: build_actions_changeTheme_calldata,
            incrementCallerCounter: actions_incrementCallerCounter,
            buildIncrementCallerCounterCalldata:
                build_actions_incrementCallerCounter_calldata,
            incrementGlobalCounter: actions_incrementGlobalCounter,
            buildIncrementGlobalCounterCalldata:
                build_actions_incrementGlobalCounter_calldata,
        },
    };
}
