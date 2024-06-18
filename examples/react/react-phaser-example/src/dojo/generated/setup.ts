import { getSyncEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { setupWorld } from "./generated";
import {
    DojoConfig,
    DojoProvider,
    createModelTypedData,
} from "@dojoengine/core";
import { TypedData, WeierstrassSignatureType } from "starknet";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
    // torii client
    const toriiClient = await torii.createClient([], {
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        relayUrl: config.relayUrl,
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
        publish: (typedData: string, signature: WeierstrassSignatureType) => {
            toriiClient.publishMessage(typedData, {
                r: signature.r.toString(),
                s: signature.s.toString(),
            });
        },
        config,
        sync,
    };
}
