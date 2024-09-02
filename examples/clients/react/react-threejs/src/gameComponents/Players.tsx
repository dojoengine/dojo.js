import { useDojo } from "@/dojo/useDojo";
import { Has, defineSystem } from "@dojoengine/recs";
import { Player } from "./Player";
import { useEffect } from "react";
import { useElementStore } from "@/store";

export const Players = (_props: any) => {
    const {
        setup: {
            clientComponents: { Position },
            world,
        },
    } = useDojo();

    const players = useElementStore((state) => state.players);
    const update_player = useElementStore((state) => state.update_player);

    useEffect(() => {
        defineSystem(world, [Has(Position)], ({ value: [newValue] }) => {
            update_player(newValue);
        });
    }, []);

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
