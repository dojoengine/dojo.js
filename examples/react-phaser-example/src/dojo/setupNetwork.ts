import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider } from "@dojoengine/core";
import { Account, num } from "starknet";
import dev_manifest from "../../../dojo-starter/target/dev/manifest.json";
import * as torii from "@dojoengine/torii-client";
import { createBurner } from "./createBurner";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {
    const {
        VITE_PUBLIC_WORLD_ADDRESS,
        VITE_PUBLIC_NODE_URL,
        VITE_PUBLIC_TORII,
    } = import.meta.env;

    const provider = new RPCProvider(
        VITE_PUBLIC_WORLD_ADDRESS,
        dev_manifest,
        VITE_PUBLIC_NODE_URL
    );

    const toriiClient = await torii.createClient([], {
        rpcUrl: VITE_PUBLIC_NODE_URL,
        toriiUrl: VITE_PUBLIC_TORII,
        worldAddress: VITE_PUBLIC_WORLD_ADDRESS,
    });

    const { account, burnerManager } = await createBurner();

    return {
        // dojo provider from core
        provider,

        // recs world
        world,

        toriiClient,
        account,
        burnerManager,

        // Define contract components for the world.
        contractComponents: defineContractComponents(world),

        // Execute function.
        execute: async (
            signer: Account,
            contract: string,
            system: string,
            call_data: num.BigNumberish[]
        ) => {
            return provider.execute(signer, contract, system, call_data);
        },
    };
}
