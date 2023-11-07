import { world } from "./world";
import { setup } from "./setup";
import { Account, RpcProvider } from "starknet";

export type NetworkLayer = Awaited<ReturnType<typeof createNetworkLayer>>;

export const createNetworkLayer = async () => {
    const { components, systemCalls, network } = await setup();

    const provider = new RpcProvider({
        nodeUrl: import.meta.env.VITE_PUBLIC_NODE_URL!,
    });

    // TODO: Make Burner System
    const account = new Account(
        provider,
        import.meta.env.VITE_PUBLIC_MASTER_ADDRESS!,
        import.meta.env.VITE_PUBLIC_MASTER_PRIVATE_KEY!
    );

    return {
        world,
        components,
        systemCalls,
        network,
        account,
    };
};
