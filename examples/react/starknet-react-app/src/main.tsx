import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { setup } from "./dojo/generated/setup.ts";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { dojoConfig } from "../dojoConfig.ts";
import { sepolia } from "@starknet-react/chains";
import { StarknetConfig, argent, braavos } from "@starknet-react/core";
import { provider, katana } from "./katana.tsx";

async function init() {
    const rootElement = document.getElementById("root");
    if (!rootElement) throw new Error("React root not found");
    const root = ReactDOM.createRoot(rootElement as HTMLElement);

    const setupResult = await setup(dojoConfig);

    const chains = [katana];

    const connectors = [braavos(), argent()];

    root.render(
        <React.StrictMode>
            <StarknetConfig
                chains={chains}
                provider={() => provider(katana)}
                connectors={connectors}
                autoConnect
            >
                <DojoProvider value={setupResult}>
                    <App />
                </DojoProvider>
            </StarknetConfig>
        </React.StrictMode>
    );
}

init();
