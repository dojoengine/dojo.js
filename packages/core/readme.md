## @dojoengine/core

- [Getting Started](#getting-started)
- [Example Class Usage](#example-class-usage)
- [Generating Components](#generating-components)
- [Extending the Core](#extending-the-core)

This library abstracts away the world interface and provides a set of helper functions to interact with the world. It is preferred to use this library over interacting with the world directly.

- World explorers
- Games
- Analytics

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
import { Account, TypedContract, num } from "starknet";
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql';
import manifest from "./manifest.json";

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

const getContractByName = (name: string) => {
    return manifest.contracts.find((contract) => contract.name === name);
}

export async function setupNetwork() {
    // Extract environment variables for better readability.
    const { VITE_PUBLIC_WORLD_ADDRESS, VITE_PUBLIC_NODE_URL, VITE_PUBLIC_TORII } = import.meta.env;

    // Create a new RPCProvider instance.
    const provider = new RPCProvider(VITE_PUBLIC_WORLD_ADDRESS, VITE_PUBLIC_NODE_URL);

    // Utility function to get the SDK.
    const createGraphSdk = () => getSdk(new GraphQLClient(VITE_PUBLIC_TORII));

    // Return the setup object.
    return {
        provider,
        world,

        // Define contract components for the world.
        contractComponents: defineContractComponents(world),

        // Define the graph SDK instance.
        graphSdk: createGraphSdk(),

        // Execute function.
        execute: async (signer: Account, contract: string, system: string, call_data: num.BigNumberish[]) => {
            return provider.execute(signer, getContractByName(contract)?.address || "", system, call_data);
        },

        // Entity query function.
        entity: async (component: string, query: Query) => {
            return provider.entity(component, query);
        },

        // Entities query function.
        entities: async (component: string, partition: number) => {
            return provider.entities(component, partition);
        },

        // Call function.
        call: async (selector: string, call_data: num.BigNumberish[]) => {
            return provider.call(selector, call_data);
        },
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

We all want worlds that allow easy extensibility. The core class `RPCProvider` exposes the world api. If you are building a world and want developers to easily build on top of it you can extend the `RPCProvider` class and expose your own methods.

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
