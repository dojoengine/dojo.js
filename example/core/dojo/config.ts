import { createDojoConfig } from "@dojoengine/core";

import manifest from "../manifest_dev.json" with { type: "json" };

export const dojoConfig = createDojoConfig({
    manifest,
});
