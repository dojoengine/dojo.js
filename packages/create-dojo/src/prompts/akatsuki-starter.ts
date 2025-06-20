import { input } from "@inquirer/prompts";
import spawn from "cross-spawn";
import path from "node:path";

export async function handleAkatsukiStarter() {
    console.log(
        "\n🎮 Great choice! AkatsukiLabs Starter is perfect for game development.\n"
    );

    const projectName = await input({
        message: "What is your game project name?",
        default: "my-dojo-game",
        validate: (input: string) => {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
            return "Project name may only include letters, numbers, underscores and hyphens.";
        },
    });

    const projectPath = path.resolve(process.cwd(), projectName);

    console.log("\n📥 Cloning AkatsukiLabs Dojo Game Starter...\n");

    const cloneResult = spawn.sync(
        "git",
        [
            "clone",
            "https://github.com/AkatsukiLabs/Dojo-Game-Starter",
            projectPath,
        ],
        { stdio: "inherit" }
    );

    if (cloneResult.status !== 0) {
        throw new Error("Failed to clone AkatsukiLabs Starter");
    }

    // Remove .git directory
    const removeGitResult = spawn.sync(
        "rm",
        ["-rf", path.join(projectPath, ".git")],
        { stdio: "inherit" }
    );

    if (removeGitResult.status !== 0) {
        console.warn("Warning: Could not remove .git directory");
    }

    console.log("\n✨ AkatsukiLabs Starter has been set up successfully!\n");
    console.log(`📁 Project location: ${projectPath}`);
    console.log("\n🏃 Next steps:");
    console.log(`   cd ${projectName}`);
    console.log("   Follow the instructions in the README.md file");
    console.log("\n📚 AkatsukiLabs Starter includes:");
    console.log("   - Complete React + Dojo integration");
    console.log("   - Cairo smart contracts with game mechanics");
    console.log("   - Achievement system");
    console.log("   - Wallet integration with session policies");
    console.log("\n🚀 Happy game building!");
}
