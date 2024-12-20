import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import RootLayout from "./app/layout";
import Home from "./app/page";

import "./app/globals.css";

import { init } from "@dojoengine/sdk";
import { OnchainDashSchemaType, schema } from "@/dojo/models";
import { env, getRpcUrl } from "@/env";
import { dojoConfig } from "../dojoConfig";
import { DojoContext } from "@/dojo/provider";
import { DojoProvider } from "@dojoengine/core";
import { setupWorld } from "./typescript/contracts.gen";

async function main() {
    const db = await init<OnchainDashSchemaType>(
        {
            client: {
                rpcUrl: getRpcUrl(),
                toriiUrl: env.VITE_TORII_URL,
                relayUrl: env.VITE_RELAY_URL,
                worldAddress: dojoConfig.manifest.world.address,
            },
            domain: {
                name: "OnChainDash",
                revision: "1",
                chainId: "1",
                version: "1",
            },
        },
        schema
    );
    const provider = new DojoProvider(dojoConfig.manifest, getRpcUrl());
    const actions = setupWorld(provider);

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <DojoContext.Provider value={{ db, provider, actions }}>
                <RootLayout>
                    <Home />
                </RootLayout>
            </DojoContext.Provider>
        </StrictMode>
    );
}

main();
