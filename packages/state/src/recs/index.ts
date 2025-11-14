import {
    type Component,
    type ComponentValue,
    type Entity,
    type Metadata,
    type Schema,
    getComponentValue,
    hasComponent,
    removeComponent,
    setComponent,
    updateComponent,
} from "@dojoengine/recs";
import type {
    Clause,
    Entity as ToriiEntity,
    OrderBy,
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
    clause: Clause,
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
    return await syncEntities(client, components, clause, logging);
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
    clause: Clause,
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
    return await syncEvents(client, components, clause, logging);
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
    historical: boolean = false,
    {
        dbConnection,
        timestampCacheKey,
    }: { dbConnection: IDBDatabase | undefined; timestampCacheKey: string } = {
        dbConnection: undefined,
        timestampCacheKey: "",
    }
) => {
    if (logging) console.log("Starting getEntities");
    let cursor = undefined;
    let continueFetching = true;

    // const time = dbConnection ? getCache(timestampCacheKey) : 0;

    while (continueFetching) {
        const entities = await client.getEntities({
            pagination: {
                limit,
                cursor,
                direction: "Forward",
                order_by: orderBy,
            },
            clause: clause || undefined,
            no_hashed_keys: false,
            models: entityModels,
            historical,
            world_addresses: [],
        });

        if (dbConnection) {
            await insertEntitiesInDB(dbConnection, entities.items);
        }

        if (logging) console.log(`Fetched entities`, entities.items);

        setEntities(entities.items, components, logging);

        if (Object.keys(entities.items).length < limit) {
            continueFetching = false;
        } else {
            cursor = entities.next_cursor;
        }
    }

    if (dbConnection) {
        const currentTime = Math.floor(Date.now() / 1000);
        setCache(currentTime, timestampCacheKey);
    }
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
    let cursor = undefined;
    let continueFetching = true;

    while (continueFetching) {
        const entities = await client.getEventMessages({
            pagination: {
                limit,
                cursor,
                direction: "Forward",
                order_by: orderBy,
            },
            clause: clause || undefined,
            no_hashed_keys: false,
            models: entityModels,
            historical,
            world_addresses: [],
        });

        if (logging) console.log("entities", entities.items);

        setEntities(entities.items, components, logging);
        if (entities.items.length < limit && !entities.next_cursor) {
            continueFetching = false;
            continue;
        }

        if (Object.keys(entities.items).length === 0) {
            console.error("STOP FETCHING");
            continueFetching = false;
        } else {
            console.error("NEXT_CURSOR", entities.next_cursor);
            cursor = entities.next_cursor;
        }
    }

    callback && callback();
};

/**
 * Fetches entities and their components from the client based on specified criteria.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions to fetch.
 * @param entityKeyClause - An Clause to filter entities by their keys.
 * @param patternMatching - The pattern matching strategy for entity keys (default: "FixedLen").
 * @param limit - The maximum number of entities to fetch per request (default: 1000).
 * @param logging - Whether to log debug information (default: false).
 *
 * @example
 * const components = createClientComponents({ contractComponents });
 * await getEntitiesQuery(client, components, { Keys: { keys: ["0x1"], models: ["Position"] } }, "FixedLen", 1000);
 *
 * This function performs paginated queries to fetch all matching entities and their
 * components. It uses the provided Clause to filter entities and
 * the specified components to determine which data to retrieve.
 *
 * Note: Make sure to synchronize the entities by calling the syncEntities method after this.
 */
