import { defineConfig } from "vitest/config";
import wasm from "vite-plugin-wasm";

export default defineConfig({
    plugins: [wasm()],
    test: {
        include: ["src/benchmarks/**/*.bench.ts"],
        benchmark: {
            // Benchmark-specific options
            outputJson: "./bench/results.json",
            reporters: ["default"],
        },
        // Add timeout for benchmarks
        testTimeout: 30000,
        hookTimeout: 30000,
    },
});
