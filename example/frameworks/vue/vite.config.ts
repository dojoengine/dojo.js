import path from "node:path";

import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineConfig({
    root: __dirname,
    plugins: [vue(), wasm(), topLevelAwait()],
    resolve: {
        alias: {
            "@showcase/dojo": path.resolve(__dirname, "../../core/dojo"),
            "@showcase/utils": path.resolve(__dirname, "../../core/utils"),
        },
    },
    build: {
        outDir: path.resolve(__dirname, "../../dist/vue"),
        emptyOutDir: true,
    },
});
