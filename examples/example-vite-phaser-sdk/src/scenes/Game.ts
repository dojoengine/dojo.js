import type { PredeployedAccountsConnector } from "@dojoengine/predeployed-connector";
import {
    ClauseBuilder,
    type ParsedEntity,
    type StandardizedQueryResult,
    ToriiQueryBuilder,
} from "@dojoengine/sdk";
import { Scene } from "phaser";
import {
    type AccountInterface,
    addAddressPadding,
    type BigNumberish,
    CairoCustomEnum,
} from "starknet";
import type { DojoContext } from "../dojo/context";
import { ModelsMapping, type SchemaType } from "../typescript/models.gen";

type MoveKeys = {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
};

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    player: Phaser.GameObjects.Arc;
    keys: MoveKeys;
    account: AccountInterface;
    entityId: BigNumberish;
    entities: StandardizedQueryResult<SchemaType> = [];
    spawn_button: Phaser.GameObjects.Text;
    remainingMoves: Phaser.GameObjects.Text;
    state: any;

    constructor(private ctx: DojoContext<SchemaType>) {
        super("Game");
    }

    async init({
        wallet,
        entityId,
        entities,
    }: {
        wallet: PredeployedAccountsConnector;
        entityId: BigNumberish;
        entities: StandardizedQueryResult<SchemaType>;
    }) {
        // @ts-expect-error FIX: _wallet is private, will fix this later
        this.account = wallet._wallet.account;
        this.entityId = entityId;
        this.entities = entities;
    }

    async preload() {
        const [_, _cancelSubscription] = await this.ctx.sdk.subscribeEntities(
            new ToriiQueryBuilder()
                .withClause(
                    new ClauseBuilder()
                        .keys(
                            [],
                            [addAddressPadding(this.account.address)],
                            "FixedLen"
                        )
                        .build()
                )
                .includeHashedKeys()
                .build(),
            ({ data }) => {
                if (data) {
                    this.ctx.store.updateEntity(
                        data[0] as ParsedEntity<SchemaType>
                    );
                }
            }
        );
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);

        this.background = this.add.image(512, 384, "background");

        if (Object.keys(this.entities).length === 0) {
            this.spawn_button = this.add
                .text(384, 250, "Spawn", {
                    fontFamily: "Arial Black",
                    fontSize: 64,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setInteractive()
                .on(Phaser.Input.Events.POINTER_DOWN, async () => {
                    await this.ctx.client.actions.spawn(this.account);
                    this.scene.start("Game");
                });
        } else {
            this.player = this.add.circle(512, 384, 10, 0xff0000);
            const move = this.ctx.useModel(this.entityId, ModelsMapping.Moves);
            this.remainingMoves = this.add.text(
                10,
                10,
                move?.remaining.toString() ?? "0"
            );
        }

        this.add
            .text(900, 10, "Maimenu")
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, async () => {
                this.scene.start("MainMenu");
            });

        this.keys = this.input.keyboard!.addKeys("W,A,S,D") as MoveKeys;

        this.keys.W.on("down", async () => {
            await this.ctx.client.actions.move(
                this.account,
                new CairoCustomEnum({ Up: "()" })
            );
        });
        this.keys.S.on("down", async () => {
            await this.ctx.client.actions.move(
                this.account,
                new CairoCustomEnum({ Down: "()" })
            );
        });
        this.keys.A.on("down", async () => {
            await this.ctx.client.actions.move(
                this.account,
                new CairoCustomEnum({ Left: "()" })
            );
        });
        this.keys.D.on("down", async () => {
            await this.ctx.client.actions.move(
                this.account,
                new CairoCustomEnum({ Right: "()" })
            );
        });
    }

    async update(): Promise<void> {
        const position = this.ctx.useModel(
            this.entityId,
            ModelsMapping.Position
        );
        const move = this.ctx.useModel(this.entityId, ModelsMapping.Moves);

        if (position?.vec && this.player && this.player.x && this.player.y) {
            const { x, y } = position.vec;
            this.player.x = parseInt(x.toString()) * 10;
            this.player.y = parseInt(y.toString()) * 10;
        }

        if (
            move &&
            this.remainingMoves &&
            move.remaining.toString() !== this.remainingMoves.text
        ) {
            this.remainingMoves.setText(move.remaining.toString());
        }
    }
}
