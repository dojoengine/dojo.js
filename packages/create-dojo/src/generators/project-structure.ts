import { promises as fs } from "node:fs";
import path from "node:path";
import { ProjectConfig } from "../interactive-flow";

export async function createProjectStructure(config: ProjectConfig) {
    const { projectPath, appType, useExistingContracts } = config;

    // Create main project directory
    await fs.mkdir(projectPath, { recursive: true });

    // Create src directory
    const srcPath = path.join(projectPath, "src");
    await fs.mkdir(srcPath, { recursive: true });

    // Create public directory for client apps
    if (appType === "client") {
        const publicPath = path.join(projectPath, "public");
        await fs.mkdir(publicPath, { recursive: true });
    }

    // Create contracts directory if not using existing contracts
    if (!useExistingContracts) {
        const contractsPath = path.join(projectPath, "contracts");
        await fs.mkdir(contractsPath, { recursive: true });

        // Create a basic README for contracts
        const contractsReadme = `# Dojo Contracts

This directory will contain your Dojo smart contracts.

## Getting Started

1. Install Dojo: https://book.dojoengine.org/getting-started/installation
2. Initialize a new Dojo project here:
   \`\`\`bash
   cd contracts
   sozo init
   \`\`\`

3. Build your contracts:
   \`\`\`bash
   sozo build
   \`\`\`

4. Deploy to local node:
   \`\`\`bash
   sozo migrate
   \`\`\`

## Learn More

- [Dojo Book](https://book.dojoengine.org/)
- [Cairo Book](https://book.cairo-lang.org/)
`;

        await fs.writeFile(
            path.join(contractsPath, "README.md"),
            contractsReadme
        );
    }
}
