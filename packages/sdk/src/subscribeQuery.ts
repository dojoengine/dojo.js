import * as torii from "@dojoengine/torii-client";
import { convertQueryToEntityKeyClauses } from "./convertQueryToEntityKeyClauses";
import { SubscriptionQueryType, QueryResult, SchemaType } from "./types";
import { parseEntities } from "./parseEntities";

export async function subscribeQuery<T extends SchemaType>(
    client: torii.ToriiClient,
    query?: SubscriptionQueryType<T>,
    callback?: (response: { data?: QueryResult<T>; error?: Error }) => void,
    options?: { logging?: boolean }
): Promise<torii.Subscription> {
    return client.onEntityUpdated(
        convertQueryToEntityKeyClauses(query),
        (_entities: string, data: torii.Entities) => {
            try {
                if (callback) {
                    const parsedData = parseEntities<T>(data, query);
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
