import { useEffect, useMemo } from "react";
import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { AccountInterface, addAddressPadding, CairoCustomEnum } from "starknet";

import { ModelsMapping } from "./typescript/models.gen.ts";
import { useSystemCalls } from "./useSystemCalls.ts";
import { useAccount } from "@starknet-react/core";
import { WalletAccount } from "./wallet-account.tsx";
import { HistoricalEvents } from "./historical-events.tsx";
import { useDojoSDK, useModel } from "@dojoengine/sdk/react";

/**
 * Main application component that provides game functionality and UI.
 * Handles entity subscriptions, state management, and user interactions.
 *
 * @param props.sdk - The Dojo SDK instance configured with the game schema
 */
function App() {
    const { useDojoStore, client, sdk } = useDojoSDK();
    const { account } = useAccount();
    const state = useDojoStore((state) => state);
    const entities = useDojoStore((state) => state.entities);

    const { spawn } = useSystemCalls();

    const entityId = useMemo(() => {
        if (account) {
            return getEntityIdFromKeys([BigInt(account.address)]);
        }
        return BigInt(0);
    }, [account]);

    // This is experimental feature.
    // Use those queries if you want to be closer to how you should query your ecs system with torii
    // useEffect(() => {
    //   async function fetchToriiClause() {
    //     const res = await sdk.client.getEntities(
    //       new ToriiQueryBuilder()
    //         .withClause(
    //           new ClauseBuilder()
    //             .keys([], [undefined], "VariableLen")
    //             .build()
    //         )
    //         .withLimit(2)
    //         .addOrderBy(ModelsMapping.Moves, "remaining", "Desc")
    //         .build()
    //     );
    //     return res;
    //   }
    //   fetchToriiClause().then(console.log);
    // });

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribe = async (account: AccountInterface) => {
            const [initialData, subscription] = await sdk.subscribeEntityQuery({
                query: new ToriiQueryBuilder()
                    .withClause(
                        // Querying Moves and Position models that has at least [account.address] as key
                        KeysClause(
                            [ModelsMapping.Moves, ModelsMapping.Position],
                            [addAddressPadding(account.address)],
                            "VariableLen"
                        ).build()
                    )
                    .includeHashedKeys(),
                callback: ({ error, data }) => {
                    if (error) {
                        console.error("Error setting up entity sync:", error);
                    } else if (data && data[0].entityId !== "0x0") {
                        state.updateEntity(data[0]);
                    }
                },
            });

            state.setEntities(initialData);

            unsubscribe = () => subscription.cancel();
        };

        if (account) {
            subscribe(account);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [sdk, account, state]);

    const moves = useModel(entityId as string, ModelsMapping.Moves);
    const position = useModel(entityId as string, ModelsMapping.Position);

    return (
        <div className="bg-black min-h-screen w-full p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <WalletAccount />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                        <div className="grid grid-cols-3 gap-2 w-full h-48">
                            <div className="col-start-2">
                                <button
                                    className="h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200"
                                    onClick={async () => await spawn()}
                                >
                                    +
                                </button>
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                Moves Left:{" "}
                                {moves ? `${moves.remaining}` : "Need to Spawn"}
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                {position
                                    ? `x: ${position?.vec?.x}, y: ${position?.vec?.y}`
                                    : "Need to Spawn"}
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                {moves && moves.last_direction.isSome()
                                    ? moves.last_direction.unwrap()
                                    : ""}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                        <div className="grid grid-cols-3 gap-2 w-full h-48">
                            {[
                                {
                                    direction: new CairoCustomEnum({
                                        Up: "()",
                                    }),
                                    label: "↑",
                                    col: "col-start-2",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Left: "()",
                                    }),
                                    label: "←",
                                    col: "col-start-1",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Right: "()",
                                    }),
                                    label: "→",
                                    col: "col-start-3",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Down: "()",
                                    }),
                                    label: "↓",
                                    col: "col-start-2",
                                },
                            ].map(({ direction, label, col }, idx) => (
                                <button
                                    className={`${col} h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200`}
                                    key={idx}
                                    onClick={async () => {
                                        await client.actions.move(
                                            account!,
                                            direction
                                        );
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border border-gray-700 p-2">
                                    Entity ID
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Player
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Position X
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Position Y
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Can Move
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Last Direction
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Remaining Moves
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(entities).map(
                                ([entityId, entity]) => {
                                    const position =
                                        entity.models.dojo_starter.Position;
                                    const moves =
                                        entity.models.dojo_starter.Moves;
                                    const lastDirection =
                                        moves?.last_direction?.isSome()
                                            ? moves.last_direction?.unwrap()
                                            : "N/A";

                                    return (
                                        <tr
                                            key={entityId}
                                            className="text-gray-300"
                                        >
                                            <td className="border border-gray-700 p-2">
                                                {addAddressPadding(entityId)}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.player ?? "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.vec?.x.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.vec?.y.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {moves?.can_move?.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {lastDirection}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {moves?.remaining?.toString() ??
                                                    "N/A"}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>

                {/* // Here sdk is passed as props but this can be done via contexts */}
                <HistoricalEvents />
            </div>
        </div>
    );
}

export default App;
