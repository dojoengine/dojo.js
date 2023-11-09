import {
    Entity,
    Has,
    defineEnterSystem,
    defineSystem,
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
            components: { Player },
        },
    } = layer;

    defineEnterSystem(world, [Has(Player)], ({ entity }: any) => {
        const playerObj = objectPool.get(entity.toString(), "Sprite");

        console.log(playerObj);

        playerObj.setComponent({
            id: "animation",
            once: (sprite: any) => {
                console.log(sprite);
                sprite.play(Animations.SwordsmanIdle);
            },
        });
    });

    defineSystem(world, [Has(Player)], ({ entity }: any) => {
        console.log(entity);

        const player = getComponentValueStrict(
            Player,
            entity.toString() as Entity
        );

        const offsetPosition = { x: player?.position.x, y: player?.position.y };

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
