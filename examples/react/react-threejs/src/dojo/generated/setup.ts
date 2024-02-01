import { getSyncEntities } from "@dojoengine/state";
import { DojoProvider } from "@dojoengine/core";
import * as torii from "@dojoengine/torii-client";
import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { Config } from "../../../dojoConfig";
import { setupWorld } from "./generated";
import { Account, RpcProvider } from "starknet";
import { BurnerManager } from "@dojoengine/create-burner";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: Config) {
    // torii client
    const toriiClient = await torii.createClient([], {
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        worldAddress: config.manifest.world.address || "",
    });

    // create contract components
    const contractComponents = defineContractComponents(world);

    // create client components
    const clientComponents = createClientComponents({ contractComponents });

    // fetch all existing entities from torii
    await getSyncEntities(toriiClient, contractComponents as any);

    const client = await setupWorld(
        new DojoProvider(config.manifest, config.rpcUrl)
    );

    const rpcProvider = new RpcProvider({
        nodeUrl: config.rpcUrl,
    });

    const masterAccount = new Account(
        rpcProvider,
        config.masterAddress,
        config.masterPrivateKey
    );

    const burnerManager = new BurnerManager({
        masterAccount,
        accountClassHash: config.accountClassHash,
        rpcProvider,
    });

    try {
        await burnerManager.create();
    } catch (e) {
        console.error(e);
    }
    burnerManager.init();

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
        world,
        burnerManager,
    };
}
