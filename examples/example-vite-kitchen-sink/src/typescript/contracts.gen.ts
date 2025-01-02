import { DojoProvider } from "@dojoengine/core";
import {
    Account,
    AccountInterface,
    BigNumberish,
    CairoOption,
    CairoCustomEnum,
    ByteArray,
} from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {
    const build_actions_incrementGlobalCounter_calldata = () => {
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

    const build_actions_incrementCallerCounter_calldata = () => {
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

    const build_actions_changeTheme_calldata = (value: CairoCustomEnum) => {
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

    return {
        actions: {
            incrementGlobalCounter: actions_incrementGlobalCounter,
            buildIncrementGlobalCounterCalldata:
                build_actions_incrementGlobalCounter_calldata,
            incrementCallerCounter: actions_incrementCallerCounter,
            buildIncrementCallerCounterCalldata:
                build_actions_incrementCallerCounter_calldata,
            changeTheme: actions_changeTheme,
            buildChangeThemeCalldata: build_actions_changeTheme_calldata,
        },
    };
}
