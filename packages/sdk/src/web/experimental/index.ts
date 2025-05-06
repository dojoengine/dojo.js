import * as torii from "@dojoengine/torii-wasm";
import type {
    SchemaType,
    SDKConfig,
    StandardizedQueryResult,
} from "../../internal/types";
import { parseEntities } from "../../internal/parseEntities";
import { defaultClientConfig } from "..";

export type ToriiSubscriptionCallback<T extends SchemaType> = (response: {
    data?: StandardizedQueryResult<T> | StandardizedQueryResult<T>[];
    error?: Error;
}) => void;

// @deprecated for now use import { init } from "@dojoengine/sdk"
export async function init<T extends SchemaType>(options: SDKConfig) {
    const clientConfig = {
        ...defaultClientConfig,
        ...options.client,
    } as torii.ClientConfig;

    const client = new torii.ToriiClient(clientConfig);

    return {
        getEntities: async (query: torii.Query) => {
            return parseEntities((await client.getEntities(query)).items);
        },
        getEvents: async (query: torii.Query) => {
            const events = await client.getEventMessages(query);
            return parseEntities(events.items);
        },
        subscribeEntities: async (
            query: torii.Query,
            callback: ToriiSubscriptionCallback<T>
        ) => {
            const entities = parseEntities<T>(
                (await client.getEntities(query)).items
            );
            return [
                entities,
                client.onEntityUpdated(
                    query.clause,
                    (_: string, entityData: torii.Entity) => {
                        try {
                            if (callback) {
                                const parsedData = parseEntities<T>([
                                    entityData,
                                ]);
                                callback({ data: parsedData });
                            }
                        } catch (error) {
                            if (callback) {
                                callback({
                                    error:
                                        error instanceof Error
                                            ? error
                                            : new Error(String(error)),
                                });
                            }
                        }
                    }
                ),
            ];
        },
        subscribeEvents: async (
            query: torii.Query,
            callback: ToriiSubscriptionCallback<T>
        ) => {
            if (
                query.no_hashed_keys &&
                query.clause &&
                !Object.hasOwn(query.clause, "Keys")
            ) {
                throw new Error(
                    "For subscription, you need to include entity ids"
                );
            }
            const events = parseEntities<T>(
                (await client.getEventMessages(query)).items
            );
            return [
                events,
                client.onEventMessageUpdated(
                    query.clause,
                    (_: string, entityData: any) => {
                        try {
                            if (callback) {
                                const parsedData = parseEntities<T>([
                                    entityData,
                                ]);
                                callback({ data: parsedData });
                            }
                        } catch (error) {
                            if (callback) {
                                callback({
                                    error:
                                        error instanceof Error
                                            ? error
                                            : new Error(String(error)),
                                });
                            }
                        }
                    }
                ),
            ];
        },
    };
}
