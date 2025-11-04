import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineConfig({
    root: __dirname,
    plugins: [react(), wasm(), topLevelAwait()],
    resolve: {
        alias: {
            "@showcase/dojo": path.resolve(__dirname, "../../core/dojo"),
            "@showcase/utils": path.resolve(__dirname, "../../core/utils"),
        },
    },
    build: {
        outDir: path.resolve(__dirname, "../../dist/react"),
        emptyOutDir: true,
    },
});
