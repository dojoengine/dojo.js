import { useComponentValue } from "@dojoengine/react";
import type { Entity } from "@dojoengine/recs";
import { useEffect, useState } from "react";

import { getEntityIdFromKeys } from "@dojoengine/utils";

import { useDojo } from "./dojo/useDojo";

import "./app.css";
import { DirectionValue } from "core/types";

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

    const entityId = getEntityIdFromKeys([
        BigInt(account?.account.address),
    ]) as Entity;

    const position = useComponentValue(Position, entityId);
    const moves = useComponentValue(Moves, entityId);

    const handleRestoreBurners = async () => {
        try {
            await account?.applyFromClipboard();
            setClipboardStatus({ message: "Burners restored", isError: false });
        } catch {
            setClipboardStatus({
                message: "Failed to restore burners",
                isError: true,
            });
        }
    };

    useEffect(() => {
        if (!clipboardStatus.message) return;
        const timer = setTimeout(() => {
            setClipboardStatus({ message: "", isError: false });
        }, 3000);
        return () => clearTimeout(timer);
    }, [clipboardStatus.message]);

    return (
        <main className="app">
            <section className="card">
                <button onClick={() => account?.create()}>
                    {account?.isDeploying
                        ? "Deploying burner"
                        : "Create burner"}
                </button>
                {account && account?.list().length > 0 && (
                    <button onClick={() => account?.copyToClipboard()}>
                        Save burners to clipboard
                    </button>
                )}
                <button onClick={handleRestoreBurners}>
                    Restore burners from clipboard
                </button>
                {clipboardStatus.message && (
                    <p
                        className={
                            clipboardStatus.isError ? "error" : "success"
                        }
                    >
                        {clipboardStatus.message}
                    </p>
                )}
            </section>

            <section className="card">
                <p>{`burners deployed: ${account.count}`}</p>
                <label className="select">
                    <span>Select signer</span>
                    <select
                        value={account ? account.account.address : ""}
                        onChange={(event) => account.select(event.target.value)}
                    >
                        {account?.list().map((burner, index) => (
                            <option value={burner.address} key={index}>
                                {burner.address}
                            </option>
                        ))}
                    </select>
                </label>
                <button onClick={() => account.clear()}>Clear burners</button>
            </section>

            <section className="card">
                <button onClick={() => spawn(account.account)}>Spawn</button>
                <p>
                    Moves left: {moves ? `${moves.remaining}` : "Need to spawn"}
                </p>
                <p>
                    Position:{" "}
                    {position
                        ? `${position.vec.x}, ${position.vec.y}`
                        : "Need to spawn"}
                </p>
            </section>

            <section className="card grid">
                <button
                    onClick={() =>
                        position && position.vec.y > 0
                            ? move(account.account, DirectionValue.Up())
                            : null
                    }
                >
                    Up
                </button>
                <div className="row">
                    <button
                        onClick={() =>
                            position && position.vec.x > 0
                                ? move(account.account, DirectionValue.Left())
                                : null
                        }
                    >
                        Left
                    </button>
                    <button
                        onClick={() =>
                            move(account.account, DirectionValue.Right())
                        }
                    >
                        Right
                    </button>
                </div>
                <button
                    onClick={() => move(account.account, DirectionValue.Down())}
                >
                    Down
                </button>
            </section>
        </main>
    );
}

export default App;
