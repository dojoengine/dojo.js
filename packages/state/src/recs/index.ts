import {
    Component,
    ComponentValue,
    Entity,
    Metadata,
    Schema,
    setComponent,
} from "@dojoengine/recs";
import { Client } from "@dojoengine/torii-client";
import { convertValues } from "../utils";

/**
 * Fetches and synchronizes entities with their components.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param entities - An array of entities to synchronize.
 * @param limit - The maximum number of entities to fetch per request (default: 100).
 * @returns A promise that resolves when synchronization is complete.
 */
export const getSyncEntities = async <S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[],
    entities: any[],
    limit: number = 100
) => {
    await getEntities(client, components, limit);
    return await syncEntities(client, components, entities);
};

/**
 * Fetches all entities and their components from the client.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param limit - The maximum number of entities to fetch per request (default: 100).
 */
export const getEntities = async <S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[],
    limit: number = 100
) => {
    let cursor = 0;
    let continueFetching = true;

    while (continueFetching) {
        const entities = await client.getAllEntities(limit, cursor);

        setEntities(entities, components);

        if (Object.keys(entities).length < limit) {
            continueFetching = false;
        } else {
            cursor += limit;
        }
    }
};

/**
 * Sets up a subscription to sync entity updates.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param entities - An array of entities to watch for updates.
 * @returns A promise that resolves with the subscription handler.
 */
export const syncEntities = async <S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[],
    entities: any[]
) => {
    return await client.onEntityUpdated(entities, (entities: any) => {
        setEntities(entities, components);
    });
};

/**
 * Updates the components of entities in the local state.
 * @param entities - An array of entities with their updated component data.
 * @param components - An array of component definitions.
 */
export const setEntities = async <S extends Schema>(
    entities: any[],
    components: Component<S, Metadata, undefined>[]
) => {
    for (let key in entities) {
        if (entities.hasOwnProperty(key)) {
            for (let componentName in entities[key]) {
                if (entities[key].hasOwnProperty(componentName)) {
                    let recsComponent = components[componentName as any];

                    if (recsComponent) {
                        setComponent(
                            recsComponent,
                            key as Entity,
                            convertValues(
                                recsComponent.schema,
                                entities[key][componentName]
                            ) as ComponentValue
                        );
                    }
                }
            }
        }
    }
};