export const getEntitiesQuery = async <S extends Schema>(
    client: ToriiClient,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: Clause,
    orderBy: OrderBy[] = [],
    entityModels: string[] = [],
    limit: number = 1000,
    logging: boolean = false,
    historical: boolean = false
) => {
    if (logging) console.log("Starting getEntitiesQuery");
    let cursor = undefined;
    let continueFetching = true;

    while (continueFetching) {
        const fetchedEntities = await client.getEntities({
            pagination: {
                limit,
                cursor,
                direction: "Forward",
                order_by: orderBy,
            },
            clause: entityKeyClause,
            no_hashed_keys: false,
            models: entityModels,
            historical,
            world_addresses: [],
        });
        if (logging)
            console.log(
                `Fetched ${Object.keys(fetchedEntities.items).length} entities ${fetchedEntities.next_cursor}`
            );

        setEntities(fetchedEntities.items, components, logging);

        if (
            fetchedEntities.items.length < limit &&
            !fetchedEntities.next_cursor
        ) {
            continueFetching = false;
            continue;
        }

        if (Object.keys(fetchedEntities.items).length < limit) {
            continueFetching = false;
        } else {
            cursor = fetchedEntities.next_cursor;
        }
    }
};

/**
 * Sets up a subscription to sync entity updates.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param entityKeyClause - An array of Clause to filter entities.
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
    entityKeyClause: Clause,
    logging: boolean = true
) => {
    if (logging) console.log("Starting syncEntities");
    return await client.onEntityUpdated(
        entityKeyClause,
        undefined,
        (entityData: ToriiEntity) => {
            if (logging) console.log("Entity updated", entityData);

            setEntities(
                { [entityData.hashed_keys]: entityData },
                components,
                logging
            );
        }
    );
};

/**
 * Sets up a subscription to sync event messages.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions.
 * @param entityKeyClause - An array of Clause to filter entities.
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
    entityKeyClause: Clause,
    logging: boolean = false
) => {
    if (logging) console.log("Starting syncEvents");
    return await client.onEventMessageUpdated(
        entityKeyClause,
        undefined,
        (fetchedEntities: any, data: any) => {
            if (logging) console.log("Event message updated", fetchedEntities);

            setEntities({ [fetchedEntities]: data }, components, logging);
        }
    );
};

// Helper function to process components for a single entity
async function processEntityComponents<S extends Schema>(
    entityId: string,
    componentsMap: Record<string, any>,
    recsComponents: Component<S, Metadata, undefined>[],
    logging: boolean
) {
    for (const componentName in componentsMap) {
        if (!Object.hasOwn(componentsMap, componentName)) {
            continue;
        }
        const recsComponent = Object.values(recsComponents).find(
            (c) =>
                `${c.metadata?.namespace}-${c.metadata?.name}` === componentName
        );

        if (!recsComponent) {
            if (logging)
                console.warn(
                    `Component ${componentName} not found in provided components for entity ${entityId}.`
                );
            continue;
        }

        try {
            const rawValue = componentsMap[componentName];
            // Handle component removal if rawValue is an empty object
            if (
                rawValue &&
                typeof rawValue === "object" &&
                Object.keys(rawValue).length === 0
            ) {
                removeComponent(recsComponent, entityId as Entity, {
                    skipUpdateStream: false,
                });
                if (logging)
                    console.log(
                        `Removed component ${recsComponent.metadata?.name} on ${entityId}`
                    );
                continue;
            }

            if (logging)
                console.log(
                    `Raw value for ${componentName} on ${entityId}:`,
                    rawValue
                );

            const convertedValue = convertValues(
                recsComponent.schema,
                rawValue
            ) as ComponentValue;

            if (logging)
                console.log(
                    `Converted value for ${componentName} on ${entityId}:`,
                    convertedValue
                );

            if (convertedValue === undefined || convertedValue === null) {
                console.error(
                    `convertValues returned null or undefined for ${componentName} on ${entityId}. Raw value:`,
                    rawValue
                );
                // If this means deletion, it should have been caught by the empty object check.
                // Otherwise, it's an invalid value, so we skip setting/updating.
                continue;
            }

            if (hasComponent(recsComponent, entityId as Entity)) {
                updateComponent(
                    recsComponent,
                    entityId as Entity,
                    convertedValue as Partial<ComponentValue<S, undefined>>,
                    getComponentValue(recsComponent, entityId as Entity)
                );
                if (logging)
                    console.log(
                        `Updated component ${recsComponent.metadata?.name} on ${entityId}`
                    );
            } else {
                setComponent(recsComponent, entityId as Entity, convertedValue);
                if (logging)
                    console.log(
                        `Set component ${recsComponent.metadata?.name} on ${entityId}`
                    );
            }
        } catch (error) {
            console.warn(
                `Failed to set component ${recsComponent.metadata?.name} on ${entityId}`,
                error
            );
        }
    }
}

/**
 * Updates the components of entities in the local state.
 * Handles different input structures: an array of ToriiEntity models or a record of entity IDs to component maps.
 * @param entitiesInput - The entities data, can be ToriiEntity[] (e.g., from getEntities) or Record<EntityId, ComponentMap> (e.g., from syncEntities).
 * @param recsComponents - An array of RECS component definitions.
 * @param logging - Whether to log debug information (default: false).
 */
