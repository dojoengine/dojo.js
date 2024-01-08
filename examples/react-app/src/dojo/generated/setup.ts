import { getSyncEntities } from "@dojoengine/state";
import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { dojoClient } from "./client";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { Config } from "../../../dojoConfig";
import { setupWorld } from "./generated";
import type { IWorld } from "./generated";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: Config) {
    // Initialize the network configuration.
    const { toriiClient, client } = await dojoClient<IWorld>(
        {
            rpcUrl: config.rpcUrl,
            toriiUrl: config.toriiUrl,
            manifest: config.manifest,
        },
        setupWorld
    );

    // create contract components
    const contractComponents = defineContractComponents(world);

    // create client components
    const clientComponents = createClientComponents({ contractComponents });

    // fetch all existing entities from torii
    await getSyncEntities(toriiClient, contractComponents as any);

    return {
        client,
        clientComponents,
        contractComponents,
        systemCalls: createSystemCalls(
            { client },
            contractComponents,
            clientComponents
        ),
        config,
    };
}
