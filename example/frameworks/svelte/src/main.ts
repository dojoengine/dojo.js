import "./app.css";

import App from "./App.svelte";
import { dojoConfig, setup } from "@showcase/dojo";
import { accountStore, burnerStore, dojoStore } from "./dojo/stores";

async function bootstrap() {
    const setupResult = await setup(dojoConfig);
    dojoStore.set(setupResult);
    burnerStore.set(setupResult.burnerManager.list());
    accountStore.set(setupResult.burnerManager.getActiveAccount());

    return new App({
        target: document.getElementById("app") as HTMLElement,
    });
}

export default bootstrap();
