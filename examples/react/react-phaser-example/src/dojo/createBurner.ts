import { DojoConfig } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";

export type CreateBurner = Awaited<ReturnType<typeof createBurner>>;

export const createBurner = async ({ ...config }: DojoConfig) => {
    const rpcProvider = new RpcProvider({
        nodeUrl: config.rpcUrl,
    });

    const burnerManager = new BurnerManager({
        masterAccount: new Account(
            {
                nodeUrl: config.rpcUrl,
            },
            config.masterAddress,
            config.masterPrivateKey
        ),
        accountClassHash: config.accountClassHash,
        rpcProvider: rpcProvider,
        feeTokenAddress: config.feeTokenAddress,
    });
    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            await burnerManager.create();
        }
    } catch (e) {
        console.error(e);
    }

    return {
        burnerManager,
    };
};
