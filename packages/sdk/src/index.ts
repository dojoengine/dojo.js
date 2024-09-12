import * as torii from "@dojoengine/torii-client";
import { QueryResult, QueryType, SchemaType } from "./types";
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
        query: QueryType<T>,
        callback: (response: { data?: QueryResult<T>; error?: Error }) => void
    ) => Promise<torii.Subscription>;
    getEntities: (
        query: QueryType<T>,
        callback: (response: { data?: QueryResult<T>; error?: Error }) => void
    ) => Promise<QueryResult<T>>;
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

// async function exampleUsage() {
//     const db = await init<SchemaNamed>({
//         rpcUrl: "your-rpc-url",
//         toriiUrl: "your-torii-url",
//         relayUrl: "your-relay-url",
//         worldAddress: "your-world-address",
//     });

//     // Query all todos and goals
//     db.subscribeQuery(
//         {
//             world: {
//                 todos: {
//                     $: {
//                         where: {
//                             done: { $eq: false },
//                         },
//                     },
//                 },
//                 goals: {},
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
//     db.subscribeQuery(
//         {
//             todos: {
//                 namespace: "todosNamespace",
//                 $: { where: { id: { $eq: "123" } } },
//             },
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

//     // Hashed version of the above query
//     db.subscribeQuery(
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
//     db.subscribeQuery(
//         {
//             todos: {
//                 namespace: "todosNamespace",
//                 $: { where: { done: { $eq: true } } },
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
//                 console.log("Completed todos:", resp.data);
//             }
//         }
//     );

//     // Query todos created after a specific date
//     const specificDate = new Date("2023-01-01").getTime();
//     db.subscribeQuery(
//         {
//             todos: {
//                 namespace: "todosNamespace",
//                 $: { where: { createdAt: { $gt: specificDate } } },
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
//                 console.log("Todos created after Jan 1, 2023:", resp.data);
//             }
//         }
//     );

//     // Query todos with multiple conditions
//     db.subscribeQuery(
//         {
//             todos: {
//                 namespace: "todosNamespace",
//                 $: {
//                     where: {
//                         done: { $eq: false },
//                         createdAt: { $gt: specificDate },
//                     },
//                 },
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
//                     resp.data
//                 );
//             }
//         }
//     );

//     // Example usage of getEntities with where clause
//     try {
//         const entities = await db.getEntities(
//             {
//                 todos: {
//                     namespace: "todosNamespace",
//                     $: {
//                         where: {
//                             done: { $eq: true },
//                             text: { $contains: "important" },
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
//                     console.log("Completed important todos:", resp.data);
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
