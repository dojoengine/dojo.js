## TODO:

We need to define every case people would use in this library.

It should be the go-to library for building onchain applications, from games to simple NFT websites. The library should provide comprehensive querying and subscription capabilities to interact with onchain data efficiently.

### Queries:

1. **Get all entities by Entity ID**:

    - Fetches all models associated with the entity.
    - This could even flatten the object into one big entity object for easier access.

2. **Get entity and specific models**:

    - Allows fetching a specific entity and its associated models.
    - Useful for retrieving detailed information about a particular entity.

3. **Get all entities matching a Clause**:

    - Retrieves all entities that match a given clause.
    - Clauses can include various conditions and operators to filter the entities.

4. **Get all entities**:

    - Fetches all entities without any filtering.
    - Useful for getting a complete list of all entities in the system.

5. **Get all entities by hashed Keys**:
    - Retrieves entities based on their hashed keys.
    - This method is efficient for fetching entities when the hashed keys are known.

### Subscriptions:

1. **Subscribe by hashed Keys**:

    - Allows subscribing to updates for entities identified by their hashed keys.
    - Useful for real-time updates on specific entities.

2. **Subscribe by EntityKeysClause**:
    - Enables subscriptions based on EntityKeysClause.
    - This method provides flexibility to subscribe to a range of entities based on complex conditions and clauses.

By defining these use cases, we aim to make this library the go-to solution for developers building onchain applications, ensuring they have all the necessary tools to query and subscribe to onchain data effectively.
