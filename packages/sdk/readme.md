# Dojo SDK: Type-Safe Onchain State

The Dojo SDK offers a powerful and intuitive way to interact with your onchain state. It provides a seamless experience for fetching and subscribing to data, supporting both simple and complex queries.

## Key Features

-   **Type Safety**: Leverage TypeScript for robust, error-resistant code.
-   **Intuitive Query Syntax**: Write queries that feel natural, similar to popular ORMs.
-   **Flexible Subscriptions**: Easily subscribe to specific state changes in your Dojo world.
-   **Built in support for signed messages**: Sign off-chain state and send to torii.

## Understand Entities and Models

-   Entities are uniquely identified by Keys defined in associated models
-   Entities can have multiple models, representing complex game states
-   When a subscription or query returns data - it returns the updated Entity and changed models.

## Example: Subscribing to Specific Model States

Here's a concise example demonstrating how to subscribe to the `item` model in the `world` namespace, specifically filtering for items with a durability of 2:

```typescript
const subscription = await sdk.subscribeEntityQuery(
    world: {
        item: {
            $: {
                where: { durability: { $is: 2 } },
            },
        },
    },
    (response) => {
        if (response.data) {
            // return data - pipe into any state management!
            console.log("Updated entities:", response.data);
        } else if (response.error) {
            // return error
            console.error("Subscription error:", response.error);
        }
    }
);

// Later, to unsubscribe
subscription.unsubscribe();
```

## 🚀 Getting Started

```bash
npm install @dojoengine/sdk
```

Generate TypeScript types directly from your world schema:

To take advantage of this type safety (You will need [dojo](https://github.com/dojoengine/dojo) installed):

1. Generate the TypeScript types for your world:

    ```bash
    sozo build --typescript-v2
    ```

2. You will import these and pass into the sdk init function to give your app type.

This approach ensures that your code remains in sync with your Dojo world definition, catching potential issues early in the development process.

## Usage

```typescript
import { init, SchemaType } from "@dojoengine/sdk";

// Generate with sozo or define Schema
const schema: Schema = {
    dojo_starter: {
        Moves: {
            fieldOrder: ["player", "remaining", "last_direction", "can_move"],
            player: "",
            remaining: 0,
            last_direction: Direction.None,
            can_move: false,
        },
        DirectionsAvailable: {
            fieldOrder: ["player", "directions"],
            player: "",
            directions: [],
        },
        Position: {
            fieldOrder: ["player", "vec"],
            player: "",
            vec: { x: 0, y: 0 },
        },
    },
};

// Initialize the SDK
const db = await init<MockSchemaType>(
    {
        client: {
            rpcUrl: "your-rpc-url",
            toriiUrl: "your-torii-url",
            relayUrl: "your-relay-url",
            worldAddress: "your-world-address",
        },
        domain: {
            name: "Example",
            version: "1.0",
            chainId: "your-chain-id",
            revision: "1",
        },
    },
    schema
);

// Voila! Now you have a typed interface
```

## Query Explanation

The SDK utilizes two primary types of queries to interact with the Dojo Engine:

1. **`SubscriptionQueryType`**: Used for real-time subscriptions to entity and event updates.
2. **`QueryType`**: Used for fetching entities and event messages with more flexible filtering options.

Both query types enable filtering based on `entityIds` and specific model properties. The key difference lies in the operators supported within the `where` clause:

-   **`SubscriptionQueryType`**:
    -   Supports only the `$is` operator for exact matches.
-   **`QueryType`**:
    -   Supports a variety of operators including `$eq`, `$neq`, `$gt`, `$gte`, `$lt`, and `$lte` for more advanced filtering.

## Examples

### Subscribing to Entity Updates

This example demonstrates how to subscribe to entity updates in the `world` namespace, specifically for the `item` model. It filters for items where the type is "sword" and the durability is 5. This subscription will trigger the callback function whenever an item matching these criteria is updated, created, or deleted.

Key points:

-   Namespace: `world`
-   Model: `item`
-   Conditions:
    -   type: "sword"
    -   durability: 5
-   Uses `$is` operator for exact matching in subscriptions

```typescript
const subscription = await sdk.subscribeEntityQuery(
    {
        world: {
            item: {
                $: {
                    where: {
                        type: { $is: "sword" },
                        durability: { $is: 5 },
                    },
                },
            },
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

This example demonstrates fetching entities from the `world` namespace, specifically the `player` model. It retrieves players where the `id` equals "1" and the `name` equals "Alice". This showcases how to use multiple conditions in a query to precisely filter entities.

Note: The `$eq` operator is used for exact matching. Other operators like `$gt` (greater than), `$lt` (less than), etc., are available for more complex queries.

```typescript
const entities = await sdk.getEntities(
    {
        world: {
            player: {
                $: { where: { id: { $eq: "1" }, name: { $eq: "Alice" } } },
            },
        },
    },
    (response) => {
        if (response.data) {
            console.log("Fetched entities:", response.data);
        } else if (response.error) {
            console.error("Fetch error:", response.error);
        }
    }
);
```
