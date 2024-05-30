import { Client } from "@dojoengine/torii-client";
import { createStore } from "zustand/vanilla";

export const store = createStore<Record<string, object>>(() => ({}));

export const findAndSyncEntities = async <
    T extends {
        torii: Client;
        findEntities: () => Promise<Record<string, any>>;
    },
>(
    input: Promise<T>,
    callback?: (
        entity: T extends { findEntities: () => Promise<infer R> } ? R : any
    ) => void
): Promise<T extends { findEntities: () => Promise<infer R> } ? R : any> => {
    const awaitedInput = await input;

    const result = (await awaitedInput.findEntities()) as T extends {
        findEntities: () => Promise<infer R>;
    }
        ? R
        : any;

    store.setState({ ...result });

    const idsToWatch = Object.keys(result);

    awaitedInput.torii.onEntityUpdated(
        idsToWatch,
        (
            entities: T extends { findEntities: () => Promise<infer R> }
                ? R
                : any
        ) => {
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
    input: Promise<T>,
    callback?: (
        entity: T extends { findEntities: () => Promise<infer R> }
            ? R[keyof R]
            : any
    ) => void
): Promise<
    T extends { findEntities: () => Promise<infer R> } ? R[keyof R] : any
> => {
    const awaitedInput = await input;

    const result = await awaitedInput.findEntities();

    const [firstKey, firstEntity] = Object.entries(result)[0] as [string, any];

    store.setState({ [firstKey]: firstEntity });

    awaitedInput.torii.onEntityUpdated(
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
