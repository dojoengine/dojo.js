import { defineConfig, type Options } from "tsup";

import { tsupConfig } from "../../tsup.config";

export default defineConfig({
    ...(tsupConfig as Options),
    format: ["esm"],
    outDir: "dist/web",
    entry: {
        index: "src/web/index.ts",
        state: "src/web/state.ts",
        react: "src/web/react/index.ts",
        sql: "src/web/sql/index.ts",
        experimental: "src/web/experimental/index.ts",
    },
});
