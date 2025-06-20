import { confirm, input } from "@inquirer/prompts";
import path from "node:path";
import { promises as fs } from "node:fs";

export interface ContractsInfo {
    useExisting: boolean;
    contractsPath?: string;
}

export async function promptForContracts(
    providedPath?: string
): Promise<ContractsInfo> {
    if (providedPath) {
        // Validate the provided path
        const absolutePath = path.resolve(process.cwd(), providedPath);
        try {
            const stats = await fs.stat(absolutePath);
            if (!stats.isDirectory()) {
                throw new Error("Provided path is not a directory");
            }
            return {
                useExisting: true,
                contractsPath: absolutePath,
            };
        } catch (error) {
            console.error(
                `!  Warning: Provided contracts path "${providedPath}" is not valid`
            );
        }
    }

    const hasContracts = await confirm({
        message: "Have you already created Dojo contracts?",
        default: false,
    });

    if (!hasContracts) {
        return {
            useExisting: false,
        };
    }

    const contractsPath = await input({
        message: "Please provide the path to your contracts:",
        default: "../contracts",
        validate: async (input: string) => {
            const absolutePath = path.resolve(process.cwd(), input);
            try {
                const stats = await fs.stat(absolutePath);
                if (!stats.isDirectory()) {
                    return "Path must be a directory";
                }

                // Check for typical Dojo contract files
                try {
                    await fs.access(path.join(absolutePath, "Scarb.toml"));
                    return true;
                } catch {
                    const continueAnyway = await confirm({
                        message:
                            "No Scarb.toml found in this directory. Continue anyway?",
                        default: false,
                    });
                    return (
                        continueAnyway ||
                        "Please provide a valid Dojo contracts directory"
                    );
                }
            } catch (error) {
                return "Directory does not exist";
            }
        },
    });

    return {
        useExisting: true,
        contractsPath: path.resolve(process.cwd(), contractsPath),
    };
}
