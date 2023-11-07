import { Account, RpcProvider } from "starknet";
import { NetworkLayer } from "../dojo/createNetworkLayer";
import { PhaserLayer } from "../phaser";
import { store } from "../store/store";
import { useBurner } from "@dojoengine/create-burner";

export type UIStore = ReturnType<typeof useDojo>;

export const useDojo = () => {
    const { networkLayer, phaserLayer } = store();

    const provider = new RpcProvider({
        nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL,
    });

    // todo: allow connection with wallet providers
    const masterAccount = new Account(provider, import.meta.env.VITE_PUBLIC_MASTER_ADDRESS!, import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY!)
    
    const { create, list, get, account, select, isDeploying } = useBurner();

    if (phaserLayer === null) {
        throw new Error("Store not initialized");
    }

    return {
        networkLayer: networkLayer as NetworkLayer,
        phaserLayer: phaserLayer as PhaserLayer,
        account: {
            create,
            list,
            get,
            account: account ? account : masterAccount,
            select,
            isDeploying
        }
    }
};