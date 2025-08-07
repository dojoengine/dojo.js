#!/usr/bin/env bun
import { buildPackage } from "../../bun.build.config";

await buildPackage({
    entry: {
        index: "./src/node/index.ts",
    },
    outdir: "./dist/node",
    format: "esm",
    target: "node",
    external: [
        "@dojoengine/core",
        "@dojoengine/grpc",
        "@dojoengine/torii-client",
        "@dojoengine/torii-wasm",
        "@dojoengine/utils",
        "@dojoengine/internal",
        "effect",
        "immer",
        "neverthrow",
        "zustand",
    ],
});

// Generate TypeScript declarations using the node tsconfig (relaxed checking)
const proc = Bun.spawn(
    [
        "tsc",
        "--emitDeclarationOnly",
        "--project",
        "./src/node/tsconfig.json",
        "--outDir",
        "./dist/node",
        "--noImplicitAny",
        "false",
        "--noUnusedLocals",
        "false",
        "--noUnusedParameters",
        "false",
        "--strict",
        "false",
    ],
    {
        cwd: import.meta.dir,
        stdout: "inherit",
        stderr: "inherit",
    }
);

const exitCode = await proc.exited;
if (exitCode !== 0) {
    console.warn("⚠️ TypeScript declaration generation had warnings");
}

console.log("✅ Build completed for node");
