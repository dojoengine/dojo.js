import * as torii from "@dojoengine/torii-client";

import { convertQueryToEntityKeyClauses } from "./convertQueryToEntityKeyClauses";
import { parseEntities } from "./parseEntities";
import { SchemaType, StandardizedQueryResult, SubscribeParams } from "./types";
import { parseHistoricalEvents } from "./parseHistoricalEvents";

/**
 * Subscribes to event messages based on the provided query and invokes the callback with the updated data.
 *
 * @template T - The schema type.
 * @param {torii.ToriiClient} client - The Torii client instance.
 * @param {SubscriptionQueryType<T>} query - The subscription query to filter the events.
 * @param {T} schema - The schema type for the entities.
 * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} [callback] - The callback function to handle the response.
 * @param {{ logging?: boolean }} [options] - Optional settings for the subscription.
 * @returns {Promise<torii.Subscription>} - A promise that resolves to a Torii subscription.
 *
 * @example
 * const subscription = await subscribeEventQuery(client, query, schema, (response) => {
 *     if (response.error) {
 *         console.error("Error:", response.error);
 *     } else {
 *         console.log("Data:", response.data);
 *     }
 * }, { logging: true });
 */
export async function subscribeEventQuery<T extends SchemaType>({
    client,
    schema,
    query,
    callback,
    options = { logging: false },
    historical = true,
}: SubscribeParams<T> & {
    client: torii.ToriiClient;
    schema: T;
}): Promise<torii.Subscription> {
    return client.onEventMessageUpdated(
        convertQueryToEntityKeyClauses(query, schema),
        historical,
        (entityId: string, entityData: any) => {
            try {
                if (callback) {
                    const data = { [entityId]: entityData };
                    const parsedData = historical
                        ? parseHistoricalEvents<T>(data, options)
                        : parseEntities<T>(data, options);
                    if (options?.logging) {
                        console.log("Parsed entity data:", parsedData);
                    }
                    callback({ data: parsedData });
                }
            } catch (error) {
                if (callback) {
                    if (options?.logging) {
                        console.error("Error parsing entity data:", error);
                    }
                    callback({
                        error:
                            error instanceof Error
                                ? error
                                : new Error(String(error)),
                    });
                }
            }
        }
    );
}
