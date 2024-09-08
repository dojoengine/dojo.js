import * as torii from "@dojoengine/torii-client";
import { convertQueryToClauses } from "./convertQueryToClauses";
import { SchemaType } from "./types";
import { parseEntities } from "./parseEntities";
import { QueryResult, QueryType } from ".";

export async function subscribeQuery<T extends SchemaType, K extends keyof T>(
    client: torii.ToriiClient,
    query?: QueryType<T, K>,
    callback?: (response: { data?: QueryResult<T, K>; error?: Error }) => void
): Promise<torii.Subscription> {
    return client.onEntityUpdated(
        convertQueryToClauses(query),
        (_entities: string, data: torii.Entities) => {
            try {
                if (callback) {
                    callback({ data: parseEntities<T, K>(data, query) });
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
    );
}
