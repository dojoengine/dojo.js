import manifest from "../../../examples/dojo/dojo-starter/manifests/dev/deployment/manifest.json";
import { createDojoConfig } from "@dojoengine/core";

export const dojoConfig = createDojoConfig({
    manifest,
});
export type Config = typeof dojoConfig;
