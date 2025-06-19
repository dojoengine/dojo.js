import { select } from "@inquirer/prompts";

export async function selectAppType(): Promise<"client" | "worker"> {
    const appType = await select({
        message: "What type of application are you building?",
        choices: [
            {
                name: "Client App (Frontend)",
                value: "client",
                description: "Web application with UI (React, Vue, etc.)",
            },
            {
                name: "Worker App (Backend)",
                value: "worker",
                description: "Node.js worker, bot, or backend service",
            },
        ],
    });

    return appType as "client" | "worker";
}
