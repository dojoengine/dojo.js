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
    Entities,
    EntityKeysClause,
    OrderBy,
    PatternMatching,
    ToriiClient,
} from "@dojoengine/torii-client";

import { convertValues } from "../utils";

/**
 * Fetches and synchronizes entities with their components. This is useful for initializing the world state.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param clause - An optional clause to filter entities.
 * @param entityKeyClause - An array of entity key clauses to synchronize.
 * @param limit - The maximum number of entities to fetch per request (default: 100).
 * @param logging - Whether to log debug information (default: true).
 * @returns A promise that resolves to a subscription for entity updates.
 *
 * @example
 * // Fetch all entities and their components
 * const components = createClientComponents({ contractComponents });
 * const subscription = await getSyncEntities(client, components);
 *
 * @example
 * // Fetch filtered entities and their components
 * const components = createClientComponents({ contractComponents });
 * const clause = { ... }; // Define your filter clause
 * const entityKeyClause = [ ... ]; // Define your entity key clauses
 * const subscription = await getSyncEntities(client, components, clause, entityKeyClause);
 *
 * This function fetches entities and their components from the client, then
 * sets up a subscription for entity updates. It uses the provided clause (if any)
 * to filter entities and the specified components to determine which data to retrieve.
 * The function fetches entities in batches, controlled by the 'limit' parameter,
 * and then establishes a real-time subscription for future updates.
 */
export const getSyncEntities = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    clause: Clause | undefined,
    entityKeyClause: EntityKeysClause[],
    orderBy: OrderBy[] = [],
    entityModels: string[] = [],
    limit: number = 100,
    logging: boolean = false
) => {
    if (logging) console.log("Starting getSyncEntities ", clause);
    await getEntities(
        client,
        clause,
        components,
        orderBy,
        entityModels,
        limit,
        logging
    );
    return await syncEntities(client, components, entityKeyClause, logging);
};
/**
 * Fetches and synchronizes events with their components. This is useful for initializing the world state with event data.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param clause - An optional clause to filter events.
 * @param entityKeyClause - An array of entity key clauses to synchronize.
 * @param limit - The maximum number of events to fetch per request (default: 100).
 * @param logging - Whether to log debug information (default: false).
 * @param historical - Whether to fetch and subscribe to historical events (default: false).
 * @param callback - An optional callback function to be called after fetching events.
 * @returns A promise that resolves to a subscription for event updates.
 *
 * @example
 * // Fetch all events and their components
 * const components = createClientComponents({ contractComponents });
 * const subscription = await getSyncEvents(client, components, undefined, entityKeyClause);
 *
 * @example
 * // Fetch filtered events and their components
 * const components = createClientComponents({ contractComponents });
 * const clause = { ... }; // Define your filter clause
 * const entityKeyClause = [ ... ]; // Define your entity key clauses
 * const subscription = await getSyncEvents(client, components, clause, entityKeyClause);
 *
 * This function fetches events and their components from the client, then
 * sets up a subscription for event updates. It uses the provided clause (if any)
 * to filter events and the specified components to determine which data to retrieve.
 * The function fetches events in batches, controlled by the 'limit' parameter,
 * and then establishes a real-time subscription for future updates.
 */
export const getSyncEvents = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    clause: Clause | undefined,
    entityKeyClause: EntityKeysClause[],
    orderBy: OrderBy[] = [],
    entityModels: string[] = [],
    limit: number = 100,
    logging: boolean = false,
    historical: boolean = true,
    callback?: () => void
) => {
    if (logging) console.log("Starting getSyncEvents");
    await getEvents(
        client,
        components,
        orderBy,
        entityModels,
        limit,
        clause,
        logging,
        historical,
        callback
    );
    return await syncEvents(client, components, entityKeyClause, logging);
};

/**
 * Fetches all entities and their components from the client.
 * @param client - The client instance for API communication.
 * @param clause - An optional clause to filter entities.
 * @param components - An array of component definitions.
 * @param limit - The maximum number of entities to fetch per request (default: 100).
 * @param logging - Whether to log debug information (default: false).
 *
 * @example
 * const components = createClientComponents({ contractComponents });
 * await getEntities(client, undefined, components, 100);
 *
 * This function performs paginated queries to fetch all entities and their components.
 */
