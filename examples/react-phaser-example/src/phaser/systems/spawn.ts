import { PhaserLayer } from "..";

export const spawn = (layer: PhaserLayer) => {
    const {
        scenes: {
            Main: { input },
        },
        networkLayer: {
            systemCalls: { spawn },
            account,
        },
    } = layer;

    console.log(account);

    input.onKeyPress(
        (keys) => keys.has("SPACE"),
        () => {
            spawn(account.getActiveAccount()!);
        }
    );
};
