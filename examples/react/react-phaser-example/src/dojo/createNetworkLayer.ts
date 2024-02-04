import { world as recsWorld } from "./world";
import { setup } from "./generated/setup";
import { dojoConfig } from "../../dojoConfig";
import { createBurner } from "./createBurner";
import { Account } from "starknet";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
    // setup world
    const setupWorld = await setup(dojoConfig);

    // create burner and init
    const { burnerManager } = await createBurner(dojoConfig);

    return {
        ...setupWorld,
        recsWorld,
        burnerManager,
        account: burnerManager.account as Account,
    };
};
