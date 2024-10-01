import manifest from "../manifests/dev/deployment/manifest.json";

import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
  manifest,
});
