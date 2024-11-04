import path from "path";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";

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
