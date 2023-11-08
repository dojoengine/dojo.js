import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";
import { store } from "../store/store";
import { useBurnerManager } from "@dojoengine/create-burner";

export type UIStore = ReturnType<typeof useDojo>;

export const useDojo = () => {
    const { networkLayer, phaserLayer } = store();

    if (phaserLayer === null || networkLayer === null) {
        throw new Error("Store not initialized");
    }

    const { account, get, create, select, list, isDeploying, clear } =
        useBurnerManager({
            burnerManager: networkLayer.account,
        });

    return {
        networkLayer: networkLayer as NetworkLayer,
        phaserLayer: phaserLayer as PhaserLayer,
        account: {
            account: account ? account : networkLayer.account.masterAccount,
            get,
            create,
            select,
            list,
            clear,
            isDeploying,
        },
        systemCalls: networkLayer.systemCalls,
    };
};
