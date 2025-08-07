import type { BuildConfig } from "bun";

export interface BunBuildOptions {
    entry: string | string[] | Record<string, string>;
    outdir?: string;
    format?: "esm" | "cjs" | "iife";
    minify?: boolean;
    splitting?: boolean;
    sourcemap?: boolean | "external" | "inline";
    external?: string[];
    target?: "browser" | "bun" | "node";
}

export const defaultBuildConfig: Partial<BuildConfig> = {
    target: "node",
    format: "esm",
    sourcemap: "external",
    minify: true,
    external: ["@dojoengine/internal"],
};

export async function buildPackage(options: BunBuildOptions): Promise<void> {
    const entrypoints = Array.isArray(options.entry)
        ? options.entry
        : typeof options.entry === "string"
        ? [options.entry]
        : Object.values(options.entry);

    const naming = typeof options.entry === "object" && !Array.isArray(options.entry)
        ? Object.entries(options.entry).reduce((acc, [key, value]) => {
            acc[value] = key;
            return acc;
        }, {} as Record<string, string>)
        : undefined;

    const result = await Bun.build({
        entrypoints,
        outdir: options.outdir || "./dist",
        format: options.format || "esm",
        minify: options.minify ?? true,
        splitting: options.splitting ?? false,
        sourcemap: options.sourcemap ?? "external",
        external: options.external || ["@dojoengine/internal"],
        target: options.target || "node",
        naming: naming ? {
            entry: "[dir]/[name].[ext]",
            chunk: "[name]-[hash].[ext]",
            asset: "[name]-[hash].[ext]",
        } : undefined,
    });

    if (!result.success) {
        console.error("Build failed:");
        for (const log of result.logs) {
            console.error(log);
        }
        process.exit(1);
    }

    console.log(`✅ Build completed successfully. Output: ${options.outdir || "./dist"}`);
}