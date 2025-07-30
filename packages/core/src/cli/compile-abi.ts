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

function collectAbis(): void {
    const dojoRoot = process.env.DOJO_ROOT || process.cwd();
    const dojoEnv = process.env.DOJO_ENV || "dev";

    const manifestPath = join(dojoRoot, `manifest_${dojoEnv}.json`);
    const targetDir = join(dojoRoot, "target", dojoEnv);

    const allAbis: AbiEntry[] = [];

    // Read manifest file
    if (existsSync(manifestPath)) {
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
    } else {
        console.error(`Manifest file not found: ${manifestPath}`);
        process.exit(1);
    }

    // Read target directory files
    if (existsSync(targetDir)) {
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
    } else {
        console.warn(`Target directory not found: ${targetDir}`);
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
}

// Run the compilation
try {
    collectAbis();
} catch (error) {
    console.error(`Unexpected error: ${error}`);
    process.exit(1);
}
