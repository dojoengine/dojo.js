import { SetupNetworkResult } from "./setupNetwork";
import { Account } from "starknet";
import { EntityIndex, getComponentValue } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { updatePositionWithDirection } from "../utils";
import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    { Position, Moves }: ClientComponents
) {
    const spawn = async (signer: Account) => {
        const entityId = signer.address.toString() as EntityIndex;

        const positionId = uuid();
        Position.addOverride(positionId, {
            entity: entityId,
            value: { x: 10, y: 10 },
        });

        const movesId = uuid();
        Moves.addOverride(movesId, {
            entity: entityId,
            value: { remaining: 100 },
        });

        try {
            const tx = await execute(signer, "actions", "spawn", []);

            console.log(tx);
            const receipt = await signer.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            );
            setComponentsFromEvents(contractComponents, getEvents(receipt));
        } catch (e) {
            console.log(e);
            Position.removeOverride(positionId);
            Moves.removeOverride(movesId);
        } finally {
            Position.removeOverride(positionId);
            Moves.removeOverride(movesId);
        }
    };

    const move = async (signer: Account, direction: Direction) => {
        const entityId = signer.address.toString() as EntityIndex;

        const positionId = uuid();
        Position.addOverride(positionId, {
            entity: entityId,
            value: updatePositionWithDirection(
                direction,
                getComponentValue(Position, entityId) as any
            ),
        });

        const movesId = uuid();
        Moves.addOverride(movesId, {
            entity: entityId,
            value: {
                remaining:
                    (getComponentValue(Moves, entityId)?.remaining || 0) - 1,
            },
        });

        try {
            const tx = await execute(signer, "actions", "move", [direction]);

            console.log(tx);
            const receipt = await signer.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            );
            setComponentsFromEvents(contractComponents, getEvents(receipt));
        } catch (e) {
            console.log(e);
            Position.removeOverride(positionId);
            Moves.removeOverride(movesId);
        } finally {
            Position.removeOverride(positionId);
            Moves.removeOverride(movesId);
        }
    };

    return {
        spawn,
        move,
    };
}

export enum Direction {
    Left = 1,
    Right = 2,
    Up = 3,
    Down = 4,
}
