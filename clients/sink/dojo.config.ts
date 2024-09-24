import { createDojoConfig } from "@dojoengine/core";

import manifest from "./onchain/manifests/dev/deployment/manifest.json";

export const dojoConfig = createDojoConfig({
  manifest,
});
