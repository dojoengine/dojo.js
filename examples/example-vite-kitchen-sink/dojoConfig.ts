import { createDojoConfig } from "@dojoengine/core";

import manifest from "../../worlds/onchain-dash/manifests/release/deployment/manifest.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
