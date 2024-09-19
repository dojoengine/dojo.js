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

    const burner = useBurnerManager({
        burnerManager: layers.networkLayer.burnerManager,
    });

    return {
        networkLayer,
        phaserLayer,
        account: {
            ...burner,
            account: networkLayer.burnerManager.account as Account,
        },
        systemCalls: networkLayer.systemCalls,
        contractComponents: networkLayer.contractComponents,
    };
};
