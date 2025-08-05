#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

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

/**
 * Generate a TypeScript file from compiled-abi.json with proper const assertions
 * This allows TypeScript to extract literal types from the ABI
 */
function generateAbiTypes(dojoRoot: string): void {
    const inputPath = join(dojoRoot, "compiled-abi.json");
    const outputPath = join(dojoRoot, "compiled-abi.ts");

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
        writeFileSync(outputPath, tsContent);

        console.log(`✅ Generated TypeScript types!`);
        console.log(`📄 Output written to: ${outputPath}`);
        console.log(`\nUsage in your code:`);
        console.log(`\nimport { compiledAbi } from './compiled-abi';`);
        console.log(`import { ExtractAbiTypes } from '@dojoengine/core';`);
        console.log(`\ntype MyAbi = ExtractAbiTypes<typeof compiledAbi>;`);
        console.log(
            `type Position = MyAbi["structs"]["dojo_starter::models::Position"];`
        );
    } catch (error) {
        console.error(`Error generating types: ${error}`);
        process.exit(1);
    }
}

function collectAbis(generateTypes: boolean): void {
    const dojoRoot = process.env.DOJO_ROOT || process.cwd();
    const dojoEnv = process.env.DOJO_ENV || "dev";

    const manifestPath = join(dojoRoot, `manifest_${dojoEnv}.json`);
    const targetDir = join(dojoRoot, "target", dojoEnv);

    const allAbis: AbiEntry[] = [];

    // Read manifest file
    if (!existsSync(manifestPath)) {
        console.error(`Manifest file not found: ${manifestPath}`);
        process.exit(1);
    }

    try {
        const manifestContent = readFileSync(manifestPath, "utf-8");
        const manifest: Manifest = JSON.parse(manifestContent);

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
            const files = readdirSync(targetDir).filter((file) =>
                file.endsWith(".json")
            );

            for (const file of files) {
                const filePath = join(targetDir, file);
                try {
                    const fileContent = readFileSync(filePath, "utf-8");
                    const targetFile: TargetFile = JSON.parse(fileContent);

                    // Extract only the abi key
                    if (targetFile.abi) {
                        allAbis.push(...targetFile.abi);
                    }
                } catch (error) {
                    console.error(`Error reading file ${file}: ${error}`);
                }
            }
        } catch (error) {
            console.error(`Error reading target directory: ${error}`);
        }
    }

    // Write output
    const output = {
        abi: allAbis,
    };

    const outputPath = join(dojoRoot, "compiled-abi.json");
    writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`✅ ABI compilation complete!`);
    console.log(`📄 Output written to: ${outputPath}`);
    console.log(`📊 Total ABI entries: ${allAbis.length}`);

    // Generate TypeScript types if requested
    if (generateTypes) {
        generateAbiTypes(dojoRoot);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const generateTypes = args.includes("--generate-types");

// Run the compilation
try {
    collectAbis(generateTypes);
} catch (error) {
    console.error(`Unexpected error: ${error}`);
    process.exit(1);
}
