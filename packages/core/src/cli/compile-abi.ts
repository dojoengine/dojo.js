#!/usr/bin/env node

import {
    readFileSync,
    writeFileSync,
    readdirSync,
    existsSync,
    mkdirSync,
} from "fs";
import { join, isAbsolute, dirname } from "path";
import type { Dirent } from "fs";

type AbiEntry = {
    [key: string]: any;
};

type ManifestContract = {
    abi?: AbiEntry[];
    [key: string]: any;
};

type Manifest = {
    world?: {
        abi?: AbiEntry[];
        [key: string]: any;
    };
    contracts?: ManifestContract[];
    [key: string]: any;
};

type TargetFile = {
    abi?: AbiEntry[];
    [key: string]: any;
};

type OutputPaths = {
    json: string;
    ts: string;
};

type CollectOptions = {
    generateTypes: boolean;
    outputPath?: string;
};

/**
 * Generate a TypeScript file from compiled-abi.json with proper const assertions
 * This allows TypeScript to extract literal types from the ABI
 */
function ensureDirectory(path: string): void {
    const directory = dirname(path);
    mkdirSync(directory, { recursive: true });
}

export function resolveOutputPaths(outputOption?: string): OutputPaths {
    const jsonPath = outputOption
        ? isAbsolute(outputOption)
            ? outputOption
            : join(process.cwd(), outputOption)
        : join(process.cwd(), "compiled-abi.json");

    const tsPath = jsonPath.endsWith(".json")
        ? `${jsonPath.slice(0, -5)}.ts`
        : `${jsonPath}.ts`;

    return { json: jsonPath, ts: tsPath };
}

function generateAbiTypes(paths: OutputPaths): void {
    const { json: inputPath, ts: outputPath } = paths;

    try {
        // Read the compiled ABI
        const abiContent = readFileSync(inputPath, "utf-8");
        const abiJson = JSON.parse(abiContent);

        // Generate TypeScript content
        const tsContent = `// This file is auto-generated from compiled-abi.json
// Do not edit manually

export const compiledAbi = ${JSON.stringify(abiJson, null, 2)} as const;

export type CompiledAbi = typeof compiledAbi;
`;

        // Write the TypeScript file
        ensureDirectory(outputPath);
        writeFileSync(outputPath, tsContent);

        console.log(`✅ Generated TypeScript types!`);
        console.log(`📄 Type output written to: ${outputPath}`);
        console.log(`
Usage in your code:`);
        console.log(`
import { compiledAbi } from './compiled-abi';`);
        console.log(`import { ExtractAbiTypes } from '@dojoengine/core';`);
        console.log(`
type MyAbi = ExtractAbiTypes<typeof compiledAbi>;`);
        console.log(
            `type Position = MyAbi["structs"]["dojo_starter::models::Position"];`
        );
    } catch (error) {
        console.error(`Error generating types: ${error}`);
        process.exit(1);
    }
}

function walkJsonFiles(root: string, entries: Dirent[] = []): string[] {
    const collected: string[] = [];

    for (const entry of entries) {
        const fullPath = join(root, entry.name);

        if (entry.isDirectory()) {
            const childEntries = readdirSync(fullPath, { withFileTypes: true });
            collected.push(...walkJsonFiles(fullPath, childEntries));
            continue;
        }

        if (entry.isFile() && entry.name.endsWith(".json")) {
            collected.push(fullPath);
        }
    }

    return collected;
}

