import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "./index.css";
import { init } from "@dojoengine/sdk";
import { Schema, schema } from "./bindings.ts";
import { dojoConfig } from "../dojoConfig.ts";
import { DojoContextProvider } from "./DojoContext.tsx";
import { setupBurnerManager } from "@dojoengine/create-burner";
import { AccountProvider } from "./useAccount.tsx";
import { KEYCHAIN_URL, POLICIES, REDIRECT_URI, RPC_URL } from "./config.ts";

/**
 * Initializes and bootstraps the Dojo application.
 * Sets up the SDK, burner manager, and renders the root component.
 *
 * @throws {Error} If initialization fails
 */
async function main() {
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

    createRoot(document.getElementById("root")!).render(
        <StrictMode>
            {/* AccountProvider is used to handle the account logic within telegram */}
            <AccountProvider
                keychainUrl={KEYCHAIN_URL}
                policies={POLICIES}
                redirectUri={REDIRECT_URI}
                rpcUrl={RPC_URL}
            >
                <DojoContextProvider
                    burnerManager={await setupBurnerManager(dojoConfig)}
                >
                    <App sdk={sdk} />
                </DojoContextProvider>
            </AccountProvider>
        </StrictMode>
    );
}

main().catch((error) => {
    console.error("Failed to initialize the application:", error);
});
