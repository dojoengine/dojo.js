import { Scene, GameObjects } from "phaser";
import { DojoContext } from "../dojo/context";
import { PredeployedAccountsConnector } from "@dojoengine/predeployed-connector";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import {
    ClauseBuilder,
    ParsedEntity,
    ToriiQueryBuilder,
} from "@dojoengine/sdk";
import { addAddressPadding } from "starknet";
import { SchemaType } from "../typescript/models.gen";

export class MainMenu extends Scene {
    background: GameObjects.Image;
    title: GameObjects.Text;
    player: GameObjects.Arc;
    availableWallets: PredeployedAccountsConnector[];

    constructor(private ctx: DojoContext<SchemaType>) {
        super("MainMenu");
    }

    init({ wallets }: { wallets: PredeployedAccountsConnector[] }) {
        this.availableWallets = wallets;
    }

    create() {
        this.background = this.add.image(512, 384, "background");

        for (const idx in this.availableWallets) {
            const wallet = this.availableWallets[idx];
            this.add
                .text(400, 100 + parseInt(idx) * 55, wallet.name, {
                    fontFamily: "Arial Black",
                    fontSize: 45,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setInteractive()
                .on(Phaser.Input.Events.POINTER_DOWN, async () => {
                    // @ts-expect-error FIX: _wallet is private, will fix this later
                    const address = wallet._wallet.account.address;
                    const entityId = getEntityIdFromKeys([BigInt(address)]);

                    const entities = await this.ctx.sdk.getEntities(
                        new ToriiQueryBuilder()
                            .withClause(
                                new ClauseBuilder()
                                    .keys([], [addAddressPadding(address)])
                                    .build()
                            )
                            .includeHashedKeys()
                            .build()
                    );
                    this.ctx.store.setEntities(
                        entities as ParsedEntity<SchemaType>[]
                    );

                    this.scene.start("Game", { wallet, entityId, entities });
                });
        }
    }
}
