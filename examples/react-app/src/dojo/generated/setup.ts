import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { getSyncEntities } from "@dojoengine/react";
import { dojoClient } from "./generated";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({
    rpcUrl,
    toriiUrl,
    manifest,
}: {
    rpcUrl: string;
    toriiUrl: string;
    manifest: any;
}) {
    // Initialize the network configuration.
    const client = await dojoClient({
        rpcUrl,
        toriiUrl,
        manifest,
    });

    const contractComponents = defineContractComponents(world);

    // Create client components
    const components = createClientComponents({ contractComponents });

    // Fetch all existing entities from torii
    await getSyncEntities(client.toriiClient, contractComponents as any);

    return {
        client,
        components,
        contractComponents,
        systemCalls: createSystemCalls(client, contractComponents, components),
    };
}
