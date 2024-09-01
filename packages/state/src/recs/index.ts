import {
    Component,
    ComponentValue,
    Entity,
    Metadata,
    Schema,
    setComponent,
} from "@dojoengine/recs";
import {
    Clause,
    ToriiClient,
    EntityKeysClause,
    PatternMatching,
} from "@dojoengine/torii-client";
import { convertValues } from "../utils";

/**
 * Fetches and synchronizes entities with their components. This is useful for initializing the world state.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param entityKeyClause - An array of entities to synchronize.
 * @param limit - The maximum number of entities to fetch per request (default: 100).
 * @returns A promise that resolves when synchronization is complete.
 *
 * @example
 * // Fetch all entities and their components
 * const components = createClientComponents({ contractComponents });
 * await getSyncEntities(client, components, undefined);
 *
 * @example
 * // Fetch all entities and their components via a query
 * const components = createClientComponents({ contractComponents });
 * await getSyncEntities(client, components, entityKeyClause);
 *
 * This function fetches all entities and their components from the client, then
 * synchronizes the entities with the specified components. It uses the provided
 * EntityKeysClause (if any) to filter entities and the specified components to
 * determine which data to retrieve. The function continues fetching until all
 * matching entities have been retrieved, using the 'limit' parameter to control
 * the batch size of each request.
 */
export const getSyncEntities = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause[],
    limit: number = 100
) => {
    await getEntities(client, components, limit);
    return await syncEntities(client, components, entityKeyClause);
};

/**
 * Fetches and synchronizes events with their models. This is useful for initializing the world state with event data.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param clause - An optional clause to filter events.
 * @param entityKeyClause - An array of entities to synchronize.
 * @param limit - The maximum number of events to fetch per request (default: 100).
 * @returns A promise that resolves when synchronization is complete.
 *
 * @example
 * // Fetch all events and their components
 * const components = createClientComponents({ contractComponents });
 * await getSyncEvents(client, components, undefined, entityKeyClause);
 *
 * @example
 * // Fetch all events and their components via a query
 * const components = createClientComponents({ contractComponents });
 * await getSyncEvents(client, components, clause, entityKeyClause);
 *
 * This function fetches all events and their components from the client, then
 * synchronizes the events with the specified components. It uses the provided
 * Clause (if any) to filter events and the specified components to determine
 * which data to retrieve. The function continues fetching until all matching
 * events have been retrieved, using the 'limit' parameter to control the batch
 * size of each request.
 */
export const getSyncEvents = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    clause: Clause | undefined,
    entityKeyClause: EntityKeysClause[],
    limit: number = 100
) => {
    // Fetch events from the client
    await getEvents(client, components, limit, clause);
    // Synchronize the fetched events with the specified components
    return await syncEvents(client, components, entityKeyClause);
};

/**
 * Fetches all entities and their components from the client.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param limit - The maximum number of entities to fetch per request (default: 100).
 *
 * @example
 * const components = createClientComponents({ contractComponents });
 * await getEntities(client, components, 100);
 *
 * This function performs paginated queries to fetch all entities and their components.
 */
export const getEntities = async <S extends Schema>(
    client: ToriiClient,
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
 * Fetches event messages from the client and synchronizes them with the specified components.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param limit - The maximum number of event messages to fetch per request (default: 100).
 * @param clause - An optional clause to filter event messages.
 */
export const getEvents = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    limit: number = 100,
    clause: Clause | undefined
) => {
    let offset = 0; // Initialize the offset for pagination
    let continueFetching = true; // Flag to control the fetching loop

    while (continueFetching) {
        // Fetch event messages from the client with the specified limit and offset
        const entities = await client.getEventMessages({
            limit,
            offset,
            clause,
        });

        console.log("entities", entities); // Log the fetched entities for debugging

        // Synchronize the fetched entities with the specified components
        setEntities(entities, components);

        // Check if the number of fetched entities is less than the limit
        if (Object.keys(entities).length < limit) {
            continueFetching = false; // Stop fetching if fewer entities are returned
        } else {
            offset += limit; // Increment the offset for the next batch
        }
    }
};

