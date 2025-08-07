#!/usr/bin/env bun

// Run both web and node builds
await Promise.all([import("./build.web.ts"), import("./build.node.ts")]);

console.log("✅ SDK build completed for both web and node targets");
