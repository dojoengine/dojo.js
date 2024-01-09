import { Account } from "starknet";
import { store } from "../../store";
import { useBurnerManager } from "@dojoengine/create-burner";

export const useDojo = () => {
    const layers = store((state) => {
        return {
            networkLayer: state.networkLayer,
            phaserLayer: state.phaserLayer,
        };
    });

    if (!layers.phaserLayer || !layers.networkLayer) {
        throw new Error("Store not initialized");
    }

    const { networkLayer, phaserLayer } = layers;

    const { get, create, select, list, isDeploying, clear } = useBurnerManager({
        burnerManager: layers.networkLayer.burnerManager,
    });

    return {
        networkLayer,
        phaserLayer,
        account: {
            account: networkLayer.burnerManager.account as Account,
            get,
            create,
            select,
            list,
            clear,
            isDeploying,
        },
        systemCalls: networkLayer.systemCalls,
        contractComponents: networkLayer.network.contractComponents,
    };
};
