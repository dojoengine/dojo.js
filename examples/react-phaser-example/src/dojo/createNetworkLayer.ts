import { world } from "./world";
import { setup } from "./setup";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
    const { components, systemCalls, network } = await setup();

    const { burnerManager, account } = network;

    return {
        world,
        components,
        systemCalls,
        network,
        account,
        burnerManager,
    };
};
