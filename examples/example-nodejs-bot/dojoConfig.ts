import manifest from "../../examples/dojo/dojo-starter/manifests/dev/deployment/manifest.json" assert { type: "json" };

import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
});
