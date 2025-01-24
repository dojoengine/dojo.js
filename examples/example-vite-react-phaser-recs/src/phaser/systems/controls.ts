import { PhaserLayer } from "../createPhaserLayer";
import { Direction } from "../../dojo/utils";
import { CairoCustomEnum } from "starknet";

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
            move(account, new CairoCustomEnum({ Up: "()" }));
        }
    );

    input.onKeyPress(
        (keys) => keys.has("A"),
        () => {
            move(account, new CairoCustomEnum({ Left: "()" }));
        }
    );

    input.onKeyPress(
        (keys) => keys.has("S"),
        () => {
            move(account, new CairoCustomEnum({ Down: "()" }));
        }
    );

    input.onKeyPress(
        (keys) => keys.has("D"),
        () => {
            move(account, new CairoCustomEnum({ Right: "()" }));
        }
    );

    input.onKeyPress(
        (keys) => keys.has("UP"),
        () => {
            move(account, new CairoCustomEnum({ Up: "()" }));
        }
    );

    input.onKeyPress(
        (keys) => keys.has("LEFT"),
        () => {
            move(account, new CairoCustomEnum({ Left: "()" }));
        }
    );

    input.onKeyPress(
        (keys) => keys.has("DOWN"),
        () => {
            move(account, new CairoCustomEnum({ Down: "()" }));
        }
    );

    input.onKeyPress(
        (keys) => keys.has("RIGHT"),
        () => {
            move(account, new CairoCustomEnum({ Right: "()" }));
        }
    );
};
