#!/usr/bin/env node

// src/index.ts
import spawn from "cross-spawn";
import * as fs from "fs";
import https from "https";
import path from "path";
import { input, select } from "@inquirer/prompts";
var templates = [
  {
    value: "react-app",
    description: "React app using Dojo"
  },
  {
    value: "react-phaser-example",
    description: "React/Phaser app using Dojo"
  },
  {
    value: "react-pwa-app",
    description: "React Progressive Web Apps using Dojo"
  },
  {
    value: "react-threejs",
    description: "React Threejs using Dojo"
  }
];
run();
async function run() {
  try {
    const { template, projectName } = await prompt();
    const projectPath = path.join(process.cwd(), projectName);
    fs.mkdirSync(projectPath, { recursive: true });
    const clientPath = path.join(projectPath, "client");
    const dojoStarterPath = path.join(projectPath, "dojo-starter");
    fs.mkdirSync(clientPath, { recursive: true });
    fs.mkdirSync(dojoStarterPath, { recursive: true });
    console.log(`Downloading ${template} into client directory...`);
    spawn.sync("npx", [
      "degit",
      `dojoengine/dojo.js/examples/react/${template}`,
      clientPath
      // Cloning directly into the client directory
    ]);
    if (!fs.existsSync(clientPath)) {
      throw new Error(`Client directory not found at ${clientPath}`);
    }
    await rewritePackageJson(projectName);
    console.log(`Downloading dojo-starter...`);
    spawn.sync("npx", ["degit", `dojoengine/dojo-starter`, dojoStarterPath]);
    console.log("Congrats! Your new project has been set up successfully.\n");
    console.log(`Navigate into your project directory with:
  cd ${projectName}
`);
    console.log("You can then build the starter and run the client.\n");
    console.log("For detailed instructions, follow the README here:\n");
    console.log("https://book.dojoengine.org/cairo/hello-dojo");
  } catch (e) {
    console.error(`Error: ${e}`);
  }
}
async function rewritePackageJson(projectName) {
  const clientPath = path.join(process.cwd(), projectName, "client");
  process.chdir(clientPath);
  const packageJsonPath = path.join("package.json");
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found in ${clientPath}`);
  }
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const latestVersion = await getLatestVersion();
  packageJson.name = projectName;
  for (let dep of Object.keys(packageJson.dependencies)) {
    if (dep.startsWith("@dojoengine") && packageJson.dependencies[dep].startsWith("workspace:")) {
      packageJson.dependencies[dep] = latestVersion;
    }
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}
async function prompt() {
  const template = await select({
    message: "Select a template",
    choices: templates
  });
  const projectName = await input({
    message: "Project name ",
    validate: (input2) => {
      if (/^([A-Za-z\-\_\d])+$/.test(input2))
        return true;
      else
        return "Project name may only include letters, numbers, underscores and hashes.";
    },
    default: template
  });
  return { template, projectName };
}
async function getLatestVersion() {
  return new Promise((resolve, reject) => {
    https.get(
      "https://registry.npmjs.org/-/package/@dojoengine/core/dist-tags",
      (res) => {
        if (res.statusCode === 200) {
          let body = "";
          res.on("data", (data) => body += data);
          res.on("end", () => {
            resolve(JSON.parse(body).latest);
          });
        } else {
          reject();
        }
      }
    ).on("error", () => {
      reject();
    });
  });
}
//# sourceMappingURL=index.js.map