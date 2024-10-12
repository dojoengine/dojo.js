import { DojoConfig, DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { getSyncEntities, getSyncEvents } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { Account, ArraySignatureType } from "starknet";

import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { setupWorld } from "./typescript/contracts.gen";
import { defineContractComponents } from "./typescript/models.gen";
import { world } from "./world";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
    // Initialize Torii client for interacting with the Dojo network
    const toriiClient = await torii.createClient({
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        relayUrl: "",
        worldAddress: config.manifest.world.address || "",
    });

    // Define contract components based on the world configuration
    const contractComponents = defineContractComponents(world);

    const getSync = await getSyncEntities(
        toriiClient,
        contractComponents as any,
        undefined,
        [],
        3000,
        true
    );

    // Create client-side components that mirror the contract components
    const clientComponents = createClientComponents({ contractComponents });

    // Initialize the Dojo provider with the manifest and RPC URL
    const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

    // Set up event synchronization between the client and the Dojo network
    const eventSync = getSyncEvents(
        toriiClient,
        contractComponents as any,
        undefined,
        []
    );

    // Set up the world client for interacting with smart contracts
    const client = await setupWorld(dojoProvider);

    // Initialize the burner account manager
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

    // Initialize burner accounts and create one if none exist
    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            await burnerManager.create();
        }
    } catch (e) {
        console.error("Failed to initialize or create burner account:", e);
    }

    // Return an object with all necessary components and functions for the Dojo application
    return {
        client,
        clientComponents,
        contractComponents,
        systemCalls: createSystemCalls({ client }, clientComponents, world),
        publish: (typedData: string, signature: ArraySignatureType) => {
            toriiClient.publishMessage(typedData, signature);
        },
        config,
        dojoProvider,
        burnerManager,
        toriiClient,
        eventSync,
        getSync,
    };
}
