import { init } from "@dojoengine/sdk";
import { dojoConfig } from "../dojoConfig";
import "./style.css";

async function initializeDojo() {
    const app = document.querySelector<HTMLDivElement>("#app")!;

    app.innerHTML = `
        <div>
            <h1>Welcome to Dojo.js</h1>
            <div id="status">Initializing Dojo...</div>
            <p>Edit <code>src/main.ts</code> and save to reload.</p>
            <a href="https://book.dojoengine.org/" target="_blank">Learn Dojo</a>
        </div>
    `;

    try {
        const sdk = await init(
            {
                client: {
                    rpcUrl: dojoConfig.rpcUrl,
                    toriiUrl: dojoConfig.toriiUrl,
                    relayUrl: dojoConfig.relayUrl,
                    worldAddress: dojoConfig.manifest.world.address,
                },
                domain: {
                    name: "MyDojoApp",
                    version: "1.0.0",
                    chainId: "0x534e5f5345504f4c4941",
                    revision: 1,
                },
            },
            {} // models will be imported here
        );

        document.querySelector<HTMLDivElement>("#status")!.innerHTML =
            "✅ Dojo SDK initialized successfully!";

        // Store SDK globally for use
        (window as any).dojoSdk = sdk;
    } catch (error) {
        console.error("Failed to initialize Dojo:", error);
        document.querySelector<HTMLDivElement>("#status")!.innerHTML =
            "❌ Failed to initialize Dojo SDK";
    }
}

initializeDojo();
