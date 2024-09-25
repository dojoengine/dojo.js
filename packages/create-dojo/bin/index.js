// src/commands/start.ts
import { Command } from "commander";
import path from "path";
import { promises as fs } from "fs";
import { execSync } from "child_process";
import prompts from "prompts";
var repos = [
    { name: "client", url: "https://github.com/example/client-repo.git" },
    { name: "contracts", url: "https://github.com/example/contracts-repo.git" },
];
async function init(projectName, cwd) {
    const projectPath = path.join(cwd, projectName);
    await fs.mkdir(projectPath, { recursive: true });
    for (const repo of repos) {
        console.log(`Cloning ${repo.name} repository...`);
        execSync(`git clone ${repo.url} ${path.join(projectPath, repo.name)}`, {
            stdio: "inherit",
        });
    }
    const readmePath = path.join(projectPath, "README.md");
    const readmeContent = `# ${projectName}

This project contains:
- Client
- Contracts`;
    await fs.writeFile(readmePath, readmeContent);
    console.log(`Project initialized at ${projectPath}`);
}
var start = new Command()
    .name("start")
    .description(
        "initialize a new project with client and contracts repositories"
    )
    .option("-c, --cwd <cwd>", "the working directory", process.cwd())
    .action(async (options) => {
        try {
            const cwd = path.resolve(options.cwd);
            const response = await prompts({
                type: "text",
                name: "projectName",
                message: "What would you like to name your project?",
            });
            if (!response.projectName) {
                console.error("Project name is required.");
                process.exit(1);
            }
            await init(response.projectName, cwd);
            console.log("Initialization complete");
        } catch (error) {
            console.error("An error occurred:", error);
            process.exit(1);
        }
    });

// src/index.ts
import { Command as Command2 } from "commander";

// src/utils/get-package-info.ts
import path2 from "path";
import fs2 from "fs-extra";
function getPackageInfo() {
    const packageJsonPath = path2.join("package.json");
    return fs2.readJSONSync(packageJsonPath);
}

// src/index.ts
process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));
async function main() {
    const packageInfo = await getPackageInfo();
    const program = new Command2()
        .name("@dojoengine")
        .description("install a dojoc client")
        .version(
            packageInfo.version || "1.0.0",
            "-v, --version",
            "display the version number"
        );
    program.addCommand(start);
    program.parse();
}
main();
//# sourceMappingURL=index.js.map
