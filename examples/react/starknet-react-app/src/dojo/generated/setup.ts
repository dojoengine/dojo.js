import { getSyncEntities } from "@dojoengine/state";
import {
    DojoConfig,
    DojoProvider,
    createModelTypedData,
} from "@dojoengine/core";
import * as torii from "@dojoengine/torii-client";
import { createClientComponents } from "../createClientComponents";
import { createSystemCalls } from "../createSystemCalls";
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { setupWorld } from "./generated";
import { TypedData, WeierstrassSignatureType } from "starknet";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup({ ...config }: DojoConfig) {
    // torii client
    const toriiClient = await torii.createClient({
        rpcUrl: config.rpcUrl,
        toriiUrl: config.toriiUrl,
        relayUrl: "",
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
        undefined
    );

    // create dojo provider
    const dojoProvider = new DojoProvider(config.manifest, config.rpcUrl);

    // setup world
    const client = await setupWorld(dojoProvider);

    // // create burner manager
    // const burnerManager = new BurnerManager({
    //     masterAccount: new Account(
    //         dojoProvider.provider,
    //         config.masterAddress,
    //         config.masterPrivateKey
    //     ),
    //     accountClassHash: config.accountClassHash,
    //     rpcProvider: dojoProvider.provider,
    // });

    // if (burnerManager.list().length === 0) {
    //     try {
    //         await burnerManager.create();
    //     } catch (e) {
    //         console.error(e);
    //     }
    // }

    // await burnerManager.init();

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
        dojoProvider,
        // burnerManager,
        sync,
    };
}
