import Phaser from "phaser";
import SceneMain from "./scenes/scene-main";

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

export default new Phaser.Game(config);
