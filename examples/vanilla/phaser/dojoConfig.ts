import manifest from "../../dojo-starter/manifests/dev/deployment/manifest.json";
import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
});
export type Config = typeof dojoConfig;
