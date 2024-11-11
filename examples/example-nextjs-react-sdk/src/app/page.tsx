"use client";

import { init } from "@dojoengine/sdk";
import { Schema, schema } from "./bindings";

import { DojoContextProvider } from "./DojoContext";
import { setupBurnerManager } from "@dojoengine/create-burner";
import { dojoConfig } from "./dojoConfig";

const sdk = await init<Schema>(
    {
        client: {
            rpcUrl: dojoConfig.rpcUrl,
            toriiUrl: dojoConfig.toriiUrl,
            relayUrl: dojoConfig.relayUrl,
            worldAddress: dojoConfig.manifest.world.address,
        },
        domain: {
            name: "WORLD_NAME",
            version: "1.0",
            chainId: "KATANA",
            revision: "1",
        },
    },
    schema
);

export default async function Home() {
    return (
        <DojoContextProvider
            burnerManager={await setupBurnerManager(dojoConfig)}
        >
            <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
                <h1>Hello World</h1>
            </div>
        </DojoContextProvider>
    );
}
