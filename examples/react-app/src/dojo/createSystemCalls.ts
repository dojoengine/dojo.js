import { SetupNetworkResult } from "./setupNetwork";
import { Account, num } from "starknet";
import { Entity, getComponentValue } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { Direction, updatePositionWithDirection } from "../utils";
import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    { Position, Moves }: ClientComponents
) {
    const spawn = async (signer: Account) => {
        const entityId = signer.address.toString() as Entity;

        const positionId = uuid();
        Position.addOverride(positionId, {
            entity: entityId,
            value: { player: num.toHexString(entityId), vec: { x: 10, y: 10 } },
        });

        const movesId = uuid();
        Moves.addOverride(movesId, {
            entity: entityId,
            value: {
                player: num.toHexString(entityId),
                remaining: 10,
                last_direction: 0,
            },
        });

        try {
            const tx = await execute(signer, "actions", "spawn", []);

            const even = await signer.waitForTransaction(tx.transaction_hash, {
                retryInterval: 100,
            });

            console.log(even);

            console.log(tx);
            setComponentsFromEvents(
                contractComponents,
                getEvents(
                    await signer.waitForTransaction(tx.transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
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
        const entityId = signer.address.toString() as Entity;

        const positionId = uuid();
        Position.addOverride(positionId, {
            entity: entityId,
            value: {
                player: entityId,
                vec: {
                    x: updatePositionWithDirection(
                        direction,
                        // currently recs does not support nested values so we use any here
                        getComponentValue(Position, entityId) as any
                    )["x"],
                    y: updatePositionWithDirection(
                        direction,
                        // currently recs does not support nested values so we use any here
                        getComponentValue(Position, entityId) as any
                    )["y"],
                },
            },
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
            setComponentsFromEvents(
                contractComponents,
                getEvents(
                    await signer.waitForTransaction(tx.transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
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
