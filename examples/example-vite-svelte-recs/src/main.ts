import "./app.css";
import App from "./App.svelte";
import { setup } from "./dojo/setup";
import { dojoConfig } from "../dojoConfig";
import { account, burners, dojo } from "./stores";
import { mount } from "svelte";

async function initApp() {
    // Set up dojo
    let setupRes = await setup(dojoConfig);
    dojo.set(setupRes);
    burners.set(setupRes.burnerManager.list());
    account.set(setupRes.burnerManager.getActiveAccount());

    console.log("App initialized");

    const app = mount(App, { target: document.getElementById("app")! });

    return app;
}

export default initApp();
