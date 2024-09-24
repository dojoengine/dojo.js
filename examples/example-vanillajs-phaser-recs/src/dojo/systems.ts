import { Entity, getComponentValue } from "@dojoengine/recs";
import {
    getEntityIdFromKeys,
    getEvents,
    setComponentsFromEvents,
} from "@dojoengine/utils";
import { uuid } from "@latticexyz/utils";
import { AccountInterface } from "starknet";

import { ClientComponents } from "./createClientComponent";
import { ContractComponents } from "./defineContractComponents";
import type { IWorld } from "./defineContractSystems";
import { Direction, updatePositionWithDirection } from "./utils";

export type SystemCalls = ReturnType<typeof systems>;

export function systems({
    client,
    clientModels: { Position, Moves },
    contractComponents,
}: {
    client: IWorld;
    clientModels: ClientComponents;
    contractComponents: ContractComponents;
}) {
    function actions() {
        const spawn = async (account: AccountInterface) => {
            const entityId = getEntityIdFromKeys([
                BigInt(account.address),
            ]) as Entity;

            const positionId = uuid();
            Position.addOverride(positionId, {
                entity: entityId,
                value: { player: BigInt(entityId), vec: { x: 10, y: 10 } },
            });

            const movesId = uuid();
            Moves.addOverride(movesId, {
                entity: entityId,
                value: {
                    player: BigInt(entityId),
                    remaining: 100,
                    last_direction: 0,
                },
            });

            try {
                const { transaction_hash } = (await client.actions.spawn({
                    account,
                })) as { transaction_hash: string };
                setComponentsFromEvents(
                    contractComponents,
                    getEvents(
                        await account.waitForTransaction(transaction_hash, {
                            retryInterval: 100,
                        })
                    )
                );
            } catch (e) {
                console.error(e);
                Position.removeOverride(positionId);
                Moves.removeOverride(movesId);
            }
        };

        const move = async (
            account: AccountInterface,
            direction: Direction
        ) => {
            const entityId = getEntityIdFromKeys([
                BigInt(account.address),
            ]) as Entity;

            const positionId = uuid();
            Position.addOverride(positionId, {
                entity: entityId,
                value: {
                    player: BigInt(entityId),
                    vec: updatePositionWithDirection(
                        direction,
                        getComponentValue(Position, entityId) as any
                    ).vec,
                },
            });

            const movesId = uuid();
            Moves.addOverride(movesId, {
                entity: entityId,
                value: {
                    player: BigInt(entityId),
                    remaining:
                        (getComponentValue(Moves, entityId)?.remaining || 0) -
                        1,
                },
            });

            try {
                const { transaction_hash } = (await client.actions.move({
                    account,
                    direction,
                })) as { transaction_hash: string };

                setComponentsFromEvents(
                    contractComponents,
                    getEvents(
                        await account.waitForTransaction(transaction_hash, {
                            retryInterval: 100,
                        })
                    )
                );
            } catch (e) {
                console.error(e);
                Position.removeOverride(positionId);
                Moves.removeOverride(movesId);
            }
        };
        return { spawn, move };
    }

    return {
        actions: actions(),
    };
}
