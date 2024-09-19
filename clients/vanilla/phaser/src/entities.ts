import { snoise } from "@dojoengine/utils";
import { GameObjects, Scene } from "phaser";

import SceneMain from "./scenes/scene-main";

export class Chunk {
    scene: SceneMain;
    x: number;
    y: number;
    tiles: any;
    isLoaded: boolean;
    constructor(scene: SceneMain, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.tiles = this.scene.add.group();
        this.isLoaded = false;
    }

    unload() {
        if (this.isLoaded) {
            this.tiles.clear(true, true);

            this.isLoaded = false;
        }
    }

    load() {
        if (!this.isLoaded) {
            for (var x = 0; x < this.scene.chunkSize; x++) {
                for (var y = 0; y < this.scene.chunkSize; y++) {
                    var tileX =
                        this.x * (this.scene.chunkSize * this.scene.tileSize) +
                        x * this.scene.tileSize;
                    var tileY =
                        this.y * (this.scene.chunkSize * this.scene.tileSize) +
                        y * this.scene.tileSize;

                    var perlinValue = snoise([tileX / 100, 0, tileY / 100]);

                    var key = "";
                    var animationKey = "";

                    if (perlinValue < 0.2) {
                        key = "sprWater";
                        animationKey = "sprWater";
                    } else if (perlinValue >= 0.2 && perlinValue < 0.3) {
                        key = "sprSand";
                    } else if (perlinValue >= 0.3) {
                        key = "sprGrass";
                    }

                    var tile = new Tile(this.scene, tileX, tileY, key);

                    if (animationKey !== "") {
                        tile.play(animationKey);
                    }

                    this.tiles.add(tile);
                }
            }

            this.isLoaded = true;
        }
    }
}

export class Tile extends GameObjects.Sprite {
    constructor(scene: Scene, x: number, y: number, key: string) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setOrigin(0);
    }
}
