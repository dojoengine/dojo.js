import { Direction } from "../utils";
import { useDojo } from "../dojo/useDojo";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useComponentValue } from "@dojoengine/react";
import { AccountInterface } from "starknet";

interface GameProps {
    account: AccountInterface;
}

export default function Game({ account }: GameProps) {
    const {
        setup: {
            systemCalls: { spawn, move },
            clientComponents: { Position, Moves },
        },
    } = useDojo();

    // entity id we are syncing
    const entityId = getEntityIdFromKeys([BigInt(account.address)]) as Entity;

    // get current component values
    const position = useComponentValue(Position, entityId);
    const moves = useComponentValue(Moves, entityId);

    return (
        <>
            <p>
                You will need to Authorise the contracts before you can use a
                burner. See readme.
            </p>

            <div className="card">
                <button onClick={() => spawn(account)}>Spawn</button>
                <div>
                    Moves Left: {moves ? `${moves.remaining}` : "Need to Spawn"}
                </div>
                <div>
                    Position:{" "}
                    {position
                        ? `${position.vec.x}, ${position.vec.y}`
                        : "Need to Spawn"}
                </div>
            </div>

            <div className="card">
                <div>
                    <button
                        onClick={() =>
                            position && position.vec.y > 0
                                ? move(account, Direction.Up)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Up
                    </button>
                </div>
                <div>
                    <button
                        onClick={() =>
                            position && position.vec.x > 0
                                ? move(account, Direction.Left)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Left
                    </button>
                    <button onClick={() => move(account, Direction.Right)}>
                        Move Right
                    </button>
                </div>
                <div>
                    <button onClick={() => move(account, Direction.Down)}>
                        Move Down
                    </button>
                </div>
            </div>
        </>
    );
}
