import { DojoProvider } from "@dojoengine/core";
import { Account, AccountInterface } from "starknet";

import { Direction } from "../../utils";

const NAMESPACE = "dojo_starter";

export interface IWorld {
    actions: {
        spawn: (props: { account: AccountInterface }) => Promise<any>;
        move: (props: MoveProps) => Promise<any>;
    };
}

export interface MoveProps {
    account: Account | AccountInterface;
    direction: Direction;
}

const handleError = (action: string, error: unknown) => {
    console.error(`Error executing ${action}:`, error);
    throw error;
};

export const setupWorld = async (provider: DojoProvider): Promise<IWorld> => {
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
};
