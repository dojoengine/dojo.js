import { select } from "@inquirer/prompts";

export interface FrameworkChoice {
    value: string;
    name: string;
    description?: string;
}

export const frameworks: FrameworkChoice[] = [
    {
        value: "react-vite",
        name: "React + Vite",
        description: "Fast refresh, modern tooling",
    },
    {
        value: "vue-vite",
        name: "Vue + Vite",
        description: "Composition API, single-file components",
    },
    {
        value: "vanilla-vite",
        name: "Vanilla JS + Vite",
        description: "No framework, pure JavaScript",
    },
    {
        value: "sveltekit",
        name: "SvelteKit",
        description: "Full-stack Svelte framework",
    },
];

export async function selectFramework(): Promise<string> {
    const framework = await select({
        message: "Which framework would you like to use?",
        choices: frameworks,
    });

    return framework;
}
