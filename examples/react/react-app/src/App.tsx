import { useFindEntity } from "@dojoengine/react";
import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";
import { dojo } from "./dojo";
import { validateAndParseAddress } from "starknet";
import { Direction } from "./dojo_starter";

function App() {
    const { account } = useDojo();

    const playerEntity = useFindEntity(
        dojo.query({
            Moves: {
                player: validateAndParseAddress(account?.account.address),
            },
            Position: {},
        }),
        [account?.account.address]
    );

    useEffect(() => {
        if (account) {
            dojo.account = account.account;
        }
    }, [account]);

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
            <button onClick={() => account?.create()}>
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
                <div>{`burners deployed: ${account.count}`}</div>
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
                <button onClick={() => dojo.actions.spawn()}>Spawn</button>
                <div>
                    Moves Left:{" "}
                    {playerEntity
                        ? `${playerEntity.Moves.remaining}`
                        : "Need to Spawn"}
                </div>
                <div>
                    Position:{" "}
                    {playerEntity
                        ? `${playerEntity.Position.vec.x}, ${playerEntity.Position.vec.y}`
                        : "Need to Spawn"}
                </div>

                <div>{moves && moves.last_direction}</div>
            </div>

            <div className="card">
                <div>
                    <button
                        onClick={() =>
                            playerEntity && playerEntity.Position.vec.y > 0
                                ? dojo.actions.move(Direction.Up)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Up
                    </button>
                </div>
                <div>
                    <button
                        onClick={() =>
                            playerEntity && playerEntity.Position.vec.x > 0
                                ? dojo.actions.move(Direction.Left)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Left
                    </button>
                    <button onClick={() => dojo.actions.move(Direction.Right)}>
                        Move Right
                    </button>
                </div>
                <div>
                    <button onClick={() => dojo.actions.move(Direction.Down)}>
                        Move Down
                    </button>
                </div>
            </div>
        </>
    );
}

export default App;
