import * as torii from "@dojoengine/torii-client";
import { SchemaType, SDK } from "./types";
import { subscribeEntityQuery } from "./subscribeEntityQuery";
import { getEntities } from "./getEntities";
import { subscribeEventQuery } from "./subscribeEventQuery";
import { getEventMessages } from "./getEventMessages";

export async function createClient(
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
        getEntities: (query, callback, limit, offset, options) =>
            getEntities(client, query, callback, limit, offset, options),
        getEventMessages: (query, callback, limit, offset, options) =>
            getEventMessages(client, query, callback, limit, offset, options),
    };
}
