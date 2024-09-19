import * as torii from "@dojoengine/torii-client";
import { SchemaType, SDK } from "./types";
import { subscribeEntityQuery } from "./subscribeEntityQuery";
import { getEntities } from "./getEntities";
import { subscribeEventQuery } from "./subscribeEventQuery";
import { getEventMessages } from "./getEventMessages";

export * from "./types";

export async function createClient(
    config: torii.ClientConfig
): Promise<torii.ToriiClient> {
    return await torii.createClient(config);
}

export async function init<T extends SchemaType>(
    options: torii.ClientConfig,
    schema: T
): Promise<SDK<T>> {
    const client = await createClient(options);

    return {
        client,
        subscribeEntityQuery: (query, callback, options) =>
            subscribeEntityQuery(client, query, schema, callback, options),
        subscribeEventQuery: (query, callback, options) =>
            subscribeEventQuery(client, query, schema, callback, options),
        getEntities: (query, callback, limit, offset, options) =>
            getEntities(
                client,
                query,
                schema,
                callback,
                limit,
                offset,
                options
            ),
        getEventMessages: (query, callback, limit, offset, options) =>
            getEventMessages(client, query, callback, limit, offset, options),
    };
}
