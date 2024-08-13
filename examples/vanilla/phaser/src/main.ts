import Phaser from "phaser";
import SceneMain from "./scenes/scene-main";
import { dojoConfig } from "../dojoConfig.ts";
import { setup } from "./dojo/setup.ts";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    backgroundColor: "black",
    parent: "app",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
        },
    },
    scene: [SceneMain],
    pixelArt: true,
    roundPixels: true,
};

export default setup(dojoConfig)
    .then((dojo) => {
        const game = new Phaser.Game(config);
        game.scene.add("MainScene", new SceneMain(dojo));
        return game;
    })
    .catch((e) => {
        console.error(e);
        return;
    });
