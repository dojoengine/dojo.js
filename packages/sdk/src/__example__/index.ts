// EXAMPLE FOR NOW

import { init } from "..";
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

export interface MockSchemaType extends SchemaType {
    world: {
        player: PlayerModel;
        game: GameModel;
        item: ItemModel;
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
};

async function exampleUsage() {
    const db = await init<MockSchemaType>(
        {
            rpcUrl: "your-rpc-url",
            toriiUrl: "your-torii-url",
            relayUrl: "your-relay-url",
            worldAddress: "your-world-address",
        },
        schema
    );

    db.subscribeEntityQuery(
        {
            world: {
                player: {
                    $: {
                        where: {
                            name: { $is: "Alice" },
                            score: { $is: 10 },
                        },
                    },
                },
            },
        },
        (resp) => {
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
        }
    );
    // Example usage of getEntities with where clause
    try {
        const entities = await db.getEntities(
            {
                world: {
                    item: {
                        $: {
                            where: {
                                type: { $eq: "sword" },
                                durability: { $lt: 5 },
                            },
                        },
                    },
                    game: {
                        $: {
                            where: {
                                status: { $eq: "completed" },
                            },
                        },
                    },
                },
            },
            (resp) => {
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
            }
        );
        console.log("Queried entities:", entities);
    } catch (error) {
        console.error("Error querying entities:", error);
    }
}

// Call the example usage function
exampleUsage().catch(console.error);
