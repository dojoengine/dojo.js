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
    const actions_incrementGlobalCounter = async (
        snAccount: Account | AccountInterface
    ) => {
        try {
            return await provider.execute(
                snAccount,
                {
                    contractName: "actions",
                    entrypoint: "increment_global_counter",
                    calldata: [],
                },
                "onchain_dash"
            );
        } catch (error) {
            console.error(error);
        }
    };

    const actions_incrementCallerCounter = async (
        snAccount: Account | AccountInterface
    ) => {
        try {
            return await provider.execute(
                snAccount,
                {
                    contractName: "actions",
                    entrypoint: "increment_caller_counter",
                    calldata: [],
                },
                "onchain_dash"
            );
        } catch (error) {
            console.error(error);
        }
    };

    const actions_changeTheme = async (
        snAccount: Account | AccountInterface,
        value: CairoCustomEnum
    ) => {
        try {
            return await provider.execute(
                snAccount,
                {
                    contractName: "actions",
                    entrypoint: "change_theme",
                    calldata: [value],
                },
                "onchain_dash"
            );
        } catch (error) {
            console.error(error);
        }
    };

    return {
        actions: {
            incrementGlobalCounter: actions_incrementGlobalCounter,
            incrementCallerCounter: actions_incrementCallerCounter,
            changeTheme: actions_changeTheme,
        },
    };
}
