import { createDojoConfig } from "@dojoengine/core";

import manifest from "../../../examples/dojo/dojo-starter/manifests/dev/deployment/manifest.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
export type Config = typeof dojoConfig;