export const getEntities = async <S extends Schema>(
    client: ToriiClient,
    clause: Clause | undefined,
    components: Component<S, Metadata, undefined>[],
    orderBy: OrderBy[] = [],
    entityModels: string[] = [],
    limit: number = 100,
    logging: boolean = false,
    {
        dbConnection,
        timestampCacheKey,
    }: { dbConnection: IDBDatabase | undefined; timestampCacheKey: string } = {
        dbConnection: undefined,
        timestampCacheKey: "",
    }
) => {
    if (logging) console.log("Starting getEntities");
    let offset = 0;
    let continueFetching = true;

    let time = getCache(timestampCacheKey);
    while (continueFetching) {
        const entities = await client.getEntities({
            limit,
            offset,
            clause,
            order_by: orderBy,
            entity_models: entityModels,
            dont_include_hashed_keys: false,
            internal_updated_at: time,
        });

        if (dbConnection) {
            await insertEntitiesInDB(dbConnection, entities);
        }

        if (logging) console.log(`Fetched ${entities} entities`);

        setEntities(entities, components, logging);

        if (Object.keys(entities).length < limit) {
            continueFetching = false;
        } else {
            offset += limit;
        }
    }
    const currentTime = Math.floor(Date.now() / 1000);
    setCache(currentTime, timestampCacheKey);
};

/**
 * Fetches event messages from the client and synchronizes them with t
 * he specified components.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param limit - The maximum number of event messages to fetch per request (default: 100).
 * @param clause - An optional clause to filter event messages.
 * @param logging - Whether to log debug information (default: false).
 * @param historical - Whether to fetch historical events (default: false).
 * @param callback - An optional callback function to be called after fetching events.
 */
export const getEvents = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    orderBy: OrderBy[] = [],
    entityModels: string[] = [],
    limit: number = 100,
    clause: Clause | undefined,
    logging: boolean = false,
    historical: boolean = false,
    callback?: () => void
) => {
    if (logging) console.log("Starting getEvents");
    let offset = 0;
    let continueFetching = true;

    while (continueFetching) {
        const entities = await client.getEventMessages(
            {
                limit,
                offset,
                clause,
                order_by: orderBy,
                entity_models: entityModels,
                dont_include_hashed_keys: false,
                internal_updated_at: 0,
            },
            historical
        );

        if (logging) console.log("entities", entities);

        setEntities(entities, components, logging);

        if (Object.keys(entities).length === 0) {
            continueFetching = false;
        } else {
            offset += limit;
        }
    }

    callback && callback();
};

/**
 * Fetches entities and their components from the client based on specified criteria.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions to fetch.
 * @param entityKeyClause - An EntityKeysClause to filter entities by their keys.
 * @param patternMatching - The pattern matching strategy for entity keys (default: "FixedLen").
 * @param limit - The maximum number of entities to fetch per request (default: 1000).
 * @param logging - Whether to log debug information (default: false).
 *
 * @example
 * const components = createClientComponents({ contractComponents });
 * await getEntitiesQuery(client, components, { Keys: { keys: ["0x1"], models: ["Position"] } }, "FixedLen", 1000);
 *
 * This function performs paginated queries to fetch all matching entities and their
 * components. It uses the provided EntityKeysClause to filter entities and
 * the specified components to determine which data to retrieve.
 *
 * Note: Make sure to synchronize the entities by calling the syncEntities method after this.
 */
