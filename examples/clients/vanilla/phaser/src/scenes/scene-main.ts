import { Scene } from "phaser";
import { Chunk } from "../entities";

import { SetupResult } from "../dojo/setup";
import { Account } from "starknet";
export default class SceneMain extends Scene {
    dojo: SetupResult;
    chunkSize: number;
    tileSize: number;
    cameraSpeed: number;
    followPoint?: Phaser.Math.Vector2;
    chunks: Map<String, Chunk>;
    keyW: Phaser.Input.Keyboard.Key | null;
    keyS: Phaser.Input.Keyboard.Key | null;
    keyA: Phaser.Input.Keyboard.Key | null;
    keyD: Phaser.Input.Keyboard.Key | null;

    constructor(dojo: SetupResult) {
        super({ key: "MainScene" });
        this.dojo = dojo;

        this.chunkSize = 16;
        this.tileSize = 16;
        this.cameraSpeed = 2;
        this.chunks = new Map<string, Chunk>();
        this.keyW = null;
        this.keyS = null;
        this.keyA = null;
        this.keyD = null;
        this.followPoint = new Phaser.Math.Vector2(0, 0);
    }
    preload() {
        this.load.spritesheet("sprWater", "assets/sprWater.png", {
            frameWidth: 16,
            frameHeight: 16,
        });
        this.load.image("sprSand", "assets/sprSand.png");
        this.load.image("sprGrass", "assets/sprGrass.png");
    }
    create() {
        this.anims.create({
            key: "sprWater",
            frames: this.anims.generateFrameNumbers("sprWater", {
                start: 0,
                end: 1,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.cameras.main.setZoom(2);
        this.followPoint = new Phaser.Math.Vector2(
            this.cameras.main.worldView.x +
                this.cameras.main.worldView.width * 2,
            this.cameras.main.worldView.y +
                this.cameras.main.worldView.height * 2
        );

        if (this.input.keyboard === null) {
            throw new Error("plugin input.keyboard is not loaded");
        }

        this.keyW = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.W
        );
        this.keyS = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        );
        this.keyA = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.A
        );
        this.keyD = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.D
        );

        this.dojo.systemCalls.spawn(this.dojo.burnerManager.account as Account);
    }

    getChunk(x: number, y: number) {
        let chunk = this.chunks.get(`${x},${y}`);
        if (chunk === undefined) {
            return null;
        }
        return chunk;
    }

    update() {
        if (this.followPoint === null || this.followPoint === undefined) {
            throw new Error("failed to initialize followPoint");
        }
        if (!this.checkInputs([this.keyA, this.keyD, this.keyW, this.keyS])) {
            throw new Error("failed to initialize inputs");
        }
        var snappedChunkX =
            this.chunkSize *
            this.tileSize *
            Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
        var snappedChunkY =
            this.chunkSize *
            this.tileSize *
            Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

        snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
        snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

        for (let x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
            for (let y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
                const existingChunk = this.getChunk(x, y);

                if (existingChunk !== null) {
                    continue;
                }
                this.chunks.set(`${x},${y}`, new Chunk(this, x, y));
            }
        }

        for (const [_, chunk] of this.chunks) {
            if (chunk === null) continue;

            if (
                Phaser.Math.Distance.Between(
                    snappedChunkX,
                    snappedChunkY,
                    chunk.x,
                    chunk.y
                ) < 3
            ) {
                chunk.load();
                continue;
            }
            chunk.unload();
        }

        if (null !== this.keyW && this.keyW.isDown) {
            this.followPoint.y -= this.cameraSpeed;
            this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
            this.dojo.systemCalls.move(
                this.dojo.burnerManager.account as Account,
                { type: "Up" }
            );
            return;
        }
        if (null !== this.keyS && this.keyS.isDown) {
            this.followPoint.y += this.cameraSpeed;
            this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
            this.dojo.systemCalls.move(
                this.dojo.burnerManager.account as Account,
                { type: "Down" }
            );
            return;
        }
        if (null !== this.keyA && this.keyA.isDown) {
            this.followPoint.x -= this.cameraSpeed;
            this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
            this.dojo.systemCalls.move(
                this.dojo.burnerManager.account as Account,
                { type: "Left" }
            );
            return;
        }
        if (null !== this.keyD && this.keyD.isDown) {
            this.followPoint.x += this.cameraSpeed;
            this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
            this.dojo.systemCalls.move(
                this.dojo.burnerManager.account as Account,
                { type: "Right" }
            );
            return;
        }

        this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
    }

    private checkInputs(inputs: (Phaser.Input.Keyboard.Key | null)[]): boolean {
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i] === null || inputs[i] === undefined) {
                return false;
            }
        }
        return true;
    }
}
