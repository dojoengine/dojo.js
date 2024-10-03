import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import RootLayout from "./app/layout";
import Home from "./app/page";

import "./app/globals.css";

import { init } from "@dojoengine/sdk";
import { OnchainDashSchemaType, schema } from "@/dojo/models";
import { env, getRpcUrl } from "@/env";
import { dojoConfig } from "@/dojo.config";
import { DojoContext } from "@/dojo/provider";

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

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <DojoContext.Provider value={db}>
                <RootLayout>
                    <Home />
                </RootLayout>
            </DojoContext.Provider>
        </StrictMode>
    );
}

main();