export const getEntitiesQuery = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause,
    patternMatching: PatternMatching = "FixedLen",
    orderBy: OrderBy[] = [],
    entityModels: string[] = [],
    limit: number = 1000,
    logging: boolean = false
) => {
    if (logging) console.log("Starting getEntitiesQuery");
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
        order_by: orderBy,
        entity_models: entityModels,
        dont_include_hashed_keys: false,
        internal_updated_at: 0,
    });

    while (continueFetching) {
        if (logging)
            console.log(
                `Fetched ${Object.keys(fetchedEntities).length} entities ${cursor}`
            );

        setEntities(fetchedEntities, components, logging);

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
 * @param entityKeyClause - An array of EntityKeysClause to filter entities.
 * @param logging - Whether to log debug information (default: true).
 * @returns A promise that resolves with the subscription handler.
 * @example
 * const sync = await syncEntities(client, components, entityKeyClause);
 * // later...
 * sync.cancel(); // cancel the subscription
 */
export const syncEntities = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause[],
    logging: boolean = true
) => {
    if (logging) console.log("Starting syncEntities");
    return await client.onEntityUpdated(
        entityKeyClause,
        (fetchedEntities: any, data: any) => {
            if (logging) console.log("Entity updated", fetchedEntities);

            setEntities({ [fetchedEntities]: data }, components, logging);
        }
    );
};

/**
 * Sets up a subscription to sync event messages.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param entityKeyClause - An array of EntityKeysClause to filter entities.
 * @param logging - Whether to log debug information (default: false).
 * @param historical - Whether to sync to historical events (default: false).
 * @returns A promise that resolves with the subscription handler.
 * @example
 * const sync = await syncEvents(client, components, entityKeyClause);
 * // later...
 * sync.cancel(); // cancel the subscription
 */
export const syncEvents = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause[],
    logging: boolean = false,
    historical: boolean = false
) => {
    if (logging) console.log("Starting syncEvents");
    return await client.onEventMessageUpdated(
        entityKeyClause,
        historical,
        (fetchedEntities: any, data: any) => {
            if (logging) console.log("Event message updated", fetchedEntities);

            setEntities({ [fetchedEntities]: data }, components, logging);
        }
    );
};

/**
 * Updates the components of entities in the local state.
 * @param entities - An object of entities with their updated component data.
 * @param components - An array of component definitions.
 * @param logging - Whether to log debug information (default: false).
 */
export const setEntities = async <S extends Schema>(
    entities: any,
    components: Component<S, Metadata, undefined>[],
    logging: boolean = false
) => {
    if (
        Object.keys(entities).length === 0 ||
        (Object.keys(entities).length === 1 &&
            entities["0x0"] &&
            Object.keys(entities["0x0"]).length === 0)
    ) {
        console.warn("No entities to set");
        return;
    }

    if (logging) console.log("Entities to set:", entities);

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
                    const rawValue = entities[key][componentName];
                    if (logging)
                        console.log(
                            `Raw value for ${componentName} on ${key}:`,
                            rawValue
                        );

                    const convertedValue = convertValues(
                        recsComponent.schema,
                        rawValue
                    ) as ComponentValue;

                    if (logging)
                        console.log(
                            `Converted value for ${componentName} on ${key}:`,
                            convertedValue
                        );

                    if (!convertedValue) {
                        console.error(
                            `convertValues returned undefined or invalid for ${componentName} on ${key}`
                        );
                    }

                    setComponent(recsComponent, key as Entity, convertedValue);

                    if (logging)
                        console.log(
                            `Set component ${recsComponent.metadata?.name} on ${key}`
                        );
                } catch (error) {
                    console.warn(
                        `Failed to set component ${recsComponent.metadata?.name} on ${key}`,
                        error
                    );
                }
            } else {
                console.warn(
                    `Component ${componentName} not found in provided components.`
                );
            }
        }
    }
};

const setCache = (time: number, timestampCacheKey: string) => {
    const timeString = Math.floor(time).toString();
    localStorage.setItem(timestampCacheKey, timeString);
};

const getCache = (timestampCacheKey: string) => {
    return Number(localStorage.getItem(timestampCacheKey) || 0);
};

async function insertEntitiesInDB(
    db: IDBDatabase,
    entities: Entities
): Promise<void> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["entities"], "readwrite");
        const store = transaction.objectStore("entities");

        let completed = 0;
        let error: Error | null = null;

        // Handle transaction completion
        transaction.oncomplete = () => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        };

        transaction.onerror = () => {
            reject(transaction.error);
        };

        // Store each entity
        for (const [entityId, data] of Object.entries(entities)) {
            const entityData = {
                id: entityId,
                ...data,
            };

            const request = store.put(entityData);
            completed++;

            request.onerror = () => {
                error = request.error;
            };
        }
    });
}
