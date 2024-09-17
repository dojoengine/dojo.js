import { useEffect, useState } from "react";
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
        Moves: Moves;
        DirectionsAvailable: DirectionsAvailable;
        Position: Position;
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
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const subscribe = async () => {
            const subscription = await db.subscribeEntityQuery(
                {
                    dojo_starter: {
                        Moves: true,
                    },
                },
                (response) => {
                    if (response.error) {
                        console.error(
                            "Error setting up entity sync:",
                            response.error
                        );
                    } else {
                        console.log(response);
                    }
                }
            );

            unsubscribe = () => subscription.cancel();
        };

        subscribe();

        return () => {
            if (unsubscribe) {
                unsubscribe();
                console.log("Sync unsubscribed");
            }
        };
    }, []);

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                const entities = await db.getEntities(
                    {
                        dojo_starter: {
                            Moves: {
                                $: {
                                    where: { last_direction: { $eq: "Left" } },
                                },
                            },
                        },
                    },
                    (resp) => {
                        if (resp.error) {
                            console.error(
                                "resp.error.message:",
                                resp.error.message
                            );
                            return;
                        }
                        if (resp.data) {
                        }
                    }
                );
                // console.log("Queried entities:", entities);
            } catch (error) {
                console.error("Error querying entities:", error);
            }
        };

        fetchEntities();
    }, []);
    return (
        <>
            <button onClick={() => console.log("s")}></button>
        </>
    );
}

export default App;
