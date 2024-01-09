import { PhaserLayer } from "..";
import { Direction } from "../../dojo/utils";

export const controls = (layer: PhaserLayer) => {
    const {
        scenes: {
            Main: { input },
        },
        networkLayer: {
            systemCalls: { move },
            account: account,
        },
    } = layer;

    input.onKeyPress(
        (keys) => keys.has("W"),
        () => {
            move(account, Direction.Up);
        }
    );

    input.onKeyPress(
        (keys) => keys.has("A"),
        () => {
            move(account, Direction.Left);
        }
    );

    input.onKeyPress(
        (keys) => keys.has("S"),
        () => {
            move(account, Direction.Down);
        }
    );

    input.onKeyPress(
        (keys) => keys.has("D"),
        () => {
            move(account, Direction.Right);
        }
    );

    input.onKeyPress(
        (keys) => keys.has("UP"),
        () => {
            move(account, Direction.Up);
        }
    );

    input.onKeyPress(
        (keys) => keys.has("LEFT"),
        () => {
            move(account, Direction.Left);
        }
    );

    input.onKeyPress(
        (keys) => keys.has("DOWN"),
        () => {
            move(account, Direction.Down);
        }
    );

    input.onKeyPress(
        (keys) => keys.has("RIGHT"),
        () => {
            move(account, Direction.Right);
        }
    );
};
