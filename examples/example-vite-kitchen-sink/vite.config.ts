import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait(), mkcert()],
    build: {
        target: "esnext",
        rollupOptions: {
            output: {
                format: "esm",
            },
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    optimizeDeps: {
        exclude: ["fsevents"],
    },
});
