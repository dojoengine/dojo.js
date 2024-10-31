import "./app.css";
import App from "./App.svelte";
import { setup } from "./dojo/setup";
import { dojoConfig } from "../dojoConfig";
import { accountStore, burnerStore, dojoStore } from "./stores";

async function initApp() {
    // Set up dojo
    let setupRes = await setup(dojoConfig);
    dojoStore.set(setupRes);
    burnerStore.set(setupRes.burnerManager.list());
    accountStore.set(setupRes.burnerManager.getActiveAccount());

    console.log("App initialized");

    const app = new App({
        target: document.getElementById("app")!,
    });

    return app;
}

export default initApp();
