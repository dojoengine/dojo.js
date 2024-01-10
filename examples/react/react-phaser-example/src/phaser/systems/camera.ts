import { PhaserLayer } from "../createPhaserLayer";

export const camera = (layer: PhaserLayer) => {
    const {
        scenes: {
            Main: {
                camera: { phaserCamera },
            },
        },
    } = layer;

    phaserCamera.centerOn(0, 0);
};
