import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";
import { Direction } from "./utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import "./App.css";

function App() {
    const {
        setup: {
            systemCalls: { spawn, move },
            clientComponents: { Position, Moves },
        },
        burnerManager: {
            applyFromClipboard,
            copyToClipboard,
            list,
            count,
            select,
            clear,
            account,
            isDeploying,
            create,
        },
    } = useDojo();

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

    const [entityId, setEntityId] = useState<Entity | undefined>(undefined);

    const position = useComponentValue(Position, entityId);
    const moves = useComponentValue(Moves, entityId);

    useEffect(() => {
        if (account) {
            const newEntityId = getEntityIdFromKeys([
                BigInt(account.address),
            ]) as Entity;
            setEntityId(newEntityId);
        } else {
            setEntityId(undefined);
        }
    }, [account]);

    const handleRestoreBurners = async () => {
        try {
            await applyFromClipboard();
            setClipboardStatus({
                message: "Burners restored successfully!",
                isError: false,
            });
        } catch (error) {
            setClipboardStatus({
                message: `Failed to restore burners from clipboard`,
                isError: true,
            });
        }
    };

    useEffect(() => {
        if (clipboardStatus.message) {
            const timer = setTimeout(() => {
                setClipboardStatus({ message: "", isError: false });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [clipboardStatus.message]);

    return (
        <>
            <button onClick={() => create()}>
                {isDeploying ? "deploying burner" : "create burner"}
            </button>
            {list().length > 0 && (
                <button onClick={async () => await copyToClipboard()}>
                    Save Burners to Clipboard
                </button>
            )}
            <button onClick={handleRestoreBurners}>
                Restore Burners from Clipboard
            </button>
            {clipboardStatus.message && (
                <div className={clipboardStatus.isError ? "error" : "success"}>
                    {clipboardStatus.message}
                </div>
            )}

            <div className="card">
                <div>{`burners deployed: ${count}`}</div>
                <div>
                    select signer:{" "}
                    <select
                        value={account ? account.address : ""}
                        onChange={(e) => select(e.target.value)}
                    >
                        {list().map((account, index) => {
                            return (
                                <option value={account.address} key={index}>
                                    {account.address}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <button onClick={() => clear()}>Clear burners</button>
                </div>
            </div>

            {account && (
                <>
                    <p>
                        You will need to Authorise the contracts before you can
                        use a burner. See readme.
                    </p>
                    <div className="card">
                        <button onClick={() => spawn(account)}>Spawn</button>
                        <div>
                            Moves Left:{" "}
                            {moves ? `${moves.remaining}` : "Need to Spawn"}
                        </div>
                        <div>
                            Position:{" "}
                            {position
                                ? `${position.vec.x}, ${position.vec.y}`
                                : "Need to Spawn"}
                        </div>

                        <div>{moves && moves.last_direction}</div>
                    </div>

                    <div className="card">
                        <div>
                            <button
                                onClick={() =>
                                    position && position.vec.y > 0
                                        ? move(account, Direction.Up)
                                        : console.log(
                                              "Reach the borders of the world."
                                          )
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
                                        : console.log(
                                              "Reach the borders of the world."
                                          )
                                }
                            >
                                Move Left
                            </button>
                            <button
                                onClick={() => move(account, Direction.Right)}
                            >
                                Move Right
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={() => move(account, Direction.Down)}
                            >
                                Move Down
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default App;
