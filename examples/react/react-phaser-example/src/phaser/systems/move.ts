import {
    Entity,
    Has,
    defineSystem,
    defineEnterSystem,
    getComponentValueStrict,
} from "@dojoengine/recs";
import { PhaserLayer } from "..";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { Animations, TILE_HEIGHT, TILE_WIDTH } from "../config/constants";

export const move = (layer: PhaserLayer) => {
    const {
        world,
        scenes: {
            Main: { objectPool, camera },
        },
        networkLayer: {
            components: { Position },
        },
    } = layer;

    defineEnterSystem(world, [Has(Position)], ({ entity }: any) => {
        const playerObj = objectPool.get(entity.toString(), "Sprite");

        console.log(playerObj);

        playerObj.setComponent({
            id: "animation",
            once: (sprite: any) => {
                console.log(sprite);
                sprite.play(Animations.RockIdle);
            },
        });
    });

    defineSystem(world, [Has(Position)], ({ entity }: any) => {
        console.log(entity);

        const position = getComponentValueStrict(
            Position,
            entity.toString() as Entity
        );

        const offsetPosition = { x: position?.vec.x, y: position?.vec.y };

        const pixelPosition = tileCoordToPixelCoord(
            offsetPosition,
            TILE_WIDTH,
            TILE_HEIGHT
        );

        const player = objectPool.get(entity, "Sprite");

        player.setComponent({
            id: "position",
            once: (sprite: any) => {
                sprite.setPosition(pixelPosition?.x, pixelPosition?.y);
                camera.centerOn(pixelPosition?.x, pixelPosition?.y);
            },
        });
    });
};
