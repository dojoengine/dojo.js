import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { init } from "@dojoengine/sdk";
import { dojoConfig } from "../dojoConfig.ts";

async function main() {
    const sdk = await init({
        client: {
            toriiUrl: dojoConfig.toriiUrl,
            worldAddress: dojoConfig.manifest.world.address,
        },
        domain: {
            name: "WORLD_NAME",
            version: "1.0",
            chainId: "KATANA",
            revision: "1",
        },
    });

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <App sdk={sdk} />
        </StrictMode>
    );
}

main().catch(console.error);
