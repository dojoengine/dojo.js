import { BurnerManager } from "@dojoengine/create-burner";
import { Account, RpcProvider } from "starknet";

import { Config } from "../../dojoConfig";

export type CreateBurner = Awaited<ReturnType<typeof createBurner>>;

export const createBurner = async ({ ...config }: Config) => {
    const rpcProvider = new RpcProvider({
        nodeUrl: config.rpcUrl,
    });

    const masterAccount = new Account(
        rpcProvider,
        config.masterAddress,
        config.masterPrivateKey
    );

    const burnerManager = new BurnerManager({
        masterAccount,
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
        account: burnerManager.account as Account,
        burnerManager,
    };
};
