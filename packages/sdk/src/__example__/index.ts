// EXAMPLE FOR NOW

import * as torii from "@dojoengine/torii-client";
import { init, QueryBuilder } from "..";
import { SchemaType } from "../types";

export interface PlayerModel {
    fieldOrder: string[];
    id: string;
    name: string;
    score: number;
}

export interface GameModel {
    fieldOrder: string[];
    id: string;
    status: string;
}

export interface ItemModel {
    fieldOrder: string[];
    id: string;
    type: string;
    durability: number;
}

export interface GalaxyModel {
    fieldOrder: string[];
    id: string;
    name: string;
}

export interface MockSchemaType extends SchemaType {
    world: {
        player: PlayerModel;
        game: GameModel;
        item: ItemModel;
    };
    universe: {
        galaxy: GalaxyModel;
    };
}

export const schema: MockSchemaType = {
    world: {
        player: {
            fieldOrder: ["id", "name", "score"],
            id: "",
            name: "",
            score: 0,
        },
        game: {
            fieldOrder: ["id", "status"],
            id: "",
            status: "",
        },
        item: {
            fieldOrder: ["id", "type", "durability"],
            id: "",
            type: "",
            durability: 0,
        },
    },
    universe: {
        galaxy: {
            fieldOrder: ["id", "name"],
            id: "",
            name: "",
        },
    },
};

async function exampleUsage() {
    const db = await init<MockSchemaType>(
        {
            client: {
                rpcUrl: "your-rpc-url",
                toriiUrl: "your-torii-url",
                relayUrl: "your-relay-url",
                worldAddress: "your-world-address",
            },
            domain: {
                name: "Example",
                version: "1.0",
                chainId: "your-chain-id",
                revision: "1",
            },
        },
        schema
    );

    // Correct usage: message conforms to the Player model
    const playerMessage = {
        id: "0x123",
        name: "Alice",
        score: 100,
    };

    const typedData = db.generateTypedData("Player", playerMessage);

    // Incorrect usage: TypeScript will throw an error as 'unknownField' is not part of the Player model
    const invalidMessage = {
        id: "0x123",
        name: "Alice",
        score: 100,
        unknownField: "Invalid",
    };

    const invalidTypedData = db.generateTypedData(
        "Player",
        invalidMessage // TypeScript Error
    );

    const query = new QueryBuilder<MockSchemaType>().namespace("world", (n) =>
        n.entity("player", (e) => e.eq("name", "Alice"))
    );

    db.subscribeEntityQuery(query.build(), (resp) => {
        if (resp.error) {
            console.error(
                "Error querying todos and goals:",
                resp.error.message
            );
            return;
        }
        if (resp.data) {
            console.log(
                "Queried todos and goals:",
                resp.data.map((a) => a.models.world)
            );
        }
    });
    // Example usage of getEntities with where clause
    try {
        const eq = new QueryBuilder<MockSchemaType>().namespace("world", (n) =>
            n
                .entity("item", (e) =>
                    e.eq("type", "sword").lt("durability", 5)
                )
                .entity("game", (e) => e.eq("status", "completed"))
        );
        const entities = await db.getEntities(eq.build(), (resp) => {
            if (resp.error) {
                console.error(
                    "Error querying completed important todos:",
                    resp.error.message
                );
                return;
            }
            if (resp.data) {
                console.log(
                    "Completed important todos:",
                    resp.data.map((a) => a.models)
                );
            }
        });
        console.log("Queried entities:", entities);
    } catch (error) {
        console.error("Error querying entities:", error);
    }
}

// Call the example usage function
exampleUsage().catch(console.error);
