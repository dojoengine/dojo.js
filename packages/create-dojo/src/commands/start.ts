import { Command } from "commander";
import path from "path";
import { promises as fs } from "fs";
import spawn from "cross-spawn";
import https from "https";
import { input, select } from "@inquirer/prompts";
import { getCatalogVersions } from "../utils/get-package-info";

const templates = [
    {
        value: "example-vite-react-sdk",
        description: "React app using Dojo SDK",
    },
    {
        value: "example-vite-kitchen-sink",
        description: "Vite app with a variety of Dojo features",
    },
    {
        value: "example-vite-react-sql",
        description: "Demonstrates how Torii sql endpoint works.",
    },
    {
        value: "example-vanillajs-phaser-recs",
        description: "Vanilla JS/Phaser app using Dojo RECS",
    },
    {
        value: "example-vite-react-phaser-recs",
        description: "React/Phaser app using Dojo RECS",
    },
    {
        value: "example-vite-react-pwa-recs",
        description: "React Progressive Web App using Dojo RECS",
    },
    {
        value: "example-vite-react-threejs-recs",
        description: "React Three.js app using Dojo RECS",
    },
    {
        value: "example-vite-react-sdk",
        description: "Basic react app using the sdk",
    },
    {
        value: "example-vite-svelte-recs",
        description: "Basic svelte app using Dojo RECS",
    },
    { value: "example-vue-app-recs", description: "Basic vite app using RECS" },
];

async function init(projectName: string, cwd: string, template: string) {
    const projectPath = path.join(cwd, projectName);
    const clientPath = path.join(projectPath, "client");
    const contractPath = path.join(projectPath, "contract");

    // Create project directories
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(clientPath, { recursive: true });
    await fs.mkdir(contractPath, { recursive: true });

    // Clone template into client directory
    console.log(`Downloading ${template} into client directory...`);
    const cloneResult = spawn.sync(
        "npx",
        ["degit", `dojoengine/dojo.js/examples/${template}`, clientPath],
        { stdio: "inherit" }
    );

    if (cloneResult.status !== 0) {
        throw new Error(`Failed to clone template: ${template}`);
    }

    // Rewrite package.json in client directory
    await rewritePackageJson(projectName, clientPath);

    // Update dojoConfig.ts imports
    await rewriteDojoConfigFile(clientPath);

    // Clone dojo-starter
    console.log(`Downloading dojo-starter...`);
    const contractRes = spawn.sync(
        "npx",
        ["degit", `dojoengine/dojo-starter`, contractPath],
        {
            stdio: "inherit",
        }
    );
    if (contractRes.status !== 0) {
        throw new Error(`Failed to clone template: ${template}`);
    }

    console.log(`Project initialized at ${projectPath}`);
    console.log("Congrats! Your new project has been set up successfully.\n");
    console.log(
        `Navigate into your project directory with:\n  cd ${projectName}\n`
    );
    console.log("You can then build the starter and run the client.\n");
    console.log("For detailed instructions, follow the README here:\n");
    console.log("https://book.dojoengine.org/");
}

async function rewritePackageJson(projectName: string, clientPath: string) {
    const packageJsonPath = path.join(clientPath, "package.json");
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
    const latestVersion = await getLatestVersion();
    const catalogVersion = await getCatalogVersions();

    packageJson.name = projectName;

    const updatedPackageJson = {
        ...packageJson,
        dependencies: updateDependencies(
            packageJson.dependencies,
            latestVersion,
            catalogVersion
        ),
        devDependencies: updateDependencies(
            packageJson.devDependencies,
            latestVersion,
            catalogVersion
        ),
        peerDependencies: updateDependencies(
            packageJson.peerDependencies,
            latestVersion,
            catalogVersion
        ),
    };

    await fs.writeFile(
        packageJsonPath,
        JSON.stringify(updatedPackageJson, null, 2)
    );
}

function updateDependencies(
    deps: Record<string, string> | undefined,
    latestVersion: string,
    catalogVersions: Record<string, string>
) {
    if (!deps) return deps;

    const updated = { ...deps };
    for (const [name, version] of Object.entries(deps)) {
        if (version.startsWith("workspace:")) {
            // Find the actual version from root package.json
            updated[name] = latestVersion;
        } else if (version.startsWith("catalog:")) {
            // Find the version from catalog
            const actualVersion = catalogVersions[name];
            if (!actualVersion) {
                throw new Error(
                    `failed to get version for package ${name} from catalog`
                );
            }
            updated[name] = actualVersion;
        }
    }
    return updated;
}

async function rewriteDojoConfigFile(clientPath: string) {
    const dojoConfigPath = path.join(clientPath, "dojoConfig.ts");

    try {
        let content = await fs.readFile(dojoConfigPath, "utf-8");

        // Update relative imports to account for new directory structure
        content = content.replace(
            /from ['"]\.{0,2}\/.*manifest(?:_dev)?\.json['"]/g,
            'from "../contract/manifest_dev.json"'
        );

        await fs.writeFile(dojoConfigPath, content, "utf-8");
    } catch (error) {
        console.warn(`Warning: Could not update dojoConfig.ts: ${error}`);
    }
}

async function getLatestVersion(): Promise<string> {
    return new Promise((resolve, reject) => {
        https
            .get(
                "https://registry.npmjs.org/-/package/@dojoengine/core/dist-tags",
                (res) => {
                    if (res.statusCode === 200) {
                        let body = "";
                        res.on("data", (data) => (body += data));
                        res.on("end", () => {
                            resolve(JSON.parse(body).latest);
                        });
                    } else {
                        reject(
                            new Error(
                                `Failed to fetch latest version: ${res.statusCode}`
                            )
                        );
                    }
                }
            )
            .on("error", (error) => {
                reject(error);
            });
    });
}

export const start = new Command()
    .name("start")
    .description("initialize a new project with a selected template")
    .option("-c, --cwd <cwd>", "the working directory", process.cwd())
    .option("-t, --template <template>", "specify the template to use")
    .action(async (options) => {
        try {
            const cwd = path.resolve(options.cwd);
            let template: string;

            if (options.template) {
                const selectedTemplate = templates.find(
                    (tpl) => tpl.value === options.template
                );
                if (!selectedTemplate) {
                    console.error(
                        `Template "${options.template}" not found. Available templates are: ${templates
                            .map((tpl) => tpl.value)
                            .join(", ")}`
                    );
                    process.exit(1);
                }
                template = selectedTemplate.value;
            } else {
                template = await select({
                    message: "Select a template",
                    choices: templates,
                });
            }

            const projectName = await input({
                message: "Project name ",
                validate: (input: string) => {
                    if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
                    else
                        return "Project name may only include letters, numbers, underscores and hashes.";
                },
                default: template,
            });

            await init(projectName, cwd, template);
        } catch (error) {
            console.error("An error occurred:", error);
            process.exit(1);
        }
    });
