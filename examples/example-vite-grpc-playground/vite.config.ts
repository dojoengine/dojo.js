import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import monacoEditorEsmPlugin from "vite-plugin-monaco-editor-esm";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        monacoEditorEsmPlugin({
            languageWorkers: ["editorWorkerService", "json", "typescript"],
        }),
        wasm(),
    ],
    build: {
        target: "esnext",
        rollupOptions: {
            // Ensure external modules are properly handled
            external: ["chalk"],
            output: {
                format: "esm",
            },
        },
    },
    worker: {
        format: "es",
        plugins: () => {
            return [wasm()];
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
            },
        },
    },
    define: {
        global: "globalThis",
    },
});
