import { world } from "./world";
import { setup } from "./setup";
import { Account, RpcProvider } from "starknet";
import { BurnerManager } from "@dojoengine/create-burner";
import { createSyncManager } from "@dojoengine/react";

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

    const initial_sync = () => {
        const models: any = [];

        for (let i = 1; i <= 20; i++) {
            models.push({
                model: network.contractComponents.Position,
                keys: [i.toString()],
            });
            models.push({
                model: network.contractComponents.RPSType,
                keys: [i.toString()],
            });
        }

        return models;
    };

    const { sync, cleanup } = await createSyncManager(
        network.torii_client,
        initial_sync()
    );

    sync();

    return {
        world,
        components,
        systemCalls,
        network,
        account: burnerManager.account as Account,
        burnerManager,
        sync,
    };
};
