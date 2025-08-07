#!/usr/bin/env bun
import { buildPackage } from "../../bun.build.config";

await buildPackage({
    entry: ["./src/index.ts", "./src/cli/compile-abi.ts"],
    outdir: "./dist",
    minify: true, // Enable minification
    splitting: true, // Enable splitting for shared code between entries
    sourcemap: "external",
    external: ["@dojoengine/recs", "starknet", "zod"],
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
