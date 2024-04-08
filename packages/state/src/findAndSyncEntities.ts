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
        (entities: Awaited<ReturnType<T["findEntities"]>>) => {
            store.setState({ ...entities });
            callback?.(entities);
        }
    );

    return result;
};

export const findAndSyncEntity = async <
    T extends {
        torii: Client;
        findEntities: () => Promise<Record<string, any>>;
    },
>(
    data: Promise<T>,
    callback?: (
        entity: T extends { findEntities: () => Promise<infer R> }
            ? R[keyof R]
            : any
    ) => void
): Promise<
    T extends { findEntities: () => Promise<infer R> } ? R[keyof R] : any
> => {
    const dataStuff = await data;

    const result = await dataStuff.findEntities();

    const [firstKey, firstEntity] = Object.entries(result)[0] as [string, any];

    store.setState({ [firstKey]: firstEntity });

    dataStuff.torii.onEntityUpdated(
        [firstKey],
        (entities: Record<string, any>) => {
            const [firstUpdatedKey, firstUpdatedEntity] = Object.entries(
                entities
            )[0] as [string, any];
            store.setState({ [firstUpdatedKey]: firstUpdatedEntity });
            callback?.(firstUpdatedEntity);
        }
    );

    return firstEntity;
};
