import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { init } from "@dojoengine/sdk";

import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { StrictMode } from "react";
import { schema, SchemaType } from "./typescript/models.gen";
import { dojoConfig } from "../dojoConfig";
import { DojoSdkProvider } from "./dojo-sdk-provider";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

/**
 * Initializes and bootstraps the Dojo application.
 * Sets up the SDK, burner manager, and renders the root component.
 *
 * @throws {Error} If initialization fails
 */
async function main() {
    const sdk = await init<SchemaType>(
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
    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            <DojoSdkProvider sdk={sdk}>
                <RouterProvider router={router} />
            </DojoSdkProvider>
        </StrictMode>
    );
}

main().catch((error) => {
    console.error("Failed to initialize the application:", error);
});
