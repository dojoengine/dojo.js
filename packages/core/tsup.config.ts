import { defineConfig, Options } from "tsup";

import { tsupConfig } from "../../tsup.config";

export default defineConfig({
    ...(tsupConfig as Options),
    entry: [
        "src/index.ts",
        "src/cli/compile-abi.ts",
        "src/cli/generate-abi-types.ts",
    ],
    minify: false,
    splitting: false,
});
