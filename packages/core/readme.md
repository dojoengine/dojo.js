## @dojoengine/core

-   [Getting Started](#getting-started)
-   [Example Class Usage](#example-class-usage)
-   [Generating Components](#generating-components)
-   [Extending the Core](#extending-the-core)

This library abstracts away the world interface and provides a set of helper functions to interact with the world. It is preferred to use this library over interacting with the world directly.

-   World explorers
-   Games
-   Analytics

### Getting Started

```console
bun add @dojoengine/core
```

### Example Class Usage

This is an example from [Dojo React App](https://github.com/dojoengine/dojo-starter-react-app)

```javascript
import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider, Query, } from "@dojoengine/core";
import { Account, num } from "starknet";
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql';

// Import the manifest from your project
import manifest from "../../../dojo-starter/target/dev/manifest.json";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {
    // Extract environment variables for better readability.
    const { VITE_PUBLIC_WORLD_ADDRESS, VITE_PUBLIC_NODE_URL, VITE_PUBLIC_TORII } = import.meta.env;

    // Create a new RPCProvider instance.
    const provider = new RPCProvider(VITE_PUBLIC_WORLD_ADDRESS, manifest, VITE_PUBLIC_NODE_URL);

    // Return the setup object.
    return {
        provider,
        world,

        // Define contract components for the world.
        contractComponents: defineContractComponents(world),

        // Define the graph SDK instance.
        graphSdk: () => getSdk(new GraphQLClient(VITE_PUBLIC_TORII)),

        // Execute function.
        execute: async (signer: Account, contract: string, system: string, call_data: num.BigNumberish[]) => {
            return provider.execute(signer, contract, system, call_data);
        },

        // Read-only function call.
        call: async (contract: string, system: string, call_data: num.BigNumberish[]) => {
            return provider.call(contract, system, call_data);
        },

        // Entity query function.
        entity: async (component: string, query: Query) => {
            return provider.entity(component, query);
        },

        // Entities query function.
        entities: async (component: string, partition: number) => {
            return provider.entities(component, partition);
        }
    };
}
```

### Generating Components

The core package comes bundled with a component generation script that you can use to streamline development. It is exposed via a binary and in your package.json you can include a script.

```js
  "scripts": {
    "create-components": "npx @dojoengine/core src/dojo/manifest.json src/dojo/contractComponents.ts"
  },
```

You must point the script to your games manifest file and the output file. The output file will be overwritten so make sure you don't have any changes you want to keep.

> Note: As of 0.3.0 custom types are not supported, so you will need to manualy adjust these.

### Extending the Core

We all aspire to create environments that prioritize easy extensibility. The foundational class, `RPCProvider`, unveils the API for these worlds. If you're designing a world and wish for developers to seamlessly expand upon it, simply extend the `RPCProvider` class and introduce your unique methods.

```javascript
import { RPCProvider } from "@dojoengine/core";

export class EternumProvider extends RPCProvider {
    constructor(world_address: string, url?: string) {
        super(world_address, url);
    }

    //...custom methods
}
```

New developer will instantly then know how to interact with your world!
