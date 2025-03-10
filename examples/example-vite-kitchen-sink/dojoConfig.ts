import { createDojoConfig } from "@dojoengine/core";

import manifest from "../../worlds/onchain-dash/manifest_dev.json";

export const dojoConfig = createDojoConfig({
    manifest,
});