export const setEntities = async <S extends Schema>(
    entitiesInput: any, // Can be ToriiEntity[] or Record<EntityId, ComponentMap>
    recsComponents: Component<S, Metadata, undefined>[],
    logging: boolean = false
) => {
    if (logging) console.log("Initial input to setEntities:", entitiesInput);

    if (!entitiesInput) {
        if (logging) console.warn("Null or undefined input to setEntities.");
        return;
    }

    if (Array.isArray(entitiesInput)) {
        // Case 1: Input is an array of ToriiEntity (EntityModel)
        if (entitiesInput.length === 0) {
            if (logging) console.warn("Empty array passed to setEntities.");
            return;
        }
        if (logging)
            console.log("Processing input as an array of ToriiEntity models.");
        for (const entityModel of entitiesInput as ToriiEntity[]) {
            if (
                entityModel &&
                typeof entityModel.hashed_keys === "string" &&
                entityModel.models &&
                typeof entityModel.models === "object"
            ) {
                await processEntityComponents(
                    entityModel.hashed_keys,
                    entityModel.models,
                    recsComponents,
                    logging
                );
            } else {
                if (logging)
                    console.warn(
                        "Skipping invalid entity model in array:",
                        entityModel
                    );
            }
        }
    } else if (typeof entitiesInput === "object" && entitiesInput !== null) {
        // Case 2: Input is an object (Record<EntityId, ComponentMap>)
        if (Object.keys(entitiesInput).length === 0) {
            // Handles general empty objects. The specific `{"0x0": {}}` check from before
            // would effectively result in no operations if it passed this, as the inner loop wouldn't run.
            if (logging) console.warn("Empty object passed to setEntities.");
            return;
        }
        if (logging)
            console.log("Processing input as Record<EntityId, ComponentMap>.");
        for (const entityId in entitiesInput) {
            if (Object.hasOwn(entitiesInput, entityId)) {
                const componentsMap = entitiesInput[entityId].models;
                if (
                    typeof componentsMap === "object" &&
                    componentsMap !== null
                ) {
                    await processEntityComponents(
                        entityId,
                        componentsMap,
                        recsComponents,
                        logging
                    );
                } else {
                    if (logging)
                        console.warn(
                            `Data for entity ${entityId} is not a valid components map:`,
                            componentsMap
                        );
                }
            }
        }
    } else {
        if (logging)
            console.warn("Invalid input type for setEntities:", entitiesInput);
    }
};

const setCache = (time: number, timestampCacheKey: string) => {
    const timeString = Math.floor(time).toString();
    localStorage.setItem(timestampCacheKey, timeString);
};

// const getCache = (timestampCacheKey: string) => {
//     return Number(localStorage.getItem(timestampCacheKey) || 0);
// };

async function insertEntitiesInDB(
    db: IDBDatabase,
    entities: ToriiEntity[]
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
