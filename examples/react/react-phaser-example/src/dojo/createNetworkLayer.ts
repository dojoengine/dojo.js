import { world } from "./world";
import { setup } from "./generated/setup";
import { dojoConfig } from "../../dojoConfig";
import { createBurner } from "./createBurner";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
    const { clientComponents, systemCalls, contractComponents } =
        await setup(dojoConfig());

    // create burner
    const { account, burnerManager } = await createBurner(dojoConfig());

    return {
        world,
        clientComponents,
        contractComponents,
        systemCalls,
        burnerManager,
        account,
    };
};