function collectAbis(options: CollectOptions): void {
    const dojoRoot = process.env.DOJO_ROOT || process.cwd();
    const dojoEnv = process.env.DOJO_ENV || "dev";

    const manifestPath = join(dojoRoot, `manifest_${dojoEnv}.json`);
    const targetDir = join(dojoRoot, "target", dojoEnv);

    const allAbis: AbiEntry[] = [];
    let manifest: Manifest | null = null;

    // Read manifest file
    if (!existsSync(manifestPath)) {
        console.error(`Manifest file not found: ${manifestPath}`);
        process.exit(1);
    }

    try {
        const manifestContent = readFileSync(manifestPath, "utf-8");
        manifest = JSON.parse(manifestContent) as Manifest;

        // Extract ABIs from world
        if (manifest.world?.abi) {
            allAbis.push(...manifest.world.abi);
        }

        // Extract ABIs from contracts
        if (manifest.contracts) {
            for (const contract of manifest.contracts) {
                if (contract.abi) {
                    allAbis.push(...contract.abi);
                }
            }
        }
    } catch (error) {
        console.error(`Error reading manifest file: ${error}`);
        process.exit(1);
    }

    // Read target directory files
    if (!existsSync(targetDir)) {
        console.warn(`Target directory not found: ${targetDir}`);
    } else {
        try {
            const dirEntries = readdirSync(targetDir, { withFileTypes: true });
            const files = walkJsonFiles(targetDir, dirEntries);

            for (const filePath of files) {
                try {
                    const fileContent = readFileSync(filePath, "utf-8");
                    const targetFile: TargetFile = JSON.parse(fileContent);

                    // Extract only the abi key
                    if (targetFile.abi) {
                        allAbis.push(...targetFile.abi);
                    }
                } catch (error) {
                    console.error(`Error reading file ${filePath}: ${error}`);
                }
            }
        } catch (error) {
            console.error(`Error reading target directory: ${error}`);
        }
    }

    const dedupedAbis = new Map<string, AbiEntry>();
    const duplicateCounts: Record<string, number> = {};

    for (const entry of allAbis) {
        const type = typeof entry.type === "string" ? entry.type : "unknown";
        const name =
            typeof (entry as { name?: string }).name === "string"
                ? (entry as { name: string }).name
                : "";
        const interfaceName =
            typeof (entry as { interface_name?: string }).interface_name ===
            "string"
                ? (entry as { interface_name: string }).interface_name
                : "";

        const key = `${type}::${name}::${interfaceName}`;

        if (dedupedAbis.has(key)) {
            duplicateCounts[key] = (duplicateCounts[key] ?? 1) + 1;
            continue;
        }

        dedupedAbis.set(key, entry);
    }

    const mergedAbis = Array.from(dedupedAbis.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([, value]) => value);

    if (Object.keys(duplicateCounts).length > 0) {
        console.warn("!  Duplicate ABI entries detected and ignored:");
        for (const [key, count] of Object.entries(duplicateCounts)) {
            console.warn(`   • ${key} (${count} occurrences)`);
        }
    }

    // Write output
    const output = {
        abi: mergedAbis,
        manifest: manifest && {
            world: manifest.world,
            base: manifest.base,
            contracts: manifest.contracts ?? [],
            models: manifest.models ?? [],
        },
    };

    const paths = resolveOutputPaths(options.outputPath);
    ensureDirectory(paths.json);
    writeFileSync(paths.json, JSON.stringify(output, null, 2));

    console.log(`✅ ABI compilation complete!`);
    console.log(`📄 Output written to: ${paths.json}`);
    console.log(`📊 Total ABI entries: ${mergedAbis.length}`);

    const typeStats = mergedAbis.reduce<Record<string, number>>((acc, item) => {
        const key = typeof item.type === "string" ? item.type : "unknown";
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});

    for (const [abiType, count] of Object.entries(typeStats)) {
        console.log(`   • ${abiType}: ${count}`);
    }

    // Generate TypeScript types if requested
    if (options.generateTypes) {
        generateAbiTypes(paths);
    }
}

function parseArgs(argv: string[]): CollectOptions {
    let generateTypes = false;
    let outputPath: string | undefined;
    let index = 0;

    while (index < argv.length) {
        const arg = argv[index];

        if (arg === "--generate-types") {
            generateTypes = true;
            index += 1;
            continue;
        }

        if (arg === "--output") {
            const value = argv[index + 1];
            if (!value || value.startsWith("--")) {
                console.error("Missing value for --output option");
                process.exit(1);
            }
            outputPath = value;
            index += 2;
            continue;
        }

        if (arg.startsWith("--output=")) {
            const value = arg.slice("--output=".length);
            if (!value) {
                console.error("Missing value for --output option");
                process.exit(1);
            }
            outputPath = value;
            index += 1;
            continue;
        }

        console.warn(`!  Unknown argument ignored: ${arg}`);
        index += 1;
    }

    return {
        generateTypes,
        outputPath,
    };
}

const options = parseArgs(process.argv.slice(2));

try {
    collectAbis(options);
} catch (error) {
    console.error(`Unexpected error: ${error}`);
    process.exit(1);
}
