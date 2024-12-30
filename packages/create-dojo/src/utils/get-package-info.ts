import path from "path";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";
import yaml from "js-yaml";
import fetch from "node-fetch";

interface WorkspaceYaml {
    catalog: Record<string, string>;
}

export async function getCatalogVersions(): Promise<Record<string, string>> {
    const WORKSPACE_YAML_URL =
        "https://raw.githubusercontent.com/dojoengine/dojo.js/refs/heads/main/pnpm-workspace.yaml";

    try {
        // Fetch workspace yaml to get package paths
        const yamlResponse = await fetch(WORKSPACE_YAML_URL);
        const yamlContent = await yamlResponse.text();
        const workspaceConfig = yaml.load(yamlContent) as WorkspaceYaml;

        return workspaceConfig.catalog;
    } catch (error) {
        console.warn("Failed to fetch catalog versions:", error);
        return {};
    }
}

export function getPackageInfo() {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    try {
        return fs.readJSONSync(packageJsonPath) as PackageJson;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        console.warn(`Failed to read package.json: ${errorMessage}`);
        console.warn('Falling back to default version "1.0.0"');
        return {
            version: "1.0.0",
        } as PackageJson;
    }
}
