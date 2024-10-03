import { World } from "@dojoengine/recs";
import { Account } from "starknet";

import { ClientComponents } from "./createClientComponents";
import type { IWorld } from "./typescript/contracts.gen";
import { Direction } from "./typescript/models.gen";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    { Position, Moves }: ClientComponents,
    world: World
) {
    const spawn = async (account: Account) => {
        try {
            await client.actions.spawn({
                account,
            });
        } catch (e) {
            console.log(e);
        }
    };

    const move = async (account: Account, direction: Direction) => {
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
