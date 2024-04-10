import manifest from "../../dojo-starter/manifests/dev/manifest.json";
import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
});
