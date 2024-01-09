import { BurnerManager } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";

import { Config } from "../../dojoConfig";

export type CreateBurner = Awaited<ReturnType<typeof createBurner>>;

export const createBurner = async ({ ...config }: Config) => {
    const rpcProvider = new RpcProvider({
        nodeUrl: config.rpcUrl,
    });

    const burnerManager = new BurnerManager({
        masterAccount: new Account(
            rpcProvider,
            config.masterAddress,
            config.masterPrivateKey
        ),
        accountClassHash: config.accountClassHash,
        rpcProvider,
    });

    try {
        await burnerManager.create();
    } catch (e) {
        console.log(e);
    }

    burnerManager.init();

    return {
        burnerManager,
    };
};
