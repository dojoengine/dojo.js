import { Game, Types } from "phaser";

import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

import { init } from "@dojoengine/sdk/experimental";

import { SchemaType } from "./typescript/models.gen";
import { dojoConfig } from "../dojoConfig";
import { DojoContext } from "./dojo/context";
import { DojoProvider } from "@dojoengine/core";
import { createDojoStore } from "@dojoengine/sdk/state";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#028af8",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Boot, Preloader, MainMenu, MainGame, GameOver],
    // fps: {
    //   limit: 10,
    // },
};

export const useDojoStore = createDojoStore<SchemaType>();

async function main() {
    const sdk = await init<SchemaType>({
        client: {
            rpcUrl: dojoConfig.rpcUrl,
            toriiUrl: dojoConfig.toriiUrl,
            relayUrl: dojoConfig.relayUrl,
            worldAddress: dojoConfig.manifest.world.address,
        },
        domain: {
            name: "WORLD_NAME",
            version: "1.0",
            chainId: "KATANA",
            revision: "1",
        },
    });
    const dojoProvider = new DojoProvider(
        dojoConfig.manifest,
        dojoConfig.rpcUrl
    );

    const context = new DojoContext(sdk, dojoProvider, useDojoStore);
    const game = new Game(config);
    [Boot, Preloader, MainMenu, MainGame, GameOver].map((s) => {
        game.scene.add(s.toString(), new s(context));
    });
    return game;
}

export default main()
    .then((game) => game)
    .catch(console.error);
