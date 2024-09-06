import * as torii from "@dojoengine/torii-client";
import { SchemaType } from "./types";
import { subscribeQuery } from "./subscribeQuery";
import { getEntities } from "./getEntities";

async function createClient(
    config: torii.ClientConfig
): Promise<torii.ToriiClient> {
    return await torii.createClient(config);
}

export type QueryOptions = {
    where?: Record<string, any>;
    limit?: number;
    offset?: number;
};

export type QueryType<T extends SchemaType, K extends keyof T = keyof T> = {
    entityIds?: string[];
} & {
    [P in K]?: {
        $?: QueryOptions;
    } & Partial<T[P]> & {
            [SubKey in keyof T[P]]?: QueryType<T, SubKey & keyof T>;
        };
};

export type QueryResult<T extends SchemaType, K extends keyof T> = {
    [P in K]: (T[P] & {
        [SubKey in keyof QueryType<T, P>]: SubKey extends "$"
            ? never
            : QueryResult<T, SubKey & keyof T>;
    })[];
};

export async function init<T extends SchemaType>(
    options: torii.ClientConfig
): Promise<{
    client: torii.ToriiClient;
    subscribeQuery: <K extends keyof T>(
        query: QueryType<T, K>,
        callback: (response: {
            data?: QueryResult<T, K>;
            error?: Error;
        }) => void
    ) => Promise<torii.Subscription>;
    getEntities: <K extends keyof T>(
        query: QueryType<T, K>,
        callback: (response: {
            data?: QueryResult<T, K>;
            error?: Error;
        }) => void
    ) => Promise<QueryResult<T, K>>;
}> {
    const client = await createClient(options);

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

async function exampleUsage() {
    const db = await init<Schema>({
        rpcUrl: "your-rpc-url",
        toriiUrl: "your-torii-url",
        relayUrl: "your-relay-url",
        worldAddress: "your-world-address",
    });

    // Query all todos and goals
    db.subscribeQuery({ todos: {}, goals: {} }, (resp) => {
        if (resp.error) {
            console.error(
                "Error querying todos and goals:",
                resp.error.message
            );
            return;
        }
        if (resp.data) {
            console.log("All todos and goals:", resp.data);
        }
    });

    // Query todos with a specific id using where clause
    db.subscribeQuery(
        {
            todos: {
                $: { where: { id: { $eq: "123" } } },
            },
        },
        (resp) => {
            if (resp.error) {
                console.error("Error querying todo:", resp.error.message);
                return;
            }
            if (resp.data) {
                console.log("Todo with id 123:", resp.data);
            }
        }
    );

    // Hashed version of the above query
    db.subscribeQuery(
        {
            entityIds: ["123"],
        },
        (resp) => {
            if (resp.error) {
                console.error("Error querying todo:", resp.error.message);
                return;
            }
            if (resp.data) {
                console.log("Todo with id 123:", resp.data);
            }
        }
    );

    // Query completed todos using where clause
    db.subscribeQuery(
        {
            todos: {
                $: { where: { done: { $eq: true } } },
            },
        },
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

    // Query todos created after a specific date
    const specificDate = new Date("2023-01-01").getTime();
    db.subscribeQuery(
        {
            todos: {
                $: { where: { createdAt: { $gt: specificDate } } },
            },
        },
        (resp) => {
            if (resp.error) {
                console.error(
                    "Error querying todos by date:",
                    resp.error.message
                );
                return;
            }
            if (resp.data) {
                console.log("Todos created after Jan 1, 2023:", resp.data);
            }
        }
    );

    // Query todos with multiple conditions
    db.subscribeQuery(
        {
            todos: {
                $: {
                    where: {
                        done: { $eq: false },
                        createdAt: { $gt: specificDate },
                    },
                },
            },
        },
        (resp) => {
            if (resp.error) {
                console.error(
                    "Error querying todos with multiple conditions:",
                    resp.error.message
                );
                return;
            }
            if (resp.data) {
                console.log(
                    "Uncompleted todos created after Jan 1, 2023:",
                    resp.data
                );
            }
        }
    );

    // Example usage of getEntities with where clause
    try {
        const entities = await db.getEntities(
            {
                todos: {
                    $: {
                        where: {
                            done: { $eq: true },
                            text: { $contains: "important" },
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
                    console.log("Completed important todos:", resp.data);
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
