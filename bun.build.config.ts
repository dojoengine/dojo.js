import type { BuildConfig } from "bun";

export interface BunBuildOptions {
    entry: string | string[] | Record<string, string>;
    outdir?: string;
    format?: "esm" | "cjs" | "iife";
    minify?: boolean | {
        identifiers?: boolean;
        whitespace?: boolean;
        syntax?: boolean;
    };
    splitting?: boolean;
    sourcemap?: boolean | "external" | "inline";
    external?: string[];
    target?: "browser" | "bun" | "node";
}

export const defaultBuildConfig: Partial<BuildConfig> = {
    target: "node",
    format: "esm",
    sourcemap: "external",
    minify: {
        identifiers: true,
        whitespace: true,
        syntax: true,
    },
    splitting: true,
    external: ["@dojoengine/internal"],
};

export async function buildPackage(options: BunBuildOptions): Promise<void> {
    // Handle entry points
    const isEntryObject = typeof options.entry === "object" && !Array.isArray(options.entry);
    
    // If entry is an object, we need to build each one separately to control naming
    if (isEntryObject) {
        const entries = options.entry as Record<string, string>;
        const builds = await Promise.all(
            Object.entries(entries).map(async ([name, path]) => {
                return Bun.build({
                    entrypoints: [path],
                    outdir: options.outdir || "./dist",
                    format: options.format || "esm",
                    minify: options.minify === undefined 
                        ? { identifiers: true, whitespace: true, syntax: true }
                        : options.minify,
                    splitting: options.splitting ?? (Object.keys(entries).length > 1),
                    sourcemap: options.sourcemap ?? "external",
                    external: options.external || ["@dojoengine/internal"],
                    target: options.target || "node",
                    naming: {
                        entry: `${name}.[ext]`,  // Use the key as the output name
                        chunk: "chunks/[name]-[hash].[ext]",
                        asset: "assets/[name]-[hash].[ext]",
                    },
                });
            })
        );
        
        // Check if all builds succeeded
        const failed = builds.find(r => !r.success);
        if (failed) {
            console.error("Build failed:");
            for (const log of failed.logs) {
                console.error(log);
            }
            process.exit(1);
        }
        
        console.log(`✅ Build completed successfully. Output: ${options.outdir || "./dist"}`);
        return;
    }
    
    // For arrays or single entries, use the standard approach
    const entrypoints = Array.isArray(options.entry) ? options.entry : [options.entry];
    const shouldSplit = options.splitting ?? (entrypoints.length > 1);

    // Handle minify option
    const minifyConfig = options.minify === undefined 
        ? { identifiers: true, whitespace: true, syntax: true }
        : options.minify;

    // Use clean naming for outputs
    const naming = {
        entry: "[dir]/[name].[ext]",
        chunk: "chunks/[name]-[hash].[ext]",
        asset: "assets/[name]-[hash].[ext]",
    };

    const result = await Bun.build({
        entrypoints,
        outdir: options.outdir || "./dist",
        format: options.format || "esm",
        minify: minifyConfig,
        splitting: shouldSplit,
        sourcemap: options.sourcemap ?? "external",
        external: options.external || ["@dojoengine/internal"],
        target: options.target || "node",
        naming,
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