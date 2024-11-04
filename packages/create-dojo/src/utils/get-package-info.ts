import path from "path";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";

export function getPackageInfo() {
    const packageJsonPath = path.join("package.json");
    try {
        return fs.readJSONSync(packageJsonPath) as PackageJson;
    } catch (error) {
        return {
            version: "1.0.0",
        } as PackageJson;
    }
}
