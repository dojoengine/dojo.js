import { useEffect, useState } from "react";
import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import "./App.css";
import { Direction } from "./utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useDojo } from "./dojo/useDojo";
import MasterAccountConnect from "./components/MasterWallet";
import { Deploy } from "./components/Deploy";

function App() {
    const {
        setup: {
            systemCalls: { spawn, move },
            clientComponents: { Position, Moves },
        },
        account,
    } = useDojo();

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

    console.log(account);

    // entity id we are syncing
    const entityId = getEntityIdFromKeys([
        BigInt(account?.account.address),
    ]) as Entity;

    // get current component values
    const position = useComponentValue(Position, entityId);
    const moves = useComponentValue(Moves, entityId);

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
            <Deploy />
            <MasterAccountConnect />
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
                <button onClick={() => spawn(account.account)}>Spawn</button>
                <div>
                    Moves Left:{" "}
                    <b>{moves ? `${moves.remaining}` : "Need to Spawn"}</b>
                </div>
                <div>
                    Position:{" "}
                    <b>
                        {position
                            ? `${position.vec.x}, ${position.vec.y}`
                            : "Need to Spawn"}
                    </b>
                </div>
                <div>
                    Last Direction: <b>{moves?.last_direction}</b>
                </div>
            </div>

            <div className="card">
                <div>
                    <button
                        onClick={() =>
                            position && position.vec.y > 0
                                ? move(account.account, Direction.Up)
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
                                ? move(account.account, Direction.Left)
                                : console.log("Reach the borders of the world.")
                        }
                    >
                        Move Left
                    </button>
                    <button
                        onClick={() => move(account.account, Direction.Right)}
                    >
                        Move Right
                    </button>
                </div>
                <div>
                    <button
                        onClick={() => move(account.account, Direction.Down)}
                    >
                        Move Down
                    </button>
                </div>
            </div>
        </>
    );
}

export default App;
