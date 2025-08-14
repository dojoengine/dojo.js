#!/usr/bin/env bun

import fs from "fs";
import path from "path";

const rootDir = path.resolve(import.meta.dir, "..");
const BACKUP_DIR = path.join(rootDir, ".package-backups");

interface PackageJson {
    name: string;
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    optionalDependencies?: Record<string, string>;
}

interface WorkspacePackageInfo {
    version: string;
    path: string;
}

interface RootPackageJson extends PackageJson {
    workspaces?: {
        packages?: string[];
        catalog?: Record<string, string>;
    };
}

function readJSON<T = any>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJSON(filePath: string, data: any): void {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4) + "\n");
}

function getWorkspacePackages(): Map<string, WorkspacePackageInfo> {
    const packages = new Map<string, WorkspacePackageInfo>();
    const packagesDir = path.join(rootDir, "packages");

    const dirs = fs
        .readdirSync(packagesDir)
        .filter((dir) =>
            fs.statSync(path.join(packagesDir, dir)).isDirectory()
        );

    for (const dir of dirs) {
        const pkgPath = path.join(packagesDir, dir, "package.json");
        if (fs.existsSync(pkgPath)) {
            const pkg = readJSON<PackageJson>(pkgPath);
            packages.set(pkg.name, {
                version: pkg.version,
                path: pkgPath,
            });
        }
    }

    return packages;
}

function getCatalogVersions(): Record<string, string> {
    const rootPkg = readJSON<RootPackageJson>(
        path.join(rootDir, "package.json")
    );
    return rootPkg.workspaces?.catalog || {};
}

function resolveWorkspaceVersion(
    depName: string,
    workspacePackages: Map<string, WorkspacePackageInfo>
): string | null {
    const pkg = workspacePackages.get(depName);
    return pkg ? pkg.version : null;
}

function resolveCatalogVersion(
    depName: string,
    catalogVersions: Record<string, string>
): string | null {
    return catalogVersions[depName] || null;
}

function backupPackageJson(filePath: string): void {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const relativePath = path.relative(rootDir, filePath);
    const backupPath = path.join(BACKUP_DIR, relativePath);
    const backupDir = path.dirname(backupPath);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    fs.copyFileSync(filePath, backupPath);
}
function handleDependency<T>(
    type: string,
    deps: Record<string, string>,
    name: string,
    version: string,
    catalogVersions: T,
    resolverFn: (name: string, version: T) => string | null
): { modified: boolean; deps: Record<string, string> } {
    if (version !== type) {
        return { modified: false, deps };
    }
    const resolvedVersion = resolverFn(name, catalogVersions);
    if (!resolvedVersion) {
        console.warn(`  ! Could not resolve ${type} version for ${name}`);
        return { modified: false, deps };
    }
    deps[name] = resolvedVersion;
    console.log(`  ✓ Resolved ${name}: ${type} → ${resolvedVersion}`);
    return { modified: true, deps };
}

function processPackageJson(
    pkgPath: string,
    workspacePackages: Map<string, WorkspacePackageInfo>,
    catalogVersions: Record<string, string>
): boolean {
    const pkg = readJSON<PackageJson>(pkgPath);
    let modified = false;

    backupPackageJson(pkgPath);

    const processDeps = (deps?: Record<string, string>) => {
        if (!deps) return;

        for (const [name, version] of Object.entries(deps)) {
            const workspaceDep = handleDependency(
                "workspace:*",
                deps!,
                name,
                version,
                workspacePackages,
                resolveWorkspaceVersion
            );
            deps = workspaceDep.deps;
            if (workspaceDep.modified) {
                modified = true;
                continue;
            }
            const catalogDep = handleDependency(
                "catalog:",
                deps!,
                name,
                version,
                catalogVersions,
                resolveCatalogVersion
            );
            deps = catalogDep.deps;
            if (catalogDep.modified) {
                modified = true;
                continue;
            }
        }
    };

    processDeps(pkg.dependencies);
    processDeps(pkg.devDependencies);
    processDeps(pkg.peerDependencies);
    processDeps(pkg.optionalDependencies);

    if (modified) {
        writeJSON(pkgPath, pkg);
        console.log(`  ✅ Updated ${path.relative(rootDir, pkgPath)}`);
    }

    return modified;
}

function main(): void {
    console.log("🔧 Preparing packages for publishing...\n");

    const workspacePackages = getWorkspacePackages();
    const catalogVersions = getCatalogVersions();

    console.log(`📦 Found ${workspacePackages.size} workspace packages`);
    console.log(
        `📚 Found ${Object.keys(catalogVersions).length} catalog entries\n`
    );

    let packagesModified = 0;

    for (const [name, info] of workspacePackages) {
        console.log(`Processing ${name}...`);
        if (processPackageJson(info.path, workspacePackages, catalogVersions)) {
            packagesModified++;
        }
        console.log("");
    }

    console.log(`✅ Prepared ${packagesModified} packages for publishing`);
    console.log(`📁 Backups saved to ${path.relative(rootDir, BACKUP_DIR)}`);
}

try {
    main();
} catch (error) {
    console.error(
        "❌ Error preparing packages:",
        error instanceof Error ? error.message : error
    );
    process.exit(1);
}
