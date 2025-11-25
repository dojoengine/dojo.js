import { defineConfig, Options } from "tsup";

import { tsupConfig } from "../../tsup.config";

export default defineConfig([
    {
        ...(tsupConfig as Options),
        entry: {
            index: "src/index.ts",
            "effect/index": "src/effect/index.ts",
        },
        target: "esnext",
    },
]);
