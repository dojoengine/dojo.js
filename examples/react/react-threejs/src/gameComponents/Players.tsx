import { useDojo } from "@/dojo/useDojo";
import { Has, defineSystem } from "@dojoengine/recs";
import { Player } from "./Player";
import { useEffect, useState } from "react";
import { useElementStore } from "@/store";

export const Players = (props: any) => {
    const {
        setup: {
            clientComponents: { Position },
            world,
        },
    } = useDojo();

    const [players, setPlayers] = useState<any>({});

    useEffect(() => {
        defineSystem(world, [Has(Position)], ({ value: [newValue] }) => {
            setPlayers((prevPlayers: any) => {
                // Check if both position are the same (can happen with addOverride)
                if (prevPlayers[newValue?.player] &&
                    prevPlayers[newValue?.player].vec.x === newValue?.vec.x &&
                    prevPlayers[newValue?.player].vec.y === newValue?.vec.y) {
                    return prevPlayers
                }
                // To lerp, get current position and save it to player.prevVec
                const prevVec = prevPlayers[newValue?.player]
                    ? prevPlayers[newValue?.player].vec
                    : undefined;
                return {
                    ...prevPlayers,
                    [newValue?.player]: {
                        ...newValue,
                        prevVec,
                    },
                };
            });
        });
    }, []);

    // When the list is updated, save it in the store to access it from anywhere in the project
    const store = useElementStore((state) => state);
    useEffect(() => {
        store.set_players(players);
    }, [players]);

    return (
        <>
            {
                // Get all players
                Object.values(players).map((player: any) => {
                    return <Player key={player.player} player={player} />;
                })
            }
        </>
    );
};
