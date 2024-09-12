import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { init } from "@dojoengine/sdk";

import { dojoConfig } from "../dojoConfig.ts";
import { Subscription } from "@dojoengine/torii-wasm";

interface Moves {
    player: string;
    remaining: number;
    last_direction: Direction;
    can_move: boolean;
}

interface DirectionsAvailable {
    player: string;
    directions: Direction[];
}

interface Position {
    player: string;
    vec: Vec2;
}

enum Direction {
    None,
    Left,
    Right,
    Up,
    Down,
}

interface Vec2 {
    x: number;
    y: number;
}

type Schema = {
    dojo_starter: {
        moves: Moves;
        directionsAvailable: DirectionsAvailable;
        position: Position;
    };
};

const db = await init<Schema>({
    rpcUrl: dojoConfig.rpcUrl,
    toriiUrl: dojoConfig.toriiUrl,
    relayUrl: dojoConfig.relayUrl,
    worldAddress:
        "0x5d475a9221f6cbf1a016b12400a01b9a89935069aecd57e9876fcb2a7bb29da",
});

function App() {
    // useEffect(() => {
    //     let unsubscribe: Subscription | undefined;

    //     const subscribe = async () => {
    //         try {
    //             unsubscribe = await db.subscribeQuery(
    //                 {
    //                     moves: {},
    //                 },
    //                 (resp) => {
    //                     if (resp.error) {
    //                         console.error(
    //                             "Error querying moves:",
    //                             resp.error.message
    //                         );
    //                         return;
    //                     }
    //                     if (resp.data) {
    //                         console.log("Moves for player 123:", resp.data);
    //                     }
    //                 },
    //                 { logging: true }
    //             );
    //         } catch (error) {
    //             console.error("Subscription error:", error);
    //         }
    //     };

    //     subscribe();

    //     return () => {
    //         if (unsubscribe) {
    //             unsubscribe.cancel();
    //             console.log("Unsubscribed from moves query");
    //         }
    //     };
    // }, []);

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                const entities = await db.getEntities(
                    {
                        dojo_starter: {
                            moves: {
                                $: {
                                    where: {
                                        remaining: {
                                            $eq: 97,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    (resp) => {
                        if (resp.error) {
                            console.error(
                                "Error querying completed important tasks:",
                                resp.error.message
                            );
                            return;
                        }
                        if (resp.data) {
                            console.log(
                                "Completed important tasks:",
                                resp.data
                            );
                        }
                    }
                );
                console.log("Queried entities:", entities.dojo_starter);
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        fetchEntities();
    }, []);
    return <></>;
}

export default App;
