import { defineConfig, Options } from "tsup";

import { tsupConfig } from "../../tsup.config";

export default defineConfig([
    {
        entry: ["src/index.ts"],
        target: "esnext",
        format: ["esm"],
        dts: true,
        sourcemap: true,
        clean: true,
        minify: false,
        splitting: false,
    },
    {
        entry: { "effect/index": "src/effect/index.ts" },
        target: "esnext",
        format: ["esm"],
        dts: false,
        sourcemap: true,
        clean: false,
        minify: false,
        splitting: false,
    },
]);
