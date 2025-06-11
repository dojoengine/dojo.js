import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import RootLayout from "./app/layout";
import Home from "./app/page";

import "./app/globals.css";

import { init } from "@dojoengine/sdk";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import { dojoConfig } from "../dojoConfig";
import { setupWorld } from "./typescript/contracts.gen";
import { SchemaType } from "./typescript/models.gen";

import { env } from "@/env";

async function main() {
    const sdk = await init<SchemaType>({
        client: {
            toriiUrl: env.VITE_TORII_URL,
            worldAddress: dojoConfig.manifest.world.address,
        },
        domain: {
            name: "OnChainDash",
            revision: "1",
            chainId: "1",
            version: "1",
        },
    });

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <DojoSdkProvider
                sdk={sdk}
                dojoConfig={dojoConfig}
                clientFn={setupWorld}
            >
                <RootLayout>
                    <Home />
                </RootLayout>
            </DojoSdkProvider>
        </StrictMode>
    );
}

main();
