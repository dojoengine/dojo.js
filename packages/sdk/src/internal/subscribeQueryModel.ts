import type { Entity } from "@dojoengine/torii-wasm/types";
import { parseEntities } from "./parseEntities";
import type {
    SchemaType,
    StandardizedQueryResult,
    SubscriptionCallback,
} from "./types";

/**
 * Creates a callback function for entity subscription that processes entity data and invokes the provided callback.
 * This function is used to standardize entity data handling in subscription callbacks.
 *
 * @template T - The schema type that defines the structure of the entity data
 * @param {SubscriptionCallback<StandardizedQueryResult<T>>} callback - The callback function to be invoked with parsed entity data or error
 * @returns {Function} A function that accepts a hashed key and entity data, parses the entity data, and invokes the provided callback
 */
export function subscribeQueryModelCallback<T extends SchemaType>(
    callback: SubscriptionCallback<StandardizedQueryResult<T>>
) {
    return (entityData: Entity) => {
        try {
            if (callback) {
                const parsedData = parseEntities<T>([entityData]);

                callback({
                    data: parsedData,
                    error: undefined,
                });
            }
        } catch (error) {
            if (callback) {
                callback({
                    data: undefined,
                    error:
                        error instanceof Error
                            ? error
                            : new Error(String(error)),
                });
            }
        }
    };
}
