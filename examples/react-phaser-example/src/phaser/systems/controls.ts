import { PhaserLayer } from "..";
import { Direction } from "../../utils";

export const controls = (layer: PhaserLayer) => {
    const {
        scenes: {
            Main: { input },
        },
        networkLayer: {
            systemCalls: { move },
            account: { account },
        },
    } = layer;

    input.onKeyPress(
        (keys) => keys.has("W"),
        () => {
            move({ signer: account, direction: Direction.Up });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("A"),
        () => {
            move({ signer: account, direction: Direction.Left });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("S"),
        () => {
            move({ signer: account, direction: Direction.Down });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("D"),
        () => {
            move({ signer: account, direction: Direction.Right });
        }
    );
};
