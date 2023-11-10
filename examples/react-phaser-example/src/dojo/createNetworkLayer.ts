import { world } from "./world";
import { setup } from "./setup";
import { Account } from "starknet";
import { createSyncManager } from "@dojoengine/react";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
    const { components, systemCalls, network } = await setup();

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
            models.push({
                model: network.contractComponents.PlayerID,
                keys: [i.toString()],
            });
            models.push({
                model: network.contractComponents.Energy,
                keys: [i.toString()],
            });
        }

        return models;
    };

    const { sync } = createSyncManager(network.torii_client, initial_sync());

    sync();

    return {
        world,
        components,
        systemCalls,
        network,
        account: network.burnerManager.account as Account,
        burnerManage: network.burnerManager,
    };
};
