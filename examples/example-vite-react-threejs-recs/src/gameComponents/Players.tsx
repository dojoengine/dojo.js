import { useEffect, useState } from "react";
import { useDojo } from "@/dojo/useDojo";
import { useElementStore } from "@/store";
import { defineSystem, Has } from "@dojoengine/recs";

import { Player } from "./Player";

export const Players = (props: any) => {
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
