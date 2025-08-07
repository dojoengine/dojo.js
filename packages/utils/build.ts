#!/usr/bin/env bun
import { buildPackage } from "../../bun.build.config";

await buildPackage({
    entry: "./src/index.ts",
    outdir: "./dist",
    minify: true, // Enable full minification
    splitting: false, // Single entry point
    sourcemap: "external",
    external: ["@dojoengine/utils-wasm", "@dojoengine/internal", "starknet"],
});

// Generate TypeScript declarations
const proc = Bun.spawn(["tsc", "--emitDeclarationOnly"], {
    cwd: import.meta.dir,
    stdout: "inherit",
    stderr: "inherit",
});

const exitCode = await proc.exited;
if (exitCode !== 0) {
    console.error("❌ Failed to generate TypeScript declarations");
    process.exit(exitCode);
}

console.log("✅ TypeScript declarations generated");
