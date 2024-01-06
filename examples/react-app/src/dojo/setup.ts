import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { getSyncEntities } from "@dojoengine/react";
import { createDojoClient } from "./generated";
import manifest from "../../../dojo-starter/target/dev/manifest.json";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

/**
 * Sets up the necessary components and network utilities.
 *
 * @returns An object containing network configurations, client components, and system calls.
 */
export async function setup() {
    const {
        VITE_PUBLIC_WORLD_ADDRESS,
        VITE_PUBLIC_NODE_URL,
        VITE_PUBLIC_TORII,
    } = import.meta.env;

    // Initialize the network configuration.
    const client = await createDojoClient({
        nodeUrl: VITE_PUBLIC_NODE_URL,
        toriiUrl: VITE_PUBLIC_TORII,
        worldAddress: VITE_PUBLIC_WORLD_ADDRESS,
        manifest,
    });

    const contractComponents = defineContractComponents(world);

    // Create client components based on the network setup.
    const components = createClientComponents({ contractComponents });

    // fetch all existing entities from torii
    await getSyncEntities(client.toriiClient, contractComponents as any);

    return {
        client,
        components,
        contractComponents,
        systemCalls: createSystemCalls(client, contractComponents, components),
    };
}
