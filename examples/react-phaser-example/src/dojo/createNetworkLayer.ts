import { world } from "./world";
import { setup } from "./setup";
import { Account } from "starknet";
import { createSyncManager } from "@dojoengine/react";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
    const { components, systemCalls, network } = await setup();

    return {
        world,
        components,
        systemCalls,
        network,
        account: network.burnerManager.account as Account,
        burnerManage: network.burnerManager,
    };
};
