import { type DojoConfig, DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { getSyncEntities } from "@dojoengine/state";
import { KeysClause } from "@dojoengine/sdk";
import * as torii from "@dojoengine/torii-client";
import { Account, type ArraySignatureType } from "starknet";

import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { setupWorld } from "./generated";
import { world } from "./world";

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

    const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

    const client = await setupWorld(
        new DojoProvider(config.manifest, config.rpcUrl)
    );

    const burnerManager = new BurnerManager({
        masterAccount: new Account(
            {
                nodeUrl: config.rpcUrl,
            },
            config.masterAddress,
            config.masterPrivateKey
        ),
        accountClassHash: config.accountClassHash,
        rpcProvider: dojoProvider.provider,
        feeTokenAddress: config.feeTokenAddress,
    });

    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            await burnerManager.create();
        }
    } catch (e) {
        console.error(e);
    }

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
            toriiClient.publishMessage({ message: typedData, signature });
        },
        config,
        world,
        burnerManager,
        sync,
    };
}
