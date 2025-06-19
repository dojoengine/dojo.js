import { confirm, checkbox } from "@inquirer/prompts";

export interface DependencyInfo {
    dependencies: string[];
    features: {
        stateManagement?: string;
        uiLibrary?: string;
        testing?: boolean;
        pwa?: boolean;
    };
}

export async function promptForDependencies(
    framework: string
): Promise<DependencyInfo> {
    const wantAdditionalDeps = await confirm({
        message: "Would you like to add additional features?",
        default: true,
    });

    if (!wantAdditionalDeps) {
        return {
            dependencies: [],
            features: {},
        };
    }

    const features: DependencyInfo["features"] = {};
    const dependencies: string[] = [];

    // Framework-specific options
    if (framework.includes("react")) {
        const reactFeatures = await checkbox({
            message: "Select additional features for your React app:",
            choices: [
                { name: "State Management (Zustand)", value: "zustand" },
                { name: "UI Components (Shadcn/ui)", value: "shadcn" },
                { name: "Styling (Tailwind CSS)", value: "tailwind" },
                {
                    name: "Testing (Vitest + React Testing Library)",
                    value: "testing",
                },
                { name: "PWA Support", value: "pwa" },
                { name: "React Router", value: "router" },
            ],
        });

        if (reactFeatures.includes("zustand")) {
            dependencies.push("zustand");
            features.stateManagement = "zustand";
        }
        if (reactFeatures.includes("shadcn")) {
            features.uiLibrary = "shadcn";
        }
        if (reactFeatures.includes("tailwind")) {
            dependencies.push("tailwindcss", "postcss", "autoprefixer");
            features.uiLibrary = features.uiLibrary
                ? `${features.uiLibrary}+tailwind`
                : "tailwind";
        }
        if (reactFeatures.includes("testing")) {
            dependencies.push(
                "vitest",
                "@testing-library/react",
                "@testing-library/jest-dom"
            );
            features.testing = true;
        }
        if (reactFeatures.includes("pwa")) {
            dependencies.push("vite-plugin-pwa");
            features.pwa = true;
        }
        if (reactFeatures.includes("router")) {
            dependencies.push("react-router-dom");
        }
    } else if (framework.includes("vue")) {
        const vueFeatures = await checkbox({
            message: "Select additional features for your Vue app:",
            choices: [
                { name: "State Management (Pinia)", value: "pinia" },
                { name: "UI Components (Vuetify)", value: "vuetify" },
                { name: "Styling (Tailwind CSS)", value: "tailwind" },
                { name: "Testing (Vitest + Vue Test Utils)", value: "testing" },
                { name: "Vue Router", value: "router" },
            ],
        });

        if (vueFeatures.includes("pinia")) {
            dependencies.push("pinia");
            features.stateManagement = "pinia";
        }
        if (vueFeatures.includes("vuetify")) {
            dependencies.push("vuetify");
            features.uiLibrary = "vuetify";
        }
        if (vueFeatures.includes("tailwind")) {
            dependencies.push("tailwindcss", "postcss", "autoprefixer");
            features.uiLibrary = features.uiLibrary
                ? `${features.uiLibrary}+tailwind`
                : "tailwind";
        }
        if (vueFeatures.includes("testing")) {
            dependencies.push("vitest", "@vue/test-utils");
            features.testing = true;
        }
        if (vueFeatures.includes("router")) {
            dependencies.push("vue-router");
        }
    } else if (framework === "vanilla-vite") {
        const vanillaFeatures = await checkbox({
            message: "Select additional features for your Vanilla JS app:",
            choices: [
                { name: "Styling (Tailwind CSS)", value: "tailwind" },
                { name: "Testing (Vitest)", value: "testing" },
                { name: "PWA Support", value: "pwa" },
            ],
        });

        if (vanillaFeatures.includes("tailwind")) {
            dependencies.push("tailwindcss", "postcss", "autoprefixer");
            features.uiLibrary = "tailwind";
        }
        if (vanillaFeatures.includes("testing")) {
            dependencies.push("vitest");
            features.testing = true;
        }
        if (vanillaFeatures.includes("pwa")) {
            dependencies.push("vite-plugin-pwa");
            features.pwa = true;
        }
    }

    // Common dependencies for all frameworks
    const commonFeatures = await checkbox({
        message: "Select common features:",
        choices: [
            { name: "ESLint", value: "eslint" },
            { name: "Prettier", value: "prettier" },
            { name: "TypeScript", value: "typescript", checked: true },
        ],
    });

    if (commonFeatures.includes("eslint")) {
        dependencies.push("eslint");
        if (framework.includes("react")) {
            dependencies.push(
                "eslint-plugin-react",
                "eslint-plugin-react-hooks"
            );
        } else if (framework.includes("vue")) {
            dependencies.push("eslint-plugin-vue");
        }
    }
    if (commonFeatures.includes("prettier")) {
        dependencies.push("prettier");
    }

    return {
        dependencies,
        features,
    };
}
