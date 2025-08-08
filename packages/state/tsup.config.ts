import { defineConfig, Options } from "tsup";

import { tsupConfig } from "../../tsup.config";

export default defineConfig({
    ...(tsupConfig as Options),
    entry: {
        index: "src/index.ts",
        "zustand/index": "src/zustand/index.ts",
        "recs/index": "src/recs/index.ts",
    },
});
