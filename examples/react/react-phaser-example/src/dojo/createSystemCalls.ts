import { Account } from "starknet";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { Direction, updatePositionWithDirection } from "./utils";
import {
    getEntityIdFromKeys,
    getEvents,
    setComponentsFromEvents,
} from "@dojoengine/utils";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { client }: { client: IWorld },
    contractComponents: ContractComponents,
    { Position, Moves }: ClientComponents
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
