#!/usr/bin/env node

import spawn from "cross-spawn";
import * as fs from "fs";
import https from "https";
import path from "path";

import { input, select } from "@inquirer/prompts";

const templates = [
    {
        value: "react-app",
        description: "React app using Dojo",
    },
    {
        value: "react-phaser-example",
        description: "React/Phaser app using Dojo",
    },
    {
        value: "react-pwa-app",
        description: "React Progressive Web Apps using Dojo",
    },
    {
        value: "react-threejs",
        description: "React Threejs using Dojo",
    },
];

run();

async function run() {
    try {
        const { template, projectName } = await prompt();

        // Create the main project directory
        const projectPath = path.join(process.cwd(), projectName);
        fs.mkdirSync(projectPath, { recursive: true });

        // clone template using degit into projectName directory
        console.log(`Downloading ${template}...`);
        spawn.sync("npx", [
            "degit",
            `dojoengine/dojo.js/examples/react/${template}`,
            projectName, // Cloning directly into the project directory
        ]);

        // rewrite package.json
        await rewritePackageJson(projectName);

        // clone dojo-starter into a subdirectory of the project directory
        const dojoStarterPath = path.join(projectPath, 'dojo-starter');
        console.log(`Downloading dojo-starter...`);
        spawn.sync("npx", ["degit", `dojoengine/dojo-starter`, dojoStarterPath]);

        console.log("Congrats! You are now installed.");
        console.log("\nYou can now build the starter and run the client. Follow the readme here:");

        console.log('https://book.dojoengine.org/cairo/hello-dojo');

    } catch (e: any) {
        console.log(e);
    }
}

async function rewritePackageJson(projectName: string) {
    const packageJsonPath = path.join(
        process.cwd(),
        projectName,
        "package.json"
    );
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const latestVersion = await getLatestVersion();

    // rename using projectName
    packageJson.name = projectName;

    // rewrite all link:dojo-packages/packages/... with latest version
    for (let dep of Object.keys(packageJson.dependencies)) {
        if (
            dep.startsWith("@dojoengine") &&
            packageJson.dependencies[dep].startsWith("workspace:")
        ) {
            packageJson.dependencies[dep] = latestVersion;
        }
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

async function prompt(): Promise<{ template: string; projectName: string }> {
    const template = await select({
        message: "Select a template",
        choices: templates,
    });

    const projectName = await input({
        message: "Project name ",
        validate: (input: string) => {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
            else
                return "Project name may only include letters, numbers, underscores and hashes.";
        },
        default: template,
    });

    return { template, projectName };
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
                        reject();
                    }
                }
            )
            .on("error", () => {
                reject();
            });
    });
}
