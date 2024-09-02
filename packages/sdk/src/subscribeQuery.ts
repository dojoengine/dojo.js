import * as torii from "@dojoengine/torii-client";
import { convertQueryToClauses } from "./convertQueryToClauses";
import { SchemaType } from "./types";

export async function subscribeQuery<T extends SchemaType, K extends keyof T>(
    client: torii.ToriiClient,
    query: { [P in K]?: Partial<T[P]> },
    callback: (response: {
        entities?: torii.Entities;
        data: torii.Entities;
        error?: Error;
    }) => void
): Promise<torii.Subscription> {
    const clauses = convertQueryToClauses(query);
    return client.onEntityUpdated(
        clauses,
        (entities: torii.Entities, data: torii.Entities) => {
            callback({ entities, data });
        }
    );
}
