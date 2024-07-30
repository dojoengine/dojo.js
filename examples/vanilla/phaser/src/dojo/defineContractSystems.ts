import { Account, AccountInterface } from "starknet";
import { DojoProvider } from "@dojoengine/core";
import { Config } from "../../dojoConfig.ts";
import { Direction } from "./utils.ts";
const NAMESPACE = "dojo_starter";

export interface MoveProps {
    account: Account | AccountInterface;
    direction: Direction;
}

const handleError = (action: string, error: unknown) => {
    console.error(`Error executing ${action}:`, error);
    throw error;
};

export type IWorld = Awaited<ReturnType<typeof setupWorld>>;

export async function setupWorld(provider: DojoProvider, config: Config) {
    const actions = () => ({
        spawn: async ({ account }: { account: AccountInterface }) => {
            try {
                return await provider.execute(
                    account,
                    {
                        contractName: "actions",
                        entrypoint: "spawn",
                        calldata: [],
                    },
                    NAMESPACE
                );
            } catch (error) {
                handleError("spawn", error);
            }
        },

        move: async ({ account, direction }: MoveProps) => {
            try {
                return await provider.execute(
                    account,
                    {
                        contractName: "actions",
                        entrypoint: "move",
                        calldata: [direction],
                    },
                    NAMESPACE
                );
            } catch (error) {
                handleError("move", error);
            }
        },
    });

    return { actions: actions() };
}
