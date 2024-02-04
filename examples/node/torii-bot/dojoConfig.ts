import manifest from "../../dojo-starter/target/dev/manifest.json" assert { type: "json" };

import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
});
