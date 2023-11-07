import { PhaserLayer } from "..";
import { Direction } from "../../utils";

export const controls = (layer: PhaserLayer) => {

    const {
        scenes: {
            Main: { input },
        },
        networkLayer: {
            systemCalls: { move },
            account
        },
    } = layer;

    input.onKeyPress(
        keys => keys.has("W"),
        () => {
            move(account, Direction.Up);
        });

    input.onKeyPress(
        keys => keys.has("A"),
        () => {
            move(account, Direction.Left);
        }
    );

    input.onKeyPress(
        keys => keys.has("S"),
        () => {
            move(account, Direction.Down);
        }
    );

    input.onKeyPress(
        keys => keys.has("D"),
        () => {
            move(account, Direction.Right);
        }
    );
};