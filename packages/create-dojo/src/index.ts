#!/usr/bin/env node
import { Command } from "commander";
import { getPackageInfo } from "./utils/get-package-info";
import { runInteractiveFlow } from "./interactive-flow";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
    const packageInfo = getPackageInfo();

    const program = new Command()
        .name("create-dojo")
        .description("Create a new Dojo.js application")
        .version(
            packageInfo.version || "1.0.0",
            "-v, --version",
            "display the version number"
        )
        .option("-y, --yes", "Skip prompts and use defaults")
        .option("--use-akatsuki", "Use AkatsukiLabs Starter")
        .option("--type <type>", "App type: client or worker")
        .option("--contracts-path <path>", "Path to existing contracts")
        .option("--framework <framework>", "Framework to use")
        .action(async (options) => {
            try {
                await runInteractiveFlow(options);
            } catch (error) {
                console.error("An error occurred:", error);
                process.exit(1);
            }
        });

    program.parse();
}

main();
