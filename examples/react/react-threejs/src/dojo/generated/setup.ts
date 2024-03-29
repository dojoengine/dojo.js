import { getSyncEntities } from "@dojoengine/state";
import { DojoProvider, DojoConfig } from "@dojoengine/core";
import * as torii from "@dojoengine/torii-client";
import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { setupWorld } from "./generated";
import { Account, RpcProvider } from "starknet";
import { BurnerManager } from "@dojoengine/create-burner";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
    // torii client
    const toriiClient = await torii.createClient([], {
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        worldAddress: config.manifest.world.address || "",
        // hardcoded random address until this is actually implemented
        relayUrl: "/ip4/127.0.0.1/tcp/9090",
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
        config,
        world,
        burnerManager,
    };
}
