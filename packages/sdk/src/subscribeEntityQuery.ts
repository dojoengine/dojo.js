import * as torii from "@dojoengine/torii-client";

import { convertQueryToEntityKeyClauses } from "./convertQueryToEntityKeyClauses";
import { parseEntities } from "./parseEntities";
import {
    SchemaType,
    StandardizedQueryResult,
    SubscriptionQueryType,
} from "./types";

/**
 * Subscribes to entity updates based on the provided query and invokes the callback with the updated data.
 *
 * @template T - The schema type.
 * @param {torii.ToriiClient} client - The Torii client instance.
 * @param {SubscriptionQueryType<T>} query - The subscription query to filter the entities.
 * @param {T} schema - The schema type for the entities.
 * @param {(response: { data?: StandardizedQueryResult<T>; error?: Error }) => void} [callback] - The callback function to handle the response.
 * @param {{ logging?: boolean }} [options] - Optional settings for the subscription.
 * @returns {Promise<torii.Subscription>} - A promise that resolves to a Torii subscription.
 *
 * @example
 * const subscription = await subscribeEntityQuery(client, query, schema, (response) => {
 *     if (response.error) {
 *         console.error("Error:", response.error);
 *     } else {
 *         console.log("Data:", response.data);
 *     }
 * }, { logging: true });
 */
export async function subscribeEntityQuery<T extends SchemaType>(
    client: torii.ToriiClient,
    query: SubscriptionQueryType<T>,
    schema: T,
    callback?: (response: {
        data?: StandardizedQueryResult<T>;
        error?: Error;
    }) => void,
    options?: { logging?: boolean }
): Promise<torii.Subscription> {
    if (options?.logging) {
        console.log("Query:", query);
        console.log(
            "convertQueryToEntityKeyClauses:",
            convertQueryToEntityKeyClauses(query, schema)
        );
    }
    return client.onEntityUpdated(
        convertQueryToEntityKeyClauses(query, schema),
        (entityId: string, entityData: any) => {
            try {
                if (callback) {
                    const parsedData = parseEntities<T>({
                        [entityId]: entityData,
                    });
                    if (options?.logging) {
                        console.log(
                            "Converted query to entity key clauses:",
                            convertQueryToEntityKeyClauses(query, schema)
                        );
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
