import { defineConfig, Options } from "tsup";
import { tsupConfig } from "../../tsup.config";
import { promises as fs } from "fs";
import path from "path";

async function copyTemplates() {
    const srcDir = path.join(__dirname, "src", "templates");
    const destDir = path.join(__dirname, "dist", "templates");

    // Copy templates directory to dist
    await copyDirectory(srcDir, destDir);
}

async function copyDirectory(src: string, dest: string) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyDirectory(srcPath, destPath);
        } else {
            await fs.copyFile(srcPath, destPath);
        }
    }
}

export default defineConfig({
    ...(tsupConfig as Options),
    minify: false,
    splitting: false,
    format: ["cjs"], // Use CommonJS format for CLI
    noExternal: [/.*/], // Bundle all dependencies
    onSuccess: async () => {
        await copyTemplates();
        console.log("✅ Templates copied to dist/templates");

        // Add shebang after build
        const distPath = path.join(__dirname, "dist", "index.cjs");
        const content = await fs.readFile(distPath, "utf-8");
        if (!content.startsWith("#!/usr/bin/env node")) {
            await fs.writeFile(distPath, `#!/usr/bin/env node\n${content}`);
        }
    },
});
