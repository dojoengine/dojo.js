import { PhaserLayer } from "..";
import { Direction } from "../../dojo/utils";

export const controls = (layer: PhaserLayer) => {
    const {
        scenes: {
            Main: { input },
        },
        networkLayer: {
            systemCalls: { move },
            account: signer,
        },
    } = layer;

    input.onKeyPress(
        (keys) => keys.has("W"),
        () => {
            move({ signer, direction: Direction.Up });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("A"),
        () => {
            move({ signer, direction: Direction.Left });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("S"),
        () => {
            move({ signer, direction: Direction.Down });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("D"),
        () => {
            move({ signer, direction: Direction.Right });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("UP"),
        () => {
            move({ signer, direction: Direction.Up });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("LEFT"),
        () => {
            move({ signer, direction: Direction.Left });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("DOWN"),
        () => {
            move({ signer, direction: Direction.Down });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("RIGHT"),
        () => {
            move({ signer, direction: Direction.Right });
        }
    );
};
