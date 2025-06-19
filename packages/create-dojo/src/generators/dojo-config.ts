import { promises as fs } from "node:fs";
import path from "node:path";
import { ProjectConfig } from "../interactive-flow";

export async function generateDojoConfig(config: ProjectConfig) {
    const { projectPath, useExistingContracts, contractsPath } = config;

    let dojoConfigContent: string;

    if (useExistingContracts && contractsPath) {
        // Try to read manifest from contracts path
        const manifestPath = path.join(contractsPath, "manifest_dev.json");
        let hasManifest = false;

        try {
            await fs.access(manifestPath);
            hasManifest = true;
        } catch {
            // Manifest doesn't exist yet
        }

        if (hasManifest) {
            // Calculate relative path from project to contracts
            const relativePath = path.relative(projectPath, contractsPath);

            dojoConfigContent = `import { createDojoConfig } from "@dojoengine/core";
import manifest from "${relativePath}/manifest_dev.json";

export const dojoConfig = createDojoConfig({ manifest });
`;
        } else {
            // No manifest yet, create a placeholder config
            dojoConfigContent = `import { createDojoConfig } from "@dojoengine/core";
// import manifest from "${path.relative(projectPath, contractsPath)}/manifest_dev.json";

export const dojoConfig = createDojoConfig({ manifest });
`;
        }
    } else {
        // No existing contracts, create placeholder
        dojoConfigContent = `import { createDojoConfig } from "@dojoengine/core";
// import manifest from "./contracts/manifest_dev.json";

export const dojoConfig = createDojoConfig({ manifest });
`;
    }

    await fs.writeFile(
        path.join(projectPath, "dojoConfig.ts"),
        dojoConfigContent
    );
}
