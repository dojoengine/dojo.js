import { type DojoConfig, DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { KeysClause } from "@dojoengine/sdk";
import { getSyncEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { Account, type ArraySignatureType } from "starknet";

import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { setupWorld } from "./generated";
import { world } from "./world";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
    const toriiClient = new torii.ToriiClient({
        toriiUrl: config.toriiUrl,
        worldAddress: config.manifest.world.address || "",
    });

    const contractComponents = defineContractComponents(world);
    const clientComponents = createClientComponents({ contractComponents });

    const sync = await getSyncEntities(
        toriiClient,
        contractComponents as any,
        KeysClause([], [undefined], "VariableLen").build(),
        []
    );

    const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);
    const client = await setupWorld(dojoProvider);

    const burnerManager = new BurnerManager({
        masterAccount: new Account({
            provider: dojoProvider.provider,
            address: config.masterAddress,
            signer: config.masterPrivateKey,
        }),
        accountClassHash: config.accountClassHash,
        rpcProvider: dojoProvider.provider,
        feeTokenAddress: config.feeTokenAddress,
    });

    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            await burnerManager.create();
        }
    } catch (error) {
        console.error(error);
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
            toriiClient.publishMessage({
                message: typedData,
                signature,
                world_address: config.manifest.world.address || "",
            });
        },
        config,
        dojoProvider,
        burnerManager,
        toriiClient,
        sync,
    };
}
