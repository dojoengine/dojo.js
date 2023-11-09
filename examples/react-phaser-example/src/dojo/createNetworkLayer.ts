import { world } from "./world";
import { setup } from "./setup";
import { Account, RpcProvider } from "starknet";
import { BurnerManager } from "@dojoengine/create-burner";
import { SubscribeManager, SyncManager } from "@dojoengine/react";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
    const { components, systemCalls, network } = await setup();

    const rpcProvider = new RpcProvider({
        nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL!,
    });

    const masterAccount = new Account(
        rpcProvider,
        import.meta.env.VITE_PUBLIC_MASTER_ADDRESS!,
        import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY!
    );

    const burnerManager = new BurnerManager({
        masterAccount,
        accountClassHash: import.meta.env.VITE_PUBLIC_ACCOUNT_CLASS_HASH!,
        rpcProvider,
    });

    burnerManager.init();

    if (burnerManager.account) {
        // sync manager to active address
        for (let i = 1; i <= 50; i++) {
            new SyncManager(network.torii_client, [
                {
                    model: network.contractComponents.Position,
                    keys: [i],
                },
            ]);

            new SubscribeManager(network.torii_client, [
                {
                    model: network.contractComponents.Position,
                    keys: [i],
                },
            ]);
        }
    }

    return {
        world,
        components,
        systemCalls,
        network,
        account: burnerManager.account as Account,
        burnerManager,
    };
};
