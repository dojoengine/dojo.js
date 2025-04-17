import { defineConfig, Options } from "tsup";

import { tsupConfig } from "../../tsup.config";

export default defineConfig({
    ...(tsupConfig as Options),
    format: ["esm"],
    outDir: "dist/node",
    tsconfig: "src/node/tsconfig.json",
    entry: {
        index: "src/node/index.ts",
    },
});
