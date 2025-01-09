import { Scene } from "phaser";
import { DojoContext } from "../dojo/context";
import { predeployedAccounts } from "../../../../packages/predeployed-connector/dist";
import { dojoConfig } from "../../dojoConfig";

export class Boot extends Scene {
    constructor(private ctx: DojoContext) {
        super("Boot");
    }

    async preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image("background", "assets/bg.png");
    }

    create() {
        this.scene.start("Preloader");
    }
}
