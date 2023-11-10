import { Account } from "starknet";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";
import { store } from "../store/store";
import { useBurnerManager } from "@dojoengine/create-burner";

export const useDojo = () => {
    const { networkLayer, phaserLayer } = store();

    if (phaserLayer === null || networkLayer === null) {
        throw new Error("Store not initialized");
    }

    const { account, get, create, select, list, isDeploying, clear } =
        useBurnerManager({
            burnerManager: networkLayer.burnerManage,
        });

    return {
        networkLayer: networkLayer as NetworkLayer,
        phaserLayer: phaserLayer as PhaserLayer,
        account: {
            account: account as Account,
            get,
            create,
            select,
            list,
            clear,
            isDeploying,
        },
        systemCalls: networkLayer.systemCalls,
        toriiClient: networkLayer.network.torii_client,
        contractComponents: networkLayer.network.contractComponents,
    };
};
