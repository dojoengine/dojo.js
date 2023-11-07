import { world } from "./world";
import { setup } from "./setup";
import { Account, RpcProvider } from "starknet";
import { BurnerManager } from "@dojoengine/create-burner";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
    const { components, systemCalls, network } = await setup();

    const rpcProvider = new RpcProvider({
        nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL!,
    });

    const accountClassHash = import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH!;

    // TODO: Make Burner System
    const masterAccount = new Account(
        rpcProvider,
        import.meta.env.VITE_PUBLIC_MASTER_ADDRESS!,
        import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY!
    );

    const burnerManager = new BurnerManager({
        masterAccount,
        accountClassHash,
        rpcProvider,
    });

    burnerManager.init();

    // const account = burnerManager.account || masterAccount;

    return {
        world,
        components,
        systemCalls,
        network,
        account: burnerManager,
    };
};
