import { getSyncEntities } from "@dojoengine/state";
import * as torii from "@dojoengine/torii-client";

import { models } from "./models.ts";
import { systems } from "./systems.ts";
import { defineContractComponents } from "./defineContractComponents.ts";
import { world } from "./world.ts";
import { Config } from "../../dojoConfig.ts";
import { setupWorld } from "./defineContractSystems.ts";

import { DojoProvider } from "@dojoengine/core";
import { BurnerManager } from "@dojoengine/create-burner";
import { Account, RpcProvider, wallet } from "starknet";
import { createClientComponents } from "./createClientComponent.ts";

export type SetupResult = Awaited<ReturnType<typeof setup>>;
export type IDojo = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: Config) {
    // torii client
    const toriiClient = await torii.createClient({
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        relayUrl: "",
        worldAddress: config.manifest.world.address || "",
    });

    // create contract components
    const contractModels = createClientComponents({
        contractComponents: defineContractComponents(world),
    });

    // create client components
    const { models: clientModels } = models({ contractModels });

    // fetch all existing entities from torii
    const sync = await getSyncEntities(
        toriiClient,
        contractModels as any,
        [],
        1000
    );

    const client = await setupWorld(
        new DojoProvider(config.manifest, config.rpcUrl),
        config
    );

    const rpcProvider = new RpcProvider({
        nodeUrl: config.rpcUrl,
    });

    const burnerManager = new BurnerManager({
        masterAccount: new Account(
            rpcProvider,
            config.masterAddress,
            config.masterPrivateKey
        ),
        feeTokenAddress: config.feeTokenAddress,
        accountClassHash: config.accountClassHash,

        rpcProvider,
    });

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
        clientModels,
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
