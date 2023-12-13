import {
    Entity,
    Has,
    defineSystem,
    getComponentValueStrict,
} from "@dojoengine/recs";
import { PhaserLayer } from "..";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import {
    Animations,
    ORIGIN_OFFSET,
    TILE_HEIGHT,
    TILE_WIDTH,
} from "../config/constants";

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

    defineSystem(world, [Has(Position)], ({ entity }: any) => {
        const position = getComponentValueStrict(
            Position,
            entity.toString() as Entity
        );

        const entity_uniform = (+entity).toString();

        console.log(
            entity,
            entity_uniform,
            "\n------- pos/type triggered -------\n",
            position
        );

        const player = objectPool.get(entity_uniform, "Sprite");

        player.setComponent({
            id: "animation",
            once: (sprite) => {
                sprite.play(Animations.RockIdle);
            },
        });

        const offsetPosition = {
            x: position?.vec.x - ORIGIN_OFFSET || 0,
            y: position?.vec.y - ORIGIN_OFFSET || 0,
        };

        const pixelPosition = tileCoordToPixelCoord(
            offsetPosition,
            TILE_WIDTH,
            TILE_HEIGHT
        );

        player.setComponent({
            id: "position",
            once: (sprite) => {
                sprite.setPosition(pixelPosition?.x, pixelPosition?.y);

                camera.centerOn(pixelPosition?.x, pixelPosition?.y);
            },
        });
    });
};
