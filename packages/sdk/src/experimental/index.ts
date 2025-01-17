import * as torii from "@dojoengine/torii-client";
import { SchemaType, SDKConfig } from "../types";
import { parseEntities } from "../parseEntities";
import { parseHistoricalEvents } from "../parseHistoricalEvents";
import { intoEntityKeysClause } from "./convertClauseToEntityKeysClause";

export async function init<T extends SchemaType>(options: SDKConfig) {
    const client = await torii.createClient(options.client);

    return {
        getEntities: async (query: torii.Query) => {
            return parseEntities(await client.getEntities(query));
        },
        getEvents: async (query: torii.Query, historical: boolean = false) => {
            const events = await client.getEventMessages(query, historical);
            return historical
                ? parseHistoricalEvents(events)
                : parseEntities(events);
        },
        subscribeEntities: async (query: torii.Query, callback: Function) => {
            if (
                query.dont_include_hashed_keys &&
                query.clause &&
                !Object.hasOwn(query.clause, "Keys")
            ) {
                throw new Error(
                    "For subscription, you need to include entity ids"
                );
            }
            const entities = parseEntities<T>(await client.getEntities(query));
            return [
                entities,
                client.onEntityUpdated(
                    intoEntityKeysClause<T>(query.clause, entities),
                    callback
                ),
            ];
        },
        subscribeEvents: async (
            query: torii.Query,
            callback: Function,
            historical: boolean = false
        ) => {
            if (
                query.dont_include_hashed_keys &&
                query.clause &&
                !Object.hasOwn(query.clause, "Keys")
            ) {
                throw new Error(
                    "For subscription, you need to include entity ids"
                );
            }
            const events = parseEntities<T>(await client.getEntities(query));
            return [
                events,
                client.onEventMessageUpdated(
                    intoEntityKeysClause<T>(query.clause, events),
                    historical,
                    callback
                ),
            ];
        },
    };
}
