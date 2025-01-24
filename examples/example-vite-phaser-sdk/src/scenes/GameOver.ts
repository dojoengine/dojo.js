import { Scene } from "phaser";
import { DojoContext } from "../dojo/context";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text: Phaser.GameObjects.Text;

    constructor(private ctx: DojoContext) {
        super("GameOver");
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.5);

        this.gameover_text = this.add.text(512, 384, "Game Over", {
            fontFamily: "Arial Black",
            fontSize: 64,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 8,
            align: "center",
        });
        this.gameover_text.setOrigin(0.5);
        this.gameover_text
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.gameover_text = this.add.text(512, 384, "Connect", {
                    fontFamily: "Arial Black",
                    fontSize: 64,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                });
            });

        // this.gameover_text.addListener("click", console.log)

        // this.input.once('pointerdown', () => {
        //
        //     this.scene.start('MainMenu');
        //
        // });
    }
}

function handleButtonClick() {
    console.log(this);
}
