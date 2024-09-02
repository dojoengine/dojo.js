import { DirectionDefinition } from "../../dojo/typescript/models.gen";
import { PhaserLayer } from "../createPhaserLayer";

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
            move(account, { type: "Up" });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("A"),
        () => {
            move(account, { type: "Left" });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("S"),
        () => {
            move(account, { type: "Down" });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("D"),
        () => {
            move(account, { type: "Right" });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("UP"),
        () => {
            move(account, { type: "Up" });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("LEFT"),
        () => {
            move(account, { type: "Left" });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("DOWN"),
        () => {
            move(account, { type: "Down" });
        }
    );

    input.onKeyPress(
        (keys) => keys.has("RIGHT"),
        () => {
            move(account, { type: "Right" });
        }
    );
};
