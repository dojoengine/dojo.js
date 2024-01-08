import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { getSyncEntities } from "@dojoengine/state";
import { dojoClient } from "./client";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { Config } from "../../../dojoConfig";
import { IWorld, setupWorld } from "./generated";

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
    await getSyncEntities(toriiClient, contractComponents);

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
