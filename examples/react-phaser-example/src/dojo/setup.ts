import { createClientComponents } from "./createClientComponents";
import { createSystemCalls } from "./createSystemCalls";
import { setupNetwork } from "./setupNetwork";
import { getSyncEntities } from "@dojoengine/react";

export type SetupResult = Awaited<ReturnType<typeof setup>>;

export async function setup() {
    const network = await setupNetwork();
    const components = createClientComponents(network);

    await getSyncEntities(
        network.toriiClient,
        network.contractComponents as any
    );

    const systemCalls = createSystemCalls(network, components);
    return {
        network,
        components,
        systemCalls,
    };
}
