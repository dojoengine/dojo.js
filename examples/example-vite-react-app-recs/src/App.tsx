import { useEffect, useState } from "react";
import { useComponentValue, useQuerySync } from "@dojoengine/react";
import type { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { KeysClause } from "@dojoengine/sdk";

import { useDojo } from "./dojo/useDojo";

function App() {
    const {
        setup: {
            clientComponents: { Position, Moves },
            toriiClient,
            contractComponents,
            client,
        },
        account,
    } = useDojo();

    // sync the contract components to the local state
    // this fetches the entities from the world and updates the local state
    useQuerySync(
        toriiClient,
        contractComponents as any,
        KeysClause([], [], "VariableLen").build()
    );

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

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
        <div className="bg-gray-900 text-white h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-10 ">
                <div className="my-4">
                    <h3 className="text-3xl">Dojo + Recs + Tailwind</h3>

                    <p className="text-sm sm:text-base mt-2">
                        This is a simple example of using Dojo, Recs, and
                        Tailwind CSS in a React application.
                    </p>

                    <div>
                        Read the{" "}
                        <a
                            className="text-red-200"
                            href="https://book.dojoengine.org/"
                        >
                            book
                        </a>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                    <button
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white text-sm sm:text-base rounded-md hover:bg-blue-700 transition-colors duration-300"
                        onClick={() => account?.create()}
                    >
                        {account?.isDeploying
                            ? "Deploying Burner..."
                            : "Create Burner"}
                    </button>
                    {account && account?.list().length > 0 && (
                        <button
                            className="px-3 py-1 sm:px-4 sm:py-2 bg-green-600 text-white text-sm sm:text-base rounded-md hover:bg-green-700 transition-colors duration-300"
                            onClick={async () =>
                                await account?.copyToClipboard()
                            }
                        >
                            Save Burners to Clipboard
                        </button>
                    )}
                    <button
                        className="px-3 py-1 sm:px-4 sm:py-2 bg-yellow-600 text-white text-sm sm:text-base rounded-md hover:bg-yellow-700 transition-colors duration-300"
                        onClick={handleRestoreBurners}
                    >
                        Restore Burners from Clipboard
                    </button>
                    {clipboardStatus.message && (
                        <div
                            className={`mt-2 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-md ${
                                clipboardStatus.isError
                                    ? "bg-red-800 text-red-200"
                                    : "bg-green-800 text-green-200"
                            }`}
                        >
                            {clipboardStatus.message}
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 shadow-md rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 w-full sm:w-96 my-4 sm:my-8">
                    <div className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{`Burners Deployed: ${account.count}`}</div>
                    <div className="mb-3 sm:mb-4">
                        <label
                            htmlFor="signer-select"
                            className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2"
                        >
                            Select Signer:
                        </label>
                        <select
                            id="signer-select"
                            className="w-full px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={account ? account.account.address : ""}
                            onChange={(e) => account.select(e.target.value)}
                        >
                            {account?.list().map((account, index) => (
                                <option value={account.address} key={index}>
                                    {account.address}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 text-sm sm:text-base rounded transition duration-300 ease-in-out"
                            onClick={() => account.clear()}
                        >
                            Clear Burners
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                    <div className="grid grid-cols-3 gap-2 w-full sm:w-48 h-48 bg-gray-700 p-4 rounded-lg shadow-inner">
                        <div className="col-start-2">
                            <button
                                className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-xl sm:text-2xl font-bold text-gray-200"
                                onClick={async () =>
                                    await client.actions.spawn({
                                        account: account.account,
                                    })
                                }
                            >
                                +
                            </button>
                        </div>
                        <div className="col-span-3 text-center text-sm sm:text-base">
                            Moves Left:{" "}
                            {moves ? `${moves.remaining}` : "Need to Spawn"}
                        </div>
                        <div className="col-span-3 text-center text-sm sm:text-base">
                            {position
                                ? `x: ${position?.vec.x}, y: ${position?.vec.y}`
                                : "Need to Spawn"}
                        </div>
                        <div className="col-span-3 text-center text-sm sm:text-base">
                            {moves && moves.last_direction}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 w-full sm:w-48 h-48 bg-gray-700 p-4 rounded-lg shadow-inner">
                        {[
                            {
                                direction: "Up" as const,
                                label: "↑",
                                col: "col-start-2",
                            },
                            {
                                direction: "Left" as const,
                                label: "←",
                                col: "col-start-1",
                            },
                            {
                                direction: "Right" as const,
                                label: "→",
                                col: "col-start-3",
                            },
                            {
                                direction: "Down" as const,
                                label: "↓",
                                col: "col-start-2",
                            },
                        ].map(({ direction, label, col }) => (
                            <button
                                className={`${col} h-10 w-10 sm:h-12 sm:w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-xl sm:text-2xl font-bold text-gray-200`}
                                key={direction}
                                onClick={async () => {
                                    const condition =
                                        (direction === "Up" &&
                                            position?.vec.y > 0) ||
                                        (direction === "Left" &&
                                            position?.vec.x > 0) ||
                                        direction === "Right" ||
                                        direction === "Down";

                                    if (!condition) {
                                        console.log(
                                            "Reached the borders of the world."
                                        );
                                    } else {
                                        await client.actions.move({
                                            account: account.account,
                                            direction: { type: direction },
                                        });
                                    }
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    <div>
                        Yes, blazingly fast! Every action here is a transaction.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
