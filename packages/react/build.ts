#!/usr/bin/env bun
import { buildPackage } from "../../bun.build.config";

await buildPackage({
    entry: "./src/index.ts",
    outdir: "./dist",
    minify: false,
    splitting: false,
    sourcemap: true,
    external: [
        "@dojoengine/state",
        "@dojoengine/torii-client",
        "@dojoengine/utils",
        "@dojoengine/internal",
        "react",
        "starknet",
    ],
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