/**
 * Fetches entities and their components from the client based on specified criteria, helping to reduce the loading time when the entities are fetched.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions to fetch.
 * @param entityKeyClause - An optional EntityKeysClause to filter entities by their keys.
 * @param patternMatching - The pattern matching strategy for entity keys (default: "FixedLen").
 * @param limit - The maximum number of entities to fetch per request (default: 1000).
 *
 * @example
 * const components = createClientComponents({ contractComponents });
 * await getEntitiesQuery(client, components, undefined, "FixedLen", 1000);
 * return await syncEntities(toriiClient, components as any, []);
 *
 * @example
 * const components = createClientComponents({ contractComponents });
 * await getEntitiesQuery(client, components, { Keys: { keys: ["0x1"], models: ["Position"] } }, "FixedLen", 1000);
 * return await syncEntities(toriiClient, components as any, []);
 *
 * @example
 * const components = createClientComponents({ contractComponents });
 * await getEntitiesQuery(client, components, { HashedKeys: ["0x1"] }, "FixedLen", 1000);
 * return await syncEntities(toriiClient, components as any, []);
 *
 * This function performs paginated queries to fetch all matching entities and their
 * components. It uses the provided EntityKeysClause (if any) to filter entities and
 * the specified components to determine which data to retrieve. The function continues
 * fetching until all matching entities have been retrieved, using the 'limit' parameter
 * to control the batch size of each request.
 *
 * Note: Make sure to synchronize the entities by calling the syncEntities method
 */
export const getEntitiesQuery = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause,
    patternMatching: PatternMatching = "FixedLen",
    limit: number = 1000
) => {
    let cursor = 0;
    let continueFetching = true;

    const componentArray = Object.values(components);

    const clause: Clause | null = entityKeyClause
        ? {
              Keys: {
                  keys:
                      "HashedKeys" in entityKeyClause
                          ? entityKeyClause.HashedKeys
                          : entityKeyClause.Keys.keys,
                  pattern_matching: patternMatching,
                  models: [
                      ...componentArray.map((c) => c.metadata?.name as string),
                  ],
              },
          }
        : null;

    const fetchedEntities = await client.getEntities({
        limit,
        offset: cursor,
        clause: clause || undefined,
    });

    while (continueFetching) {
        setEntities(fetchedEntities, components);

        if (Object.keys(fetchedEntities).length < limit) {
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
 * @param entityKeyClause - An optional EntityKeysClause to filter entities.
 * @returns A promise that resolves with the subscription handler.
 * The handler can be used to cancel the subscription when needed.
 * @example
 * const sync = await getSyncEntities(client, components, entityKeyClause);
 * // later...
 * sync.cancel(); // cancel the subscription
 */
export const syncEntities = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause[]
) => {
    return await client.onEntityUpdated(
        entityKeyClause,
        (fetchedEntities: any, data: any) => {
            setEntities({ [fetchedEntities]: data }, components);
        }
    );
};

/**
 * Sets up a subscription to sync event messages.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param entityKeyClause - An optional EntityKeysClause to filter entities.
 * @returns A promise that resolves with the subscription handler.
 * The handler can be used to cancel the subscription when needed.
 * @example
 * const sync = await syncEvents(client, components, entityKeyClause);
 * // later...
 * sync.cancel(); // cancel the subscription
 */
export const syncEvents = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause[]
) => {
    return await client.onEventMessageUpdated(
        entityKeyClause,
        (fetchedEntities: any, data: any) => {
            // Log the fetched entities and data for debugging purposes
            console.log("fetchedEntities", data);
            // Update the local state with the fetched entities and their data
            setEntities({ [fetchedEntities]: data }, components);
        }
    );
};

/**
 * Updates the components of entities in the local state.
 * @param entities - An array of entities with their updated component data.
 * @param components - An array of component definitions.
 */
export const setEntities = async <S extends Schema>(
    entities: any,
    components: Component<S, Metadata, undefined>[]
) => {
    for (let key in entities) {
        if (!Object.hasOwn(entities, key)) {
            continue;
        }

        for (let componentName in entities[key]) {
            if (!Object.hasOwn(entities[key], componentName)) {
                continue;
            }
            let recsComponent = Object.values(components).find(
                (component) =>
                    component.metadata?.namespace +
                        "-" +
                        component.metadata?.name ===
                    componentName
            );

            if (recsComponent) {
                try {
                    setComponent(
                        recsComponent,
                        key as Entity,
                        convertValues(
                            recsComponent.schema,
                            entities[key][componentName]
                        ) as ComponentValue
                    );
                } catch (error) {
                    console.warn(
                        `Failed to set component ${recsComponent.metadata?.name} on ${key}`,
                        error
                    );
                }
            }
        }
    }
};
