import { DojoConfig } from "@dojoengine/core";
import { RpcProvider } from "starknet";
import { BurnerManager, newAccount } from "..";

export const setupBurnerManager = async (config: DojoConfig) => {
    const burnerManager = new BurnerManager({
        masterAccount: newAccount(
            {
                nodeUrl: config.rpcUrl,
            },
            config.masterAddress,
            config.masterPrivateKey,
            "1"
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
