import manifest from "../../dojo-starter/manifests/deployments/KATANA.json" assert { type: "json" };

import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
});
