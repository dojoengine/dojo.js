import * as torii from "@dojoengine/torii-client";
import { SchemaType } from "./types";
import { subscribeQuery } from "./subscribeQuery";
import { getEntities } from "./getEntities";

async function createClient(
    config: torii.ClientConfig
): Promise<torii.ToriiClient> {
    return await torii.createClient(config);
}

export async function init<T extends SchemaType>(
    options: torii.ClientConfig
): Promise<{
    client: torii.ToriiClient;
    subscribeQuery: (
        query: { [P in keyof T]?: Partial<T[P]> },
        callback: (response: { data?: torii.Entities; error?: Error }) => void
    ) => Promise<torii.Subscription>;
    getEntities: (
        query: {
            [P in keyof T]?: Partial<T[P]>;
        },
        callback: (response: { data?: torii.Entities; error?: Error }) => void
    ) => Promise<torii.Entities>;
}> {
    const config: torii.ClientConfig = {
        rpcUrl: options.rpcUrl,
        toriiUrl: options.toriiUrl,
        relayUrl: options.relayUrl,
        worldAddress: options.worldAddress,
    };

    const client = await createClient(config);

    return {
        client,
        subscribeQuery: (query, callback) =>
            subscribeQuery(client, query, callback),
        getEntities: (query, callback) => getEntities(client, query, callback),
    };
}

// EXAMPLE FOR NOW

interface Todo {
    id: string;
    text: string;
    done: boolean;
    createdAt: number;
}

type Schema = {
    todos: Todo;
};

async function exampleUsage() {
    const db = await init<Schema>({
        rpcUrl: "your-rpc-url",
        toriiUrl: "your-torii-url",
        relayUrl: "your-relay-url",
        worldAddress: "your-world-address",
    });

    // Query all todos
    db.subscribeQuery({ todos: {} }, (resp) => {
        if (resp.error) {
            console.error("Error querying todos:", resp.error.message);
            return;
        }
        if (resp.data) {
            console.log("All todos:", resp.data);
        }
    });

    // Query specific todo by id
    db.subscribeQuery({ todos: { id: "123" } }, (resp) => {
        if (resp.error) {
            console.error("Error querying todo:", resp.error.message);
            return;
        }
        if (resp.data) {
            console.log("Todo with id 123:", resp.data);
        }
    });

    // Query completed todos
    db.subscribeQuery({ todos: { done: true } }, (resp) => {
        if (resp.error) {
            console.error(
                "Error querying completed todos:",
                resp.error.message
            );
            return;
        }
        if (resp.data) {
            console.log("Completed todos:", resp.data);
        }
    });

    // Example usage of getEntities
    try {
        const entities = await db.getEntities(
            { todos: { done: true } },
            (resp) => {
                if (resp.error) {
                    console.error(
                        "Error querying completed todos:",
                        resp.error.message
                    );
                    return;
                }
                if (resp.data) {
                    console.log("Completed todos:", resp.data);
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
