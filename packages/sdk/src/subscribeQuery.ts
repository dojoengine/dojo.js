import * as torii from "@dojoengine/torii-client";
import { convertQueryToClauses } from "./convertQueryToClauses";
import { SchemaType } from "./types";
import { parseEntities } from "./parseEntities";

export async function subscribeQuery<T extends SchemaType, K extends keyof T>(
    client: torii.ToriiClient,
    query: { [P in K]?: Partial<T[P]> },
    callback: (response: { data?: { [P in K]: T[P][] }; error?: Error }) => void
): Promise<torii.Subscription> {
    return client.onEntityUpdated(
        convertQueryToClauses(query),
        (_entities: string, data: torii.Entities) => {
            try {
                callback({ data: parseEntities<T, K>(data, query) });
            } catch (error) {
                callback({
                    error:
                        error instanceof Error
                            ? error
                            : new Error(String(error)),
                });
            }
        }
    );
}
