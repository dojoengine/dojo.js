#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Generate a TypeScript file from compiled-abi.json with proper const assertions
 * This allows TypeScript to extract literal types from the ABI
 */
function generateAbiTypes(): void {
    const inputPath = join(process.cwd(), "compiled-abi.json");
    const outputPath = join(process.cwd(), "compiled-abi.ts");

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
        console.error(`Error: ${error}`);
        process.exit(1);
    }
}

// Run the generation
generateAbiTypes();
