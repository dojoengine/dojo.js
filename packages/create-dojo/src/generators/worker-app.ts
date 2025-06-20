import { promises as fs } from "node:fs";
import path from "node:path";
import spawn from "cross-spawn";
import { ProjectConfig } from "../interactive-flow";
import { createProjectStructure } from "./project-structure";
import { generateDojoConfig } from "./dojo-config";
import { getLatestDojoVersions } from "../utils/dojo-versions";

export async function generateWorkerApp(config: ProjectConfig) {
    // Create project structure
    await createProjectStructure(config);

    // Generate worker-specific files
    await generateWorkerTemplate(config);

    // Generate dojoConfig.ts
    await generateDojoConfig(config);

    // Create package.json
    await createWorkerPackageJson(config);

    // Create configuration files
    await createWorkerConfigFiles(config);

    // Initialize git repository
    await initGitRepo(config.projectPath);

    // Install dependencies
    console.log("📦 Installing dependencies...");
    await installDependencies(config.projectPath);
}

async function generateWorkerTemplate(config: ProjectConfig) {
    const { projectPath } = config;
    const srcPath = path.join(projectPath, "src");

    // Create main.ts
    const mainContent = `import { init } from "@dojoengine/sdk";
import { getSyncEntities } from "@dojoengine/state";
import { dojoConfig } from "../dojoConfig";
import * as models from "./models.gen";

const sdk = await init({
    client: {
        toriiUrl: dojoConfig.toriiUrl,
        worldAddress: dojoConfig.manifest.world.address,
    },
    domain: {
        name: "node-worker",
        version: "0.0.1",
        chainId: "KATANA",
        revision: "1",
    },

    identity: env.IDENTITY,
    signer: new SigningKey(env.SECRET_KEY),
});

await createWorker(async () => {
    const query = new ToriiQueryBuilder()
        .withClause(
            KeysClause(
                [],
                [undefined],
                "VariableLen"
            ).build()
        )
        .includeHashedKeys();

    const [entities, sub] = await sdk.subscribeEntityQuery({
        query,
        callback: onEntityUpdated,
    });

    console.log("Entities from worker", entities.getItems());

    return [sub];
});
`;

    await fs.writeFile(path.join(srcPath, "main.ts"), mainContent);

    // Create models.gen.ts placeholder
    const modelsContent = `// Generated models will be placed here
// Run 'sozo build --typescript'

export {};
`;

    await fs.writeFile(path.join(srcPath, "models.gen.ts"), modelsContent);

    // Create example worker tasks
    const tasksDir = path.join(srcPath, "tasks");
    await fs.mkdir(tasksDir, { recursive: true });

    const exampleTaskContent = `import { SDK } from "@dojoengine/sdk";

export class ExampleTask {
    constructor(private sdk: SDK) {}

    async execute() {
        // Example: Monitor and process game events
        console.log("Executing example task...");
        
        // Add your worker logic here
        // - Process transactions
        // - Update game state
        // - Send notifications
        // - Run periodic tasks
    }

    async processEntity(entity: any) {
        // Process individual entity changes
        console.log("Processing entity:", entity);
    }
}
`;

    await fs.writeFile(
        path.join(tasksDir, "example-task.ts"),
        exampleTaskContent
    );
}

async function createWorkerPackageJson(config: ProjectConfig) {
    const { projectName, projectPath } = config;
    const versions = await getLatestDojoVersions();

    const packageJson = {
        name: projectName,
        version: "0.1.0",
        private: true,
        type: "module",
        main: "dist/main.js",
        scripts: {
            dev: "tsx watch src/main.ts",
            build: "tsc",
            start: "node dist/main.js",
            generate: "npx @dojoengine/sdk generate",
        },
        dependencies: {
            "@dojoengine/core": versions.core,
            "@dojoengine/sdk": versions.sdk,
            "@dojoengine/torii-wasm": versions.toriiWasm,
            "@dojoengine/state": "latest",
            viem: "^2.21.54",
        },
        devDependencies: {
            typescript: "^5.6.2",
            tsx: "^4.22.4",
            "@types/node": "^20.0.0",
        },
    };

    await fs.writeFile(
        path.join(projectPath, "package.json"),
        JSON.stringify(packageJson, null, 2)
    );
}

async function createWorkerConfigFiles(config: ProjectConfig) {
    const { projectPath, projectName } = config;

    // Create tsconfig.json
    const tsConfig = {
        compilerOptions: {
            target: "ES2020",
            module: "ESNext",
            lib: ["ES2020"],
            moduleResolution: "bundler",
            outDir: "./dist",
            rootDir: "./src",
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: false,
            allowSyntheticDefaultImports: true,
            allowImportingTsExtensions: false,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true,
        },
        include: ["src/**/*", "dojoConfig.ts"],
        exclude: ["node_modules", "dist"],
    };

    await fs.writeFile(
        path.join(projectPath, "tsconfig.json"),
        JSON.stringify(tsConfig, null, 2)
    );

    // Create .gitignore
    const gitignore = `# Dependencies
node_modules
.pnpm-store

# Build outputs
dist
build

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

# TypeScript
*.tsbuildinfo`;

    await fs.writeFile(path.join(projectPath, ".gitignore"), gitignore);

    // Create README.md
    const readme = `# ${projectName}

A Dojo.js worker application for processing blockchain events and game logic.

## Getting Started

1. Copy \`.env.example\` to \`.env\` and configure your environment:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   pnpm install
   \`\`\`

3. Generate models from your contracts:
   \`\`\`bash
   pnpm generate
   \`\`\`

4. Run the worker in development mode:
   \`\`\`bash
   pnpm dev
   \`\`\`

## Production

Build the worker:
\`\`\`bash
pnpm build
\`\`\`

Run the built worker:
\`\`\`bash
pnpm start
\`\`\`

## Worker Features

- Subscribes to Dojo world events
- Processes entity changes in real-time
- Includes example task structure
- Built-in logging utilities

## Learn More

- [Dojo Book](https://book.dojoengine.org/)
- [Dojo SDK Documentation](https://github.com/dojoengine/dojo.js)
`;

    await fs.writeFile(path.join(projectPath, "README.md"), readme);
}

async function initGitRepo(projectPath: string) {
    try {
        spawn.sync("git", ["init"], { cwd: projectPath, stdio: "ignore" });
    } catch (error) {
        // Git init is optional
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
