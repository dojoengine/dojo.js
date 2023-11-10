import { SetupNetworkResult } from "./setupNetwork";
import { Account } from "starknet";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { Direction, updatePositionWithDirection } from "./utils";
import { getEvents, setComponentsFromEvents } from "@dojoengine/utils";
import { RPSSprites } from "../phaser/config/constants";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export interface SystemSigner {
    signer: Account;
}

export interface SpawnSystemProps extends SystemSigner {
    rps: RPSSprites;
}

export interface MoveSystemProps extends SystemSigner {
    direction: Direction;
}

export function createSystemCalls(
    { execute, contractComponents }: SetupNetworkResult,
    { Position, PlayerID }: ClientComponents
) {
    const spawn = async (props: SpawnSystemProps) => {
        const { signer, rps } = props;

        // const entityId = signer.address.toString() as Entity;

        // const positionId = uuid();
        // Position.addOverride(positionId, {
        //     entity: entityId,
        //     value: { player: BigInt(entityId), vec: { x: 10, y: 10 } },
        // });

        // const movesId = uuid();
        // Moves.addOverride(movesId, {
        //     entity: entityId,
        //     value: {
        //         player: BigInt(entityId),
        //         remaining: 100,
        //         last_direction: 0,
        //     },
        // });

        try {
            const { transaction_hash } = await execute(
                signer,
                "actions",
                "spawn",
                [rps]
            );

            setComponentsFromEvents(
                contractComponents,
                getEvents(
                    await signer.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        } finally {
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        }
    };

    // NOTE: Optimistic updates only work when 1 owner enttiy exists
    const move = async (props: MoveSystemProps) => {
        const { signer, direction } = props;

        console.log(signer);

        const playerId = getComponentValue(
            PlayerID,
            signer.address.toString() as Entity
        );

        // const currentPosition = getComponentValue(
        //     Position,
        //     playerId?.id.toString() as Entity
        // ) || { x: 0, y: 0 };

        // const newPosition = updatePositionWithDirection(direction, {
        //     x: currentPosition["x"],
        //     y: currentPosition["y"],
        // });

        // const positionId = uuid();
        // Position.addOverride(positionId, {
        //     entity: playerId?.id.toString() as Entity,
        //     value: {
        //         id: 1,
        //         x: newPosition["x"],
        //         y: newPosition["y"],
        //     },
        // });

        try {
            const { transaction_hash } = await execute(
                signer,
                "actions",
                "move",
                [direction]
            );

            console.log(
                await signer.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
            );

            // setComponentsFromEvents(
            //     contractComponents,
            //     getEvents(
            //         await signer.waitForTransaction(transaction_hash, {
            //             retryInterval: 100,
            //         })
            //     )
            // );
        } catch (e) {
            console.log(e);
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        } finally {
            // Position.removeOverride(positionId);
            // Moves.removeOverride(movesId);
        }
    };

    return {
        spawn,
        move,
    };
}
