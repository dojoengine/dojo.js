import { Client } from "@dojoengine/torii-client";
import { createStore } from "zustand/vanilla";

export const store = createStore<Record<string, object>>(() => ({}));

export const findAndSyncEntities = async <
    T extends {
        torii: Client;
        findEntities: () => Promise<Awaited<ReturnType<T["findEntities"]>>>;
    },
>(
    data: Promise<T>,
    callback?: (entity: Awaited<ReturnType<T["findEntities"]>>) => void
): Promise<ReturnType<T["findEntities"]>> => {
    const dataStuff = await data;

    const result = await dataStuff.findEntities();

    store.setState({ ...result });

    const idsToWatch = Object.keys(result);

    dataStuff.torii.onEntityUpdated(
        idsToWatch,
        (entity: Awaited<ReturnType<T["findEntities"]>>) => {
            store.setState({ ...entity });
            callback?.(entity);
        }
    );

    return result;
};
