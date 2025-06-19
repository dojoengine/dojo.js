import { confirm, input, select } from "@inquirer/prompts";
import path from "node:path";
import { handleAkatsukiStarter } from "./prompts/akatsuki-starter";
import { selectAppType } from "./prompts/app-type";
import { promptForContracts } from "./prompts/contracts";
import { selectFramework } from "./prompts/framework";
import { promptForDependencies } from "./prompts/dependencies";
import { generateClientApp } from "./generators/client-app";
import { generateWorkerApp } from "./generators/worker-app";

export interface CreateDojoOptions {
    yes?: boolean;
    useAkatsuki?: boolean;
    type?: string;
    contractsPath?: string;
    framework?: string;
}

export interface ProjectConfig {
    projectName: string;
    projectPath: string;
    appType: "client" | "worker";
    useExistingContracts: boolean;
    contractsPath?: string;
    framework?: string;
    additionalDeps?: string[];
    features?: {
        stateManagement?: string;
        uiLibrary?: string;
        testing?: boolean;
        pwa?: boolean;
    };
}

export async function runInteractiveFlow(options: CreateDojoOptions) {
    console.log("🎮 Welcome to create-dojo!\n");

    // Check if user wants to use AkatsukiLabs Starter
    const useAkatsuki =
        options.useAkatsuki ??
        (!options.yes &&
            (await confirm({
                message:
                    "Do you want to use AkatsukiLabs Starter? (recommended for game development)",
                default: false,
            })));

    if (useAkatsuki) {
        await handleAkatsukiStarter();
        return;
    }

    // Get project name
    const projectName = await input({
        message: "What is your project name?",
        default: "my-dojo-app",
        validate: (input: string) => {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
            return "Project name may only include letters, numbers, underscores and hyphens.";
        },
    });

    // Get project directory
    const projectDir = await input({
        message: "Where would you like to create your Dojo.js app?",
        default: `./${projectName}`,
    });

    const projectPath = path.resolve(process.cwd(), projectDir);

    // Select app type
    const appType =
        (options.type as "client" | "worker") || (await selectAppType());

    // Check for existing contracts
    const contractsInfo = await promptForContracts(options.contractsPath);

    let framework: string | undefined;
    let additionalDeps: string[] = [];
    let features: ProjectConfig["features"] = {};

    if (appType === "client") {
        // Select framework
        framework = options.framework || (await selectFramework());

        // Get additional dependencies and features
        const depsInfo = await promptForDependencies(framework);
        additionalDeps = depsInfo.dependencies;
        features = depsInfo.features;
    }

    // Create project configuration
    const projectConfig: ProjectConfig = {
        projectName,
        projectPath,
        appType,
        useExistingContracts: contractsInfo.useExisting,
        contractsPath: contractsInfo.contractsPath,
        framework,
        additionalDeps,
        features,
    };

    // Generate the appropriate app type
    console.log("\n🚀 Creating your Dojo.js app...\n");

    if (appType === "client") {
        await generateClientApp(projectConfig);
    } else {
        await generateWorkerApp(projectConfig);
    }

    // Success message
    console.log("\n✨ Your Dojo.js app has been created successfully!\n");
    console.log(`📁 Project location: ${projectPath}`);
    console.log("\n🏃 Next steps:");
    console.log(`   cd ${projectDir}`);
    console.log("   pnpm install");

    if (!contractsInfo.useExisting) {
        console.log("\n!  Don't forget to create your Dojo contracts!");
        console.log("   You can find them in the 'contracts' directory");
    }

    console.log(
        "\n📚 For more information, visit https://book.dojoengine.org/"
    );
}
