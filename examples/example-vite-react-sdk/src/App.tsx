import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import * as torii from "@dojoengine/torii-wasm";
import { useDojoSDK, useEntityQuery } from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { ModelsMapping } from "./typescript/models.gen.ts";
import { WalletAccount } from "./wallet-account.tsx";
import { useEffect, useRef } from "react";

/**
 * Main application component that provides game functionality and UI.
 * Handles entity subscriptions, state management, and user interactions.
 *
 * @param props.sdk - The Dojo SDK instance configured with the game schema
 */
function App() {
    const { sdk } = useDojoSDK();
    const { account } = useAccount();
    // const entities = useDojoStore((state) => state.entities);
    const subscriptionRef = useRef<torii.Subscription>();

    // const { spawn } = useSystemCalls();

    // const entityId = useEntityId(account?.address ?? "0");
    useEffect(() => {
        async function setupSub() {
            if (subscriptionRef.current) return;
            const contractAddresses = [
                "0x044e6bcc627e6201ce09f781d1aae44ea4c21c2fdef299e34fce55bef2d02210",
                "0x02549653a4ae1ff8d04a20b8820a49cbe97486c536ec0e4c8f68aa33d80067cf",
                "0x068a7a07e08fc3e723a878223d00f669106780d5ea6665eb15d893476d47bf3b",
                "0x071333ac75b7d5ba89a2d0c2b67d5b955258a4d46eb42f3428da6137bbbfdfd9",
                "0x07aaa9866750a0db82a54ba8674c38620fa2f967d2fbb31133def48e0527c87f",
                "0x02e9c711b1a7e2784570b1bda5082a92606044e836ba392d2b977d280fb74b3c",
                "0x014aa76e6c6f11e3f657ee2c213a62006c78ff2c6f8ed40b92c42fd554c246f2",
            ];
            subscriptionRef.current = await sdk.onTokenBalanceUpdated({
                contractAddresses,
                accountAddresses: [],
                tokenIds: [],
                callback: ({ data }) => {
                    console.log("Subscription dojo.c callback called");
                    console.log(data);
                },
            });
            await sdk.subscribeEventQuery({
                query: new ToriiQueryBuilder().withClause(
                    KeysClause([], [undefined], "VariableLen").build()
                ),
                callback: ({ data, error }) => {
                    if (data) {
                        console.log(data[0]);
                    }
                    if (error) {
                        console.error(error);
                    }
                },
            });
        }
        setupSub();
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.free();
            }
        };
    }, [sdk]);

    useEntityQuery(
        new ToriiQueryBuilder()
            .withClause(
                // Querying Moves and Position models that has at least [account.address] as key
                KeysClause(
                    [ModelsMapping.Moves, ModelsMapping.Position],
                    [
                        account?.address
                            ? addAddressPadding(account.address)
                            : undefined,
                    ],
                    "FixedLen"
                ).build()
            )
            .includeHashedKeys()
    );

    // const moves = useModel(entityId as string, ModelsMapping.Moves);
    // const position = useModel(entityId as string, ModelsMapping.Position);

    return (
        <div className="bg-black min-h-screen w-full p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <WalletAccount />

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"> */}
                {/*     <div className="bg-gray-700 p-4 rounded-lg shadow-inner"> */}
                {/*         <div className="grid grid-cols-3 gap-2 w-full h-48"> */}
                {/*             <div className="col-start-2"> */}
                {/*                 <button */}
                {/*                     className="h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200" */}
                {/*                     onClick={async () => await spawn()} */}
                {/*                 > */}
                {/*                     + */}
                {/*                 </button> */}
                {/*             </div> */}
                {/*             <div className="col-span-3 text-center text-base text-white"> */}
                {/*                 Moves Left:{" "} */}
                {/*                 {moves ? `${moves.remaining}` : "Need to Spawn"} */}
                {/*             </div> */}
                {/*             <div className="col-span-3 text-center text-base text-white"> */}
                {/*                 {position */}
                {/*                     ? `x: ${position?.vec?.x}, y: ${position?.vec?.y}` */}
                {/*                     : "Need to Spawn"} */}
                {/*             </div> */}
                {/*             <div className="col-span-3 text-center text-base text-white"> */}
                {/*                 {moves && moves.last_direction.isSome() */}
                {/*                     ? moves.last_direction.unwrap() */}
                {/*                     : ""} */}
                {/*             </div> */}
                {/*         </div> */}
                {/*     </div> */}
                {/**/}
                {/*     <div className="bg-gray-700 p-4 rounded-lg shadow-inner"> */}
                {/*         <div className="grid grid-cols-3 gap-2 w-full h-48"> */}
                {/*             {[ */}
                {/*                 { */}
                {/*                     direction: new CairoCustomEnum({ */}
                {/*                         Up: "()", */}
                {/*                     }), */}
                {/*                     label: "↑", */}
                {/*                     col: "col-start-2", */}
                {/*                 }, */}
                {/*                 { */}
                {/*                     direction: new CairoCustomEnum({ */}
                {/*                         Left: "()", */}
                {/*                     }), */}
                {/*                     label: "←", */}
                {/*                     col: "col-start-1", */}
                {/*                 }, */}
                {/*                 { */}
                {/*                     direction: new CairoCustomEnum({ */}
                {/*                         Right: "()", */}
                {/*                     }), */}
                {/*                     label: "→", */}
                {/*                     col: "col-start-3", */}
                {/*                 }, */}
                {/*                 { */}
                {/*                     direction: new CairoCustomEnum({ */}
                {/*                         Down: "()", */}
                {/*                     }), */}
                {/*                     label: "↓", */}
                {/*                     col: "col-start-2", */}
                {/*                 }, */}
                {/*             ].map(({ direction, label, col }, idx) => ( */}
                {/*                 <button */}
                {/*                     className={`${col} h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200`} */}
                {/*                     key={idx} */}
                {/*                     onClick={async () => { */}
                {/*                         await client.actions.move( */}
                {/*                             account!, */}
                {/*                             direction */}
                {/*                         ); */}
                {/*                     }} */}
                {/*                 > */}
                {/*                     {label} */}
                {/*                 </button> */}
                {/*             ))} */}
                {/*         </div> */}
                {/*     </div> */}
                {/* </div> */}
                {/**/}
                {/* <div className="mt-8 overflow-x-auto"> */}
                {/*     <table className="w-full border-collapse border border-gray-700"> */}
                {/*         <thead> */}
                {/*             <tr className="bg-gray-800 text-white"> */}
                {/*                 <th className="border border-gray-700 p-2"> */}
                {/*                     Entity ID */}
                {/*                 </th> */}
                {/*                 <th className="border border-gray-700 p-2"> */}
                {/*                     Player */}
                {/*                 </th> */}
                {/*                 <th className="border border-gray-700 p-2"> */}
                {/*                     Position X */}
                {/*                 </th> */}
                {/*                 <th className="border border-gray-700 p-2"> */}
                {/*                     Position Y */}
                {/*                 </th> */}
                {/*                 <th className="border border-gray-700 p-2"> */}
                {/*                     Can Move */}
                {/*                 </th> */}
                {/*                 <th className="border border-gray-700 p-2"> */}
                {/*                     Last Direction */}
                {/*                 </th> */}
                {/*                 <th className="border border-gray-700 p-2"> */}
                {/*                     Remaining Moves */}
                {/*                 </th> */}
                {/*             </tr> */}
                {/*         </thead> */}
                {/*         <tbody> */}
                {/*             {Object.entries(entities).map( */}
                {/*                 ([entityId, entity]) => { */}
                {/*                     const position = */}
                {/*                         entity.models.dojo_starter.Position; */}
                {/*                     const moves = */}
                {/*                         entity.models.dojo_starter.Moves; */}
                {/*                     const lastDirection = */}
                {/*                         moves?.last_direction?.isSome() */}
                {/*                             ? moves.last_direction?.unwrap() */}
                {/*                             : "N/A"; */}
                {/**/}
                {/*                     return ( */}
                {/*                         <tr */}
                {/*                             key={entityId} */}
                {/*                             className="text-gray-300" */}
                {/*                         > */}
                {/*                             <td className="border border-gray-700 p-2"> */}
                {/*                                 {addAddressPadding(entityId)} */}
                {/*                             </td> */}
                {/*                             <td className="border border-gray-700 p-2"> */}
                {/*                                 {position?.player ?? "N/A"} */}
                {/*                             </td> */}
                {/*                             <td className="border border-gray-700 p-2"> */}
                {/*                                 {position?.vec?.x.toString() ?? */}
                {/*                                     "N/A"} */}
                {/*                             </td> */}
                {/*                             <td className="border border-gray-700 p-2"> */}
                {/*                                 {position?.vec?.y.toString() ?? */}
                {/*                                     "N/A"} */}
                {/*                             </td> */}
                {/*                             <td className="border border-gray-700 p-2"> */}
                {/*                                 {moves?.can_move?.toString() ?? */}
                {/*                                     "N/A"} */}
                {/*                             </td> */}
                {/*                             <td className="border border-gray-700 p-2"> */}
                {/*                                 {lastDirection} */}
                {/*                             </td> */}
                {/*                             <td className="border border-gray-700 p-2"> */}
                {/*                                 {moves?.remaining?.toString() ?? */}
                {/*                                     "N/A"} */}
                {/*                             </td> */}
                {/*                         </tr> */}
                {/*                     ); */}
                {/*                 } */}
                {/*             )} */}
                {/*         </tbody> */}
                {/*     </table> */}
                {/* </div> */}

                {/* <Events /> */}
                {/* // Here sdk is passed as props but this can be done via contexts */}
                {/* <HistoricalEvents /> */}
            </div>
        </div>
    );
}

export default App;
