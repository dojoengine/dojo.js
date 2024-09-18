import * as torii from "@dojoengine/torii-client";
import { SchemaType, SDK } from "./types";
import { subscribeEntityQuery } from "./subscribeEntityQuery";
import { getEntities } from "./getEntities";

export * from "./types";

import { subscribeEventQuery } from "./subscribeEventQuery";
import { getEventMessages } from "./getEventMessages";

async function createClient(
    config: torii.ClientConfig
): Promise<torii.ToriiClient> {
    return await torii.createClient(config);
}

export async function init<T extends SchemaType>(
    options: torii.ClientConfig
): Promise<SDK<T>> {
    const client = await createClient(options);

    return {
        client,
        subscribeEntityQuery: (query, callback) =>
            subscribeEntityQuery(client, query, callback),
        subscribeEventQuery: (query, callback) =>
            subscribeEventQuery(client, query, callback),
        getEntities: (query, callback) => getEntities(client, query, callback),
        getEventMessages: (query, callback) =>
            getEventMessages(client, query, callback),
    };
}
// // EXAMPLE FOR NOW

// interface Todo {
//     id: string;
//     text: string;
//     done: boolean;
//     createdAt: number;
// }

// interface Goals {
//     id: string;
//     text: string;
//     done: boolean;
//     createdAt: number;
// }

// type Schema = {
//     todos: Todo;
//     goals: Goals;
// };

// type SchemaNamed = {
//     world: Schema;
// };

// // TOOD: You can't import the json. It has to be a const. Maybe we generate this a build time.
// const contractDefinitions = [
//     {
//         kind: "DojoContract",
//         address:
//             "0x25d128c5fe89696e7e15390ea58927bbed4290ae46b538b28cfc7c2190e378b",
//         abi: [
//             {
//                 type: "function",
//                 name: "spawn",
//                 inputs: [],
//                 outputs: [],
//                 state_mutability: "external",
//             },
//             {
//                 type: "function",
//                 name: "move",
//                 inputs: [
//                     {
//                         name: "direction",
//                         type: "dojo_starter::models::Direction",
//                     },
//                 ],
//                 outputs: [],
//                 state_mutability: "external",
//             },
//         ],
//         systems: ["spawn", "move"],
//         tag: "actions",
//     },
// ] as const;

// async function exampleUsage() {
//     // const account: AccountInterface = {} as any; // Replace with actual account

//     const db = await init<SchemaNamed>(
//         {
//             rpcUrl: "your-rpc-url",
//             toriiUrl: "your-torii-url",
//             relayUrl: "your-relay-url",
//             worldAddress: "your-world-address",
//         }
//         // contractDefinitions,
//         // account
//     );

//     // await db.worldProxy.actions.spawn({});
//     // await db.worldProxy.actions.move({ direction: "Left" });

//     db.subscribeEntityQuery(
//         {
//             world: {
//                 todos: true,
//                 goals: true,
//             },
//         },
//         (resp) => {
//             if (resp.error) {
//                 console.error(
//                     "Error querying todos and goals:",
//                     resp.error.message
//                 );
//                 return;
//             }
//             if (resp.data) {
//                 console.log("All todos and goals:", resp.data.world.goals);
//             }
//         }
//     );

//     // Query todos with a specific id using where clause
//     db.subscribeEntityQuery(
//         {
//             world: {
//                 todos: true,
//                 goals: true,
//             },
//         },
//         (resp) => {
//             if (resp.error) {
//                 console.error("Error querying todo:", resp.error.message);
//                 return;
//             }
//             if (resp.data) {
//                 console.log("Todo with id 123:", resp.data.world.todos);
//             }
//         }
//     );

//     // Hashed version of the above query
//     db.subscribeEntityQuery(
//         {
//             entityIds: ["123"],
//         },
//         (resp) => {
//             if (resp.error) {
//                 console.error("Error querying todo:", resp.error.message);
//                 return;
//             }
//             if (resp.data) {
//                 console.log("Todo with id 123:", resp.data);
//             }
//         }
//     );

//     // Query completed todos using where clause
//     db.subscribeEntityQuery(
//         {
//             world: {
//                 todos: true,
//                 goals: true,
//             },
//         },
//         (resp) => {
//             if (resp.error) {
//                 console.error(
//                     "Error querying completed todos:",
//                     resp.error.message
//                 );
//                 return;
//             }
//             if (resp.data) {
//                 console.log("Completed todos:", resp.data.world.todos);
//             }
//         }
//     );

//     // Query todos created after a specific date
//     const specificDate = new Date("2023-01-01").getTime();
//     db.subscribeEntityQuery(
//         {
//             world: {
//                 todos: true,
//             },
//         },
//         (resp) => {
//             if (resp.error) {
//                 console.error(
//                     "Error querying todos by date:",
//                     resp.error.message
//                 );
//                 return;
//             }
//             if (resp.data) {
//                 console.log(
//                     "Todos created after Jan 1, 2023:",
//                     resp.data.world.todos
//                 );
//             }
//         }
//     );

//     // Query todos with multiple conditions
//     db.subscribeEntityQuery(
//         {
//             world: {
//                 todos: true,
//                 goals: true,
//             },
//         },
//         (resp) => {
//             if (resp.error) {
//                 console.error(
//                     "Error querying todos with multiple conditions:",
//                     resp.error.message
//                 );
//                 return;
//             }
//             if (resp.data) {
//                 console.log(
//                     "Uncompleted todos created after Jan 1, 2023:",
//                     resp.data.world.todos
//                 );
//             }
//         }
//     );

//     // Example usage of getEntities with where clause
//     try {
//         const entities = await db.getEntities(
//             {
//                 world: {
//                     todos: {
//                         $: {
//                             where: {
//                                 done: { $eq: true },
//                             },
//                         },
//                     },
//                     goals: {
//                         $: {
//                             where: {
//                                 done: { $eq: true },
//                             },
//                         },
//                     },
//                 },
//             },
//             (resp) => {
//                 if (resp.error) {
//                     console.error(
//                         "Error querying completed important todos:",
//                         resp.error.message
//                     );
//                     return;
//                 }
//                 if (resp.data) {
//                     console.log(
//                         "Completed important todos:",
//                         resp.data.map((a) => a.models)
//                     );
//                 }
//             }
//         );
//         console.log("Queried entities:", entities);
//     } catch (error) {
//         console.error("Error querying entities:", error);
//     }
// }

// // Call the example usage function
// exampleUsage().catch(console.error);
