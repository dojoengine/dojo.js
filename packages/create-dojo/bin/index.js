#!/usr/bin/env node

// src/index.ts
import https from "https";
import spawn from "cross-spawn";
import path from "path";
import * as fs from "fs";
import { input, select } from "@inquirer/prompts";
var templates = [
  {
    value: "react-app",
    description: "React app using Dojo"
  },
  {
    value: "react-phaser-example",
    description: "React/Phaser app using Dojo"
  }
];
run();
async function run() {
  try {
    const { template, projectName } = await prompt();
    console.log(`Downloading ${template}...`);
    spawn.sync("npx", [
      "degit",
      `dojoengine/dojo.js/examples/${template}`,
      `${projectName}`
    ]);
    await rewritePackageJson(projectName);
    console.log(`Downloading dojo-starter...`);
    spawn.sync("npx", ["degit", `dojoengine/dojo-starter`, `dojo-starter`]);
  } catch (e) {
    console.log(e);
  }
}
async function rewritePackageJson(projectName) {
  const packageJsonPath = path.join(
    process.cwd(),
    projectName,
    "package.json"
  );
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const latestVersion = await getLatestVersion();
  packageJson.name = projectName;
  for (let dep of Object.keys(packageJson.dependencies)) {
    if (dep.startsWith("@dojoengine") && packageJson.dependencies[dep].startsWith("link:")) {
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