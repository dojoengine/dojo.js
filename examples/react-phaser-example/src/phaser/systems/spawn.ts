import { PhaserLayer } from "..";

export const spawn = (layer: PhaserLayer) => {
    const {
        scenes: {
            Main: { input },
        },
        networkLayer: {
            systemCalls: { spawn },
            account: { account },
        },
    } = layer;

    input.onKeyPress(
        (keys) => keys.has("SPACE"),
        () => {
            spawn({ signer: account });
        }
    );
};
