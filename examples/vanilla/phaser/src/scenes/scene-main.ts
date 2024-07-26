import { Scene } from "phaser";
import { Chunk } from "../entities";

export default class SceneMain extends Scene {
    chunkSize: number;
    tileSize: number;
    cameraSpeed: number;
    followPoint?: Phaser.Math.Vector2;
    chunks: Chunk[];
    keyW: Phaser.Input.Keyboard.Key | null;
    keyS: Phaser.Input.Keyboard.Key | null;
    keyA: Phaser.Input.Keyboard.Key | null;
    keyD: Phaser.Input.Keyboard.Key | null;

    constructor() {
        super({ key: "MainScene" });

        this.chunkSize = 16;
        this.tileSize = 16;
        this.cameraSpeed = 2;
        this.chunks = [];
        this.keyW = null;
        this.keyS = null;
        this.keyA = null;
        this.keyD = null;
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
    }

    getChunk(x: number, y: number) {
        var chunk = null;
        for (var i = 0; i < this.chunks.length; i++) {
            if (this.chunks[i].x == x && this.chunks[i].y == y) {
                chunk = this.chunks[i];
            }
        }
        return chunk;
    }

    update() {
        if (this.followPoint === null || this.followPoint === undefined) {
            throw new Error("failed to initialize followPoint");
        }
        if (
            this.checkInputs([this.keyA, this.keyD, this.keyW, this.keyS]) ===
            false
        ) {
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

        for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
            for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
                var existingChunk = this.getChunk(x, y);

                if (existingChunk == null) {
                    var newChunk = new Chunk(this, x, y);
                    this.chunks.push(newChunk);
                }
            }
        }

        for (var i = 0; i < this.chunks.length; i++) {
            var chunk = this.chunks[i];

            if (
                Phaser.Math.Distance.Between(
                    snappedChunkX,
                    snappedChunkY,
                    chunk.x,
                    chunk.y
                ) < 3
            ) {
                if (chunk !== null) {
                    chunk.load();
                }
            } else {
                if (chunk !== null) {
                    chunk.unload();
                }
            }
        }

        if (null !== this.keyW && this.keyW.isDown) {
            this.followPoint.y -= this.cameraSpeed;
            this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
            return;
        }
        if (null !== this.keyS && this.keyS.isDown) {
            this.followPoint.y += this.cameraSpeed;
            this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
            return;
        }
        if (null !== this.keyA && this.keyA.isDown) {
            this.followPoint.x -= this.cameraSpeed;
            this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
            return;
        }
        if (null !== this.keyD && this.keyD.isDown) {
            this.followPoint.x += this.cameraSpeed;
            this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
            return;
        }

        this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
    }

    private checkInputs(inputs: (Phaser.Input.Keyboard.Key | null)[]): boolean {
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i] === null || inputs[i] === undefined) {
                return false;
            }
        }
        return true;
    }
}
