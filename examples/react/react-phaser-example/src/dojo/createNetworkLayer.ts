import { world } from "./world";
import { setup } from "./generated/setup";
import { dojoConfig } from "../../dojoConfig";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
    const { clientComponents, systemCalls, client, contractComponents } =
        await setup(dojoConfig());

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
