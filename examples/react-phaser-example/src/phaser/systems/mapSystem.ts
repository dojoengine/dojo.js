import { Tileset } from "../../assets/world";
import { PhaserLayer } from "..";
import { snoise } from "@dojoengine/utils";
import { MAP_AMPLITUDE } from "../config/constants";

export function mapSystem(layer: PhaserLayer) {
    const {
        scenes: {
            Main: {
                maps: {
                    Main: { putTileAt },
                },
            },
        },
    } = layer;

    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            const coord = { x, y };
            // Get a noise value between 0 and 100
            const seed = Math.floor(
                ((snoise([x / MAP_AMPLITUDE, 0, y / MAP_AMPLITUDE]) + 1) / 2) *
                    100
            );

            if (seed > 70) {
                // This would be the highest 'elevation'
                putTileAt(coord, Tileset.Sea, "Foreground");
            } else if (seed > 60) {
                // Even lower, could be fields or plains
                putTileAt(coord, Tileset.Desert, "Foreground");
            } else if (seed > 53) {
                // Close to water level, might be beach
                putTileAt(coord, Tileset.Forest, "Foreground");
            } else {
                // Below a certain threshold, it is sea
                putTileAt(coord, Tileset.Land, "Foreground");
            }
        }
    }
}
