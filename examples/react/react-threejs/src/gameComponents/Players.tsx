import { useDojo } from "@/dojo/useDojo";
import { Has, defineSystem } from "@dojoengine/recs";
import { Player } from "./Player";
import { useEffect, useState } from "react";

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

    return (
        <>
            {
                // Get all players
                Object.values(players).map((player: any) => {
                    return (
                        <Player
                            key={player.player}
                            player={player}
                        />
                    );
                })
            }
        </>
    );
};
