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
            rpcProvider,
            config.masterAddress,
            config.masterPrivateKey,
            "1"
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
