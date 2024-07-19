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
    Client,
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
    client: Client,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause | undefined,
    limit: number = 100
) => {
    await getEntities(client, components, limit);
    return await syncEntities(client, components, entityKeyClause);
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
 * Fetches entities and their components from the client based on specified criteria.
 * @param client - The client instance for API communication.
 * @param components - An array of component definitions to fetch.
 * @param entityKeyClause - An optional EntityKeysClause to filter entities by their keys.
 * @param patternMatching - The pattern matching strategy for entity keys (default: "FixedLen").
 * @param limit - The maximum number of entities to fetch per request (default: 1000).
 *
 * @example
 * const components = createClientComponents({ contractComponents });
 * await getEntitiesQuery(client, components, undefined, "FixedLen", 1000);
 *
 * @example
 * const components = createClientComponents({ contractComponents });
 * await getEntitiesQuery(client, components, { Keys: { keys: ["0x1"], models: ["Position"] } }, "FixedLen", 1000);
 *
 * @example
 * const components = createClientComponents({ contractComponents });
 * await getEntitiesQuery(client, components, { HashedKeys: ["0x1"] }, "FixedLen", 1000);
 *
 * This function performs paginated queries to fetch all matching entities and their
 * components. It uses the provided EntityKeysClause (if any) to filter entities and
 * the specified components to determine which data to retrieve. The function continues
 * fetching until all matching entities have been retrieved, using the 'limit' parameter
 * to control the batch size of each request.
 */
export const getEntitiesQuery = async <S extends Schema>(
    client: Client,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause,
    patternMatching: PatternMatching = "FixedLen",
    limit: number = 1000
) => {
    let cursor = 0;
    let continueFetching = true;

    while (continueFetching) {
        const clause: Clause | null = entityKeyClause
            ? {
                  Keys: {
                      keys:
                          "HashedKeys" in entityKeyClause
                              ? entityKeyClause.HashedKeys
                              : entityKeyClause.Keys.keys,
                      pattern_matching: patternMatching,
                      models: [
                          ...components.map((c) => c.metadata?.name as string),
                      ],
                  },
              }
            : null;

        const fetchedEntities = await client.getEntities({
            limit,
            offset: cursor,
            clause,
        });

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
    client: Client,
    components: Component<S, Metadata, undefined>[],
    entityKeyClause: EntityKeysClause | undefined
) => {
    return await client.onEntityUpdated(
        entityKeyClause,
        (fetchedEntities: any) => {
            setEntities(fetchedEntities, components);
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
    console.log(entities, components);
    for (let key in entities) {
        if (entities.hasOwnProperty(key)) {
            for (let componentName in entities[key]) {
                if (entities[key].hasOwnProperty(componentName)) {
                    let recsComponent = Object.values(components).find(
                        (component) =>
                            component.metadata?.name === componentName
                    );

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
