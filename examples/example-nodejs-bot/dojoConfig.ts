import manifest from "../dojo-starter/manifest_dev.json" assert { type: "json" };

import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
});
