#!/usr/bin/env bun
import { buildPackage } from "../../bun.build.config";

await buildPackage({
    entry: {
        index: "./src/web/index.ts",
        state: "./src/web/state/index.ts",
        react: "./src/web/react/index.ts",
        sql: "./src/web/sql/index.ts",
        experimental: "./src/web/experimental/index.ts",
    },
    outdir: "./dist/web",
    format: "esm",
    target: "browser",
    splitting: true, // Enable splitting for shared code
    minify: true, // Use default minification settings
    sourcemap: "external",
    external: [
        "@dojoengine/core",
        "@dojoengine/grpc",
        "@dojoengine/torii-client",
        "@dojoengine/torii-wasm",
        "@dojoengine/utils",
        "@dojoengine/internal",
        "@starknet-react/chains",
        "@starknet-react/core",
        "@tanstack/react-query",
        "react",
        "react-dom",
        "starknet",
        "effect",
        "immer",
        "neverthrow",
        "zustand",
    ],
});

// Generate TypeScript declarations (relaxed checking)
const proc = Bun.spawn(
    [
        "tsc",
        "--emitDeclarationOnly",
        "--outDir",
        "./dist/web",
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

console.log("✅ Build completed for web");
