import { defineConfig, Options } from "tsup";

import { tsupConfig } from "../../tsup.config";

export default defineConfig({
    ...(tsupConfig as Options),
    entry: {
        index: "src/index.ts",
        "src/react": "src/react/index.ts",
    },
});
