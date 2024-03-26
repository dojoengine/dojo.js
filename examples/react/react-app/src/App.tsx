import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";
import { Direction, MovesModel, PositionModel } from "./dojo/dojo_starter";
import { dojo_starter } from "./dojo/dojo";

function App() {
    const [moves, setMoves] = useState<MovesModel>();
    const [position, setPosition] = useState<PositionModel>();
    const { account } = useDojo();

    useEffect(() => {
        const getPlayer = async () => {
            const [first] = await dojo_starter.findEntities([
                {
                    model: "Moves",
                    query: {
                        player: "0x00b3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca",
                    },
                },
                {
                    model: "Position",
                },
            ]);

            const [moves, position] = first;

            setMoves(moves);
            setPosition(position);

            // If you're only interested in the position, specifying only that
            // will also only return you the requested values.
            //
            // [{ player: string; vec: Vec2; }]
            // const [position] = dojo_starter.findEntity([
            //     { model: "Position", query: { player: account.account.address } },
            // ]);

            // We could even do some more complicated queries
            // all fully typed
            // const player = dojo_starter.findEntity([
            //     {
            //         model: "Moves",
            //         query: {
            //             player: account.account.address,
            //             OR: [
            //                 { remaining: { gt: 50 } },
            //                 { last_direction: Direction.Down },
            //             ],
            //         },
            //     },
            //     { model: "Position" },
            // ]);
        };

        getPlayer();
    }, []);

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

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
            {/* <Test /> */}
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
                <div>{`burners deployed: ${account.list().length}`}</div>
                <div>
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
                </div>
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
                <button onClick={() => dojo_starter.actions.spawn()}>
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
                                ? dojo_starter.actions.move(Direction.Up)
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
                                ? dojo_starter.actions.move(Direction.Left)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Left
                    </button>
                    <button
                        onClick={() =>
                            dojo_starter.actions.move(Direction.Right)
                        }
                    >
                        Move Right
                    </button>
                </div>
                <div>
                    <button
                        onClick={() =>
                            dojo_starter.actions.move(Direction.Down)
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
