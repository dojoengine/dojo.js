import { promises as fs } from "node:fs";
import path from "node:path";
import { ProjectConfig } from "../interactive-flow";

export async function generateTemplate(config: ProjectConfig) {
    const { framework } = config;

    switch (framework) {
        case "react-vite":
            await copyTemplateFiles(config, "react");
            break;
        case "vue-vite":
            await copyTemplateFiles(config, "vue");
            break;
        case "vanilla-vite":
            await copyTemplateFiles(config, "vanilla");
            break;
        case "sveltekit":
            await copyTemplateFiles(config, "sveltekit");
            break;
        default:
            throw new Error(`Unknown framework: ${framework}`);
    }
}

async function copyTemplateFiles(config: ProjectConfig, templateName: string) {
    const { projectPath } = config;

    // Templates are in dist/templates after build
    const templatePath = path.join(__dirname, "templates", templateName);

    // Copy all files from template directory to project directory
    await copyDirectory(templatePath, projectPath);
}

async function copyDirectory(src: string, dest: string) {
    // Create destination directory if it doesn't exist
    await fs.mkdir(dest, { recursive: true });

    // Read all entries in the source directory
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            // Recursively copy subdirectories
            await copyDirectory(srcPath, destPath);
        } else {
            // Copy file
            await fs.copyFile(srcPath, destPath);
        }
    }
}
