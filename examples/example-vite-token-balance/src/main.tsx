import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { init } from "@dojoengine/sdk";
import { dojoConfig } from "../dojoConfig";
import { DojoSdkProvider } from "@dojoengine/sdk/react";
import { setupWorld } from "./typescript/contracts.gen";
import StarknetProvider from "./components/starknet-provider.tsx";

async function main() {
    const sdk = await init({
        client: { worldAddress: dojoConfig.manifest.world.address },
        domain: {
            name: "WORLD_NAME",
            version: "1.0",
            chainId: "KATANA",
            revision: "1",
        },
    });

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <DojoSdkProvider
                sdk={sdk}
                dojoConfig={dojoConfig}
                clientFn={setupWorld}
            >
                <StarknetProvider>
                    <App />
                </StarknetProvider>
            </DojoSdkProvider>
        </StrictMode>
    );
}

main().catch(console.error);
