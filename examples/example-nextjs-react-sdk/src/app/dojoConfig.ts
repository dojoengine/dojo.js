import { createDojoConfig } from "@dojoengine/core";

import manifest from "../../../../worlds/dojo-starter/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
