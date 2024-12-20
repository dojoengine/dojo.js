import { defineConfig } from "vite";

import react from "vite-preset-react";
import mkcert from "vite-plugin-mkcert";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import { fileURLToPath } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait(), mkcert()],
    resolve: {
        alias: [
            {
                find: "@",
                replacement: fileURLToPath(new URL("./src", import.meta.url)),
            },
        ],
    },
    optimizeDeps: {
        exclude: ["fsevents"],
    },
});
