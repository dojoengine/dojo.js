import { defineConfig, Options } from "tsup";

import { tsupConfig } from "../../tsup.config";

export default defineConfig({
    ...(tsupConfig as Options),
    entry: {
        index: "src/index.ts",
        zustand: "src/zustand/index.ts",
        recs: "src/recs/index.ts",
    },
});
