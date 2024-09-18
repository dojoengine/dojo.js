// EXAMPLE FOR NOW

import { init } from "..";

interface Todo {
    id: string;
    text: string;
    done: boolean;
    createdAt: number;
}

interface Goals {
    id: string;
    text: string;
    done: boolean;
    createdAt: number;
}

type Schema = {
    todos: Todo;
    goals: Goals;
};

type SchemaNamed = {
    world: Schema;
};

async function exampleUsage() {
    const db = await init<SchemaNamed>({
        rpcUrl: "your-rpc-url",
        toriiUrl: "your-torii-url",
        relayUrl: "your-relay-url",
        worldAddress: "your-world-address",
    });

    db.subscribeEntityQuery(
        {
            world: {
                todos: [],
                goals: [],
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
                console.log("Queried todos and goals:", resp.data);
            }
        }
    );
    // Example usage of getEntities with where clause
    try {
        const entities = await db.getEntities(
            {
                world: {
                    todos: {
                        $: {
                            where: {
                                done: { $eq: true },
                            },
                        },
                    },
                    goals: {
                        $: {
                            where: {
                                done: { $eq: true },
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
