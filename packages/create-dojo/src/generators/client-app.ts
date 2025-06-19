import { promises as fs } from "node:fs";
import path from "node:path";
import spawn from "cross-spawn";
import { ProjectConfig } from "../interactive-flow";
import { createProjectStructure } from "./project-structure";
import { generateDojoConfig } from "./dojo-config";
import { generateTemplate } from "./template-generator";
import { getLatestDojoVersions } from "../utils/dojo-versions";

export async function generateClientApp(config: ProjectConfig) {
    // Create project structure
    await createProjectStructure(config);

    // Generate framework-specific files
    await generateTemplate(config);

    // Generate dojoConfig.ts
    await generateDojoConfig(config);

    // Create package.json
    await createPackageJson(config);

    // Create common configuration files
    await createConfigFiles(config);

    // Initialize git repository
    await initGitRepo(config.projectPath);

    // Install dependencies
    console.log("📦 Installing dependencies...");
    await installDependencies(config.projectPath);
}

async function createPackageJson(config: ProjectConfig) {
    const { projectName, projectPath, framework, additionalDeps } = config;
    const versions = await getLatestDojoVersions();

    const packageJson: any = {
        name: projectName,
        version: "0.1.0",
        private: true,
        type: "module",
        scripts: {},
        dependencies: {
            "@dojoengine/core": versions.core,
            "@dojoengine/sdk": versions.sdk,
            "@dojoengine/torii-wasm": versions.toriiWasm,
            "@dojoengine/predeployed-connector": versions.predeployedConnector,
        },
        devDependencies: {
            typescript: "^5.6.2",
        },
    };

    // Add framework-specific dependencies and scripts
    switch (framework) {
        case "react-vite":
            packageJson.dependencies = {
                ...packageJson.dependencies,
                react: "^18.3.1",
                "react-dom": "^18.3.1",
                "@tanstack/react-query": "^5.0.0",
                viem: "^2.21.54",
                "@starknet-react/chains": "^3.0.0",
                "@starknet-react/core": "^3.0.0",
            };
            packageJson.devDependencies = {
                ...packageJson.devDependencies,
                "@vitejs/plugin-react": "^4.3.4",
                "@types/react": "^18.3.16",
                "@types/react-dom": "^18.3.5",
                vite: "^6.0.3",
            };
            packageJson.scripts = {
                dev: "vite",
                build: "tsc && vite build",
                preview: "vite preview",
            };
            break;

        case "vue-vite":
            packageJson.dependencies = {
                ...packageJson.dependencies,
                vue: "^3.5.13",
            };
            packageJson.devDependencies = {
                ...packageJson.devDependencies,
                "@vitejs/plugin-vue": "^5.2.1",
                vite: "^6.0.3",
            };
            packageJson.scripts = {
                dev: "vite",
                build: "vite build",
                preview: "vite preview",
            };
            break;

        case "vanilla-vite":
            packageJson.devDependencies = {
                ...packageJson.devDependencies,
                vite: "^6.0.3",
            };
            packageJson.scripts = {
                dev: "vite",
                build: "vite build",
                preview: "vite preview",
            };
            break;

        case "sveltekit":
            packageJson.dependencies = {
                ...packageJson.dependencies,
                "@sveltejs/kit": "^2.0.0",
            };
            packageJson.devDependencies = {
                ...packageJson.devDependencies,
                "@sveltejs/adapter-auto": "^3.0.0",
                "@sveltejs/vite-plugin-svelte": "^3.0.0",
                svelte: "^4.0.0",
                vite: "^6.0.3",
            };
            packageJson.scripts = {
                dev: "vite dev",
                build: "vite build",
                preview: "vite preview",
            };
            break;
    }

    // Add additional dependencies
    if (additionalDeps && additionalDeps.length > 0) {
        additionalDeps.forEach((dep) => {
            if (
                dep.includes("eslint") ||
                dep.includes("prettier") ||
                dep.includes("vitest")
            ) {
                packageJson.devDependencies[dep] = "latest";
            } else {
                packageJson.dependencies[dep] = "latest";
            }
        });
    }

    // Add lint and test scripts if applicable
    if (additionalDeps?.includes("eslint")) {
        packageJson.scripts.lint = "eslint src --ext ts,tsx";
    }
    if (additionalDeps?.includes("prettier")) {
        packageJson.scripts.format = "prettier --write src";
    }
    if (config.features?.testing) {
        packageJson.scripts.test = "vitest";
    }

    await fs.writeFile(
        path.join(projectPath, "package.json"),
        JSON.stringify(packageJson, null, 2)
    );
}

