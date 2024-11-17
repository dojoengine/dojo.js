import manifest from "../dojo-starter/manifest_dev.json";

import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
});
