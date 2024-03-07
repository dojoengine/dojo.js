import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";
import {
    Dojo_Starter,
    Direction,
    MovesEntity,
    PositionEntity,
    isPositionEntity,
    isMovesEntity,
} from "./dojo/dojo_starter";

function App() {
    const dojo_starter = new Dojo_Starter({
        rpcUrl: "http://localhost:8545",
        toriiUrl: "http://localhost:5000",
    });

    const { account } = useDojo();

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

    // get current component values
    const position = dojo_starter.position.find({
        player: account?.account.address,
    });
    const moves = dojo_starter.moves.find({ player: account?.account.address });

    // Or we could combine both the above queries into one
    //
    // const entitiesForAddress = dojo_starter.findEntities<
    //     [MovesEntity, PositionEntity]
    // >({
    //     player: account?.account.address,
    // });
    // const [position, moves] = (() => {
    //     const position = entitiesForAddress.find(isPositionEntity);
    //     const moves = entitiesForAddress.find(isMovesEntity);
    //
    //     return [position, moves];
    // })();

    const handleRestoreBurners = async () => {
        try {
            await account?.applyFromClipboard();
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
            <button onClick={account?.create}>
                {account?.isDeploying ? "deploying burner" : "create burner"}
            </button>
            {account && account?.list().length > 0 && (
                <button onClick={async () => await account?.copyToClipboard()}>
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
                select signer:{" "}
                <select
                    value={account ? account.account.address : ""}
                    onChange={(e) => account.select(e.target.value)}
                >
                    {account?.list().map((account, index) => {
                        return (
                            <option value={account.address} key={index}>
                                {account.address}
                            </option>
                        );
                    })}
                </select>
                <div>
                    <button onClick={() => account.clear()}>
                        Clear burners
                    </button>
                    <p>
                        You will need to Authorise the contracts before you can
                        use a burner. See readme.
                    </p>
                </div>
            </div>

            <div className="card">
                <button
                    onClick={() =>
                        dojo_starter.actions.spawn({
                            account: account.account.address,
                        })
                    }
                >
                    Spawn
                </button>
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
                                ? dojo_starter.actions.move({
                                      account: account.account.address,
                                      args: [Direction.Up],
                                  })
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
                                ? dojo_starter.actions.move({
                                      account: account.account.address,
                                      args: [Direction.Left],
                                  })
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Left
                    </button>
                    <button
                        onClick={() =>
                            dojo_starter.actions.move({
                                account: account.account.address,
                                args: [Direction.Right],
                            })
                        }
                    >
                        Move Right
                    </button>
                </div>
                <div>
                    <button
                        onClick={() =>
                            dojo_starter.actions.move({
                                account: account.account.address,
                                args: [Direction.Down],
                            })
                        }
                    >
                        Move Down
                    </button>
                </div>
            </div>
        </>
    );
}

export default App;