async function createConfigFiles(config: ProjectConfig) {
    const { projectPath, framework, additionalDeps, features } = config;

    // Create tsconfig.json
    const tsConfig = {
        compilerOptions: {
            target: "ES2020",
            useDefineForClassFields: true,
            lib: ["ES2020", "DOM", "DOM.Iterable"],
            module: "ESNext",
            skipLibCheck: true,
            moduleResolution: "bundler",
            allowImportingTsExtensions: true,
            isolatedModules: true,
            moduleDetection: "force",
            noEmit: true,
            jsx: framework?.includes("react") ? "react-jsx" : undefined,
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
        },
        include: ["src/**/*"],
        references: [{ path: "./tsconfig.node.json" }],
    };

    await fs.writeFile(
        path.join(projectPath, "tsconfig.json"),
        JSON.stringify(tsConfig, null, 2)
    );

    // Create vite config if needed
    if (framework?.includes("vite")) {
        let viteConfig = `import { defineConfig } from 'vite'\n`;

        if (framework === "react-vite") {
            viteConfig += `import react from '@vitejs/plugin-react'\n\n`;
            viteConfig += `export default defineConfig({\n  plugins: [react()],\n})`;
        } else if (framework === "vue-vite") {
            viteConfig += `import vue from '@vitejs/plugin-vue'\n\n`;
            viteConfig += `export default defineConfig({\n  plugins: [vue()],\n})`;
        } else {
            viteConfig += `\nexport default defineConfig({\n  plugins: [],\n})`;
        }

        await fs.writeFile(
            path.join(projectPath, "vite.config.ts"),
            viteConfig
        );
    }

    // Create .gitignore
    const gitignore = `# Dependencies
node_modules
.pnpm-store

# Build outputs
dist
build
.next
.svelte-kit

# Environment files
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Test coverage
coverage
*.lcov

# TypeScript
*.tsbuildinfo`;

    await fs.writeFile(path.join(projectPath, ".gitignore"), gitignore);

    // Create README.md
    const readme = `# ${config.projectName}

A Dojo.js application built with ${framework?.replace("-", " + ") || "TypeScript"}.

## Getting Started

Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

Run the development server:
\`\`\`bash
pnpm dev
\`\`\`

## Built With

- [Dojo Engine](https://www.dojoengine.org/)
- ${framework?.includes("react") ? "[React](https://react.dev/)" : ""}
- ${framework?.includes("vue") ? "[Vue](https://vuejs.org/)" : ""}
- ${framework?.includes("vite") ? "[Vite](https://vitejs.dev/)" : ""}
- ${framework?.includes("svelte") ? "[SvelteKit](https://kit.svelte.dev/)" : ""}

## Learn More

- [Dojo Book](https://book.dojoengine.org/)
- [Dojo Examples](https://github.com/dojoengine/dojo.js/tree/main/examples)
`;

    await fs.writeFile(
        path.join(projectPath, "README.md"),
        readme.replace(/\n\n+/g, "\n\n").trim()
    );
}

async function initGitRepo(projectPath: string) {
    try {
        spawn.sync("git", ["init"], { cwd: projectPath, stdio: "ignore" });
    } catch (error) {
        // Git init is optional, don't fail if it doesn't work
    }
}

async function installDependencies(projectPath: string) {
    const result = spawn.sync("pnpm", ["install"], {
        cwd: projectPath,
        stdio: "inherit",
    });

    if (result.status !== 0) {
        console.warn("!  Failed to install dependencies automatically");
        console.log("   Please run 'pnpm install' manually");
    }
}
