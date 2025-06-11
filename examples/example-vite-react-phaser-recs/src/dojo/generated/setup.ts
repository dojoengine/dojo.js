import { getSyncEntities } from "@dojoengine/state";
import { KeysClause } from "@dojoengine/sdk";
import * as torii from "@dojoengine/torii-client";
import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { setupWorld } from "./generated";
import { type DojoConfig, DojoProvider } from "@dojoengine/core";
import type { ArraySignatureType } from "starknet";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
    // torii client
    const toriiClient = new torii.ToriiClient({
        toriiUrl: config.toriiUrl,
        worldAddress: config.manifest.world.address || "",
    });

    // create contract components
    const contractComponents = defineContractComponents(world);

    // create client components
    const clientComponents = createClientComponents({ contractComponents });

    // fetch all existing entities from torii
    const sync = await getSyncEntities(
        toriiClient,
        contractComponents as any,
        KeysClause([], [], "VariableLen").build(),

        []
    );

    const client = await setupWorld(
        new DojoProvider(config.manifest, config.rpcUrl)
    );

    return {
        client,
        clientComponents,
        contractComponents,
        systemCalls: createSystemCalls(
            { client },
            contractComponents,
            clientComponents
        ),
        publish: (typedData: string, signature: ArraySignatureType) => {
            toriiClient.publishMessage(typedData, signature);
        },
        config,
        sync,
    };
}
