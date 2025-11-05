import path from "node:path";

import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineConfig({
    root: __dirname,
    plugins: [svelte(), wasm(), topLevelAwait()],
    resolve: {
        alias: {
            "@showcase/dojo": path.resolve(__dirname, "../../core/dojo"),
            "@showcase/utils": path.resolve(__dirname, "../../core/utils"),
        },
    },
    build: {
        outDir: path.resolve(__dirname, "../../dist/svelte"),
        emptyOutDir: true,
    },
});
