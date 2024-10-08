import { DojoConfig } from "@dojoengine/core";
import { Account, RpcProvider } from "starknet";
import { BurnerManager } from "..";

export const setupBurnerManager = async (config: DojoConfig) => {
    const burnerManager = new BurnerManager({
        masterAccount: new Account(
            {
                nodeUrl: config.rpcUrl,
            },
            config.masterAddress,
            config.masterPrivateKey
        ),
        accountClassHash: config.accountClassHash,
        rpcProvider: new RpcProvider({ nodeUrl: config.rpcUrl }),
        feeTokenAddress: config.feeTokenAddress,
    });

    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            await burnerManager.create();
        }
    } catch (e) {
        console.error("Failed to initialize or create burner account:", e);
    }

    return burnerManager;
};
