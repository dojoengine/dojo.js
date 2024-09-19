# Dojo SDK: Unleash Type-Safe Game Development

Supercharge your Dojo Engine projects with our TypeScript SDK. Build, query, and interact with your game world using the power of static typing.

## 🚀 Type Safety on Steroids

Generate TypeScript types directly from your world schema:

To take advantage of this type safety:

1. Generate the TypeScript types for your world:

    ```bash
    sozo build --typescript-v2
    ```

2. Import and use these types when initializing the SDK and constructing queries.

This approach ensures that your code remains in sync with your Dojo world definition, catching potential issues early in the development process.

## Installation

```bash
npm install @dojoengine/sdk
```

## Usage

```typescript
import { init, SchemaType } from "@dojoengine/sdk";

// Define your schema
const schema: SchemaType = {
    // Your schema definition here
};

// Initialize the SDK
const sdk = await init(
    {
        rpcUrl: "http://localhost:8080",
        // Other config options
    },
    schema
);

// Use the SDK methods
```

## Key Functions

-   `createClient(config)`: Creates a Torii client.
-   `init(options, schema)`: Initializes the SDK with the given configuration and schema.

## SDK Methods

-   `subscribeEntityQuery`: Subscribe to entity updates.
-   `subscribeEventQuery`: Subscribe to event updates.
-   `getEntities`: Fetch entities based on a query.
-   `getEventMessages`: Fetch event messages based on a query.

## Examples

### Subscribing to Entity Updates

```typescript
const subscription = await sdk.subscribeEntityQuery(
    {
        Player: {
            position: [{ $: { where: { x: { $gt: 10 } } } }],
        },
    },
    (response) => {
        if (response.data) {
            console.log("Updated entities:", response.data);
        } else if (response.error) {
            console.error("Subscription error:", response.error);
        }
    }
);

// Later, to unsubscribe
subscription.unsubscribe();
```

### Fetching Entities

```typescript
const entities = await sdk.getEntities(
    {
        Player: {
            health: [{ $: { where: { value: { $gte: 50 } } } }],
        },
    },
    (response) => {
        if (response.data) {
            console.log("Fetched entities:", response.data);
        } else if (response.error) {
            console.error("Fetch error:", response.error);
        }
    },
    10, // limit
    0 // offset
);
```

## Query Explanation

@types.ts

The SDK uses two main types of queries:

1. `SubscriptionQueryType`: Used for subscriptions (entity and event).
2. `QueryType`: Used for fetching entities and event messages.

Both query types allow you to filter data based on entity IDs and specific model properties. The main difference is in the `where` clause:

-   `SubscriptionQueryType` only supports the `$is` operator for exact matches.
-   `QueryType` supports additional operators like `$eq`, `$neq`, `$gt`, `$gte`, `$lt`, and `$lte` for more complex filtering.

Example of a subscription query:

```typescript
{
    Player: {
        position: [{ $: { where: { x: { $is: 5 } } } }];
    }
}
```

Example of a fetch query:

```typescript
{
    Player: {
        health: [{ $: { where: { value: { $gte: 50, $lt: 100 } } } }];
    }
}
```

These query structures allow you to efficiently filter and retrieve the data you need from the Dojo Engine.
