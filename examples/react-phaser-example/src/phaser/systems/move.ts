import {
    Entity,
    Has,
    defineEnterSystem,
    defineSystem,
    getComponentValueStrict,
    getComponentValue,
} from "@dojoengine/recs";
import { PhaserLayer } from "..";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import {
    Animations,
    RPSSprites,
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
            components: { Position, RPSType, PlayerID },
        },
    } = layer;

    defineEnterSystem(
        world,
        [Has(Position), Has(RPSType)],
        ({ entity }: any) => {
            const playerObj = objectPool.get(entity.toString(), "Sprite");

            const type = getComponentValue(
                RPSType,
                entity.toString() as Entity
            );

            console.log("defineEnterSystem", type);

            let animation = Animations.RockIdle;

            switch (type?.rps) {
                case RPSSprites.Rock:
                    animation = Animations.RockIdle;
                    break;
                case RPSSprites.Paper:
                    animation = Animations.PaperIdle;
                    break;
                case RPSSprites.Scissors:
                    animation = Animations.ScissorsIdle;
                    break;
            }

            playerObj.setComponent({
                id: "animation",
                once: (sprite: any) => {
                    sprite.play(animation);
                },
            });
        }
    );

    defineSystem(world, [Has(Position)], ({ entity }: any) => {
        const position = getComponentValueStrict(
            Position,
            entity.toString() as Entity
        );

        const offsetPosition = { x: position?.x, y: position?.y };

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
