import { AccountInterface } from "starknet";
import { ClientComponents } from "./createClientComponents";
import { Direction } from "./utils";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    contractComponents: ContractComponents,
    { Position, Moves }: ClientComponents
) {
    const spawn = async (account: AccountInterface) => {
        try {
            await client.actions.spawn({
                account,
            });
        } catch (e) {
            console.log(e);
        }
    };

    const move = async (account: AccountInterface, direction: Direction) => {
        try {
            await client.actions.move({
                account,
                direction,
            });
        } catch (e) {
            console.log(e);
        }
    };

    return {
        spawn,
        move,
    };
}
