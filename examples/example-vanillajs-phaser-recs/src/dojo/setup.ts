import { DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { getSyncEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";
import { Account, RpcProvider } from "starknet";

import { Config } from "../../dojoConfig.ts";
import {
    ClientComponents,
    createClientComponents,
} from "./createClientComponent.ts";
import { defineContractComponents } from "./defineContractComponents.ts";
import { setupWorld } from "./defineContractSystems.ts";
import { models } from "./models.ts";
import { systems } from "./systems.ts";
import { world } from "./world.ts";

export type SetupResult = Awaited<ReturnType<typeof setup>>;
export type IDojo = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: Config) {
    // torii client
    let toriiClient = null;
    try {
        toriiClient = await torii.createClient({
            toriiUrl: config.toriiUrl,
            worldAddress: config.manifest.world.address || "",
        });
    } catch (e) {
        console.error("Failed to create torii client:", e);
        throw e;
    }

    // create contract components
    let contractModels = null;
    try {
        contractModels = createClientComponents({
            contractComponents: defineContractComponents(world),
        });
    } catch (e) {
        console.error("Failed to create contract components:", e);
        throw e;
    }

    // create client components
    const { models: clientModels } = models({ contractModels });

    // fetch all existing entities from torii
    let sync = null;
    try {
        sync = await getSyncEntities(
            toriiClient,
            contractModels as any,
            undefined,
            []
        );
    } catch (e) {
        console.error("Failed to fetch sync:", e);
        throw e;
    }

    let client = null;
    try {
        client = await setupWorld(
            new DojoProvider(config.manifest, config.rpcUrl),
            config
        );
    } catch (e) {
        console.error("Failed to create client:", e);
        throw e;
    }

    const rpcProvider = new RpcProvider({
        nodeUrl: config.rpcUrl,
    });

    let burnerManager = null;
    try {
        burnerManager = new BurnerManager({
            masterAccount: new Account(
                rpcProvider,
                config.masterAddress,
                config.masterPrivateKey
            ),
            feeTokenAddress: config.feeTokenAddress,
            accountClassHash: config.accountClassHash,

            rpcProvider,
        });
    } catch (e) {
        console.log("Failed to create burner manager:", e);
        throw e;
    }

    try {
        await burnerManager.init();
        if (burnerManager.list().length === 0) {
            await burnerManager.create();
        }
    } catch (e) {
        console.error(e);
    }
    const actions = systems({
        client,
        clientModels: clientModels as ClientComponents,
        contractComponents: contractModels,
    });
    const account = burnerManager.getActiveAccount();
    if (null === account || undefined === account) {
        throw new Error("failed to get active account");
    }

    return {
        client,
        clientModels,
        contractComponents: clientModels,
        systemCalls: actions.actions,
        config,
        world,
        burnerManager,
        rpcProvider,
        sync,
        account,
    };
}
