<div align="center">
  <img src="./media/dojo-mark-full-dark.svg" height="48" align="center" />
  <a href="https://twitter.com/dojostarknet"><img src="https://img.shields.io/twitter/follow/dojostarknet?style=social"/></a>
  <a href="https://github.com/dojoengine/dojo"><img src="https://img.shields.io/github/stars/dojoengine/dojo?style=social"/></a>
  <a href="https://discord.gg/PwDa2mKhR4"><img src="https://img.shields.io/badge/join-discord-blue?logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://t.me/dojoengine"><img src="https://img.shields.io/badge/join-telegram-blue?logo=telegram" alt="Telegram"></a>
  <img src="https://img.shields.io/github/actions/workflow/status/dojoengine/dojo/ci.yml?branch=main" alt="CI Status">
</div>

<h2>
  Dojo simplifies <span>provable</span> and
    onchain application development
</h2>

Dojo.js enables simple, clean, and efficient syncing of your dojo world. Plus, it comes with burners and other handy utils for building the most complex of onchain applications.

If you are not familiar with Dojo, then you should read the [book](https://book.dojoengine.org/) first.

## Table of Contents

-   [Quick start in 5 minutes](#quick-start-in-5-minutes)
-   [Dojo SDK](#dojo-sdk)
-   [Examples](#examples)
-   [All Packages](#all-packages)

## Quick start in 5 minutes

Start a new react app with (You will need [dojo](https://github.com/dojoengine/dojo) installed):

```bash
npx @dojoengine/create-dojo start -t example-vite-react-sdk
```

> This command initializes a new directory with the template alongside the `dojo-starter` Cairo app. It offers a streamlined way to explore Dojo from end to end, providing a comprehensive overview of its capabilities. Additionally, this setup serves as an excellent foundation for building the next big thing.

#### Then

1. **Terminal 1: Start the local Katana node**

    ```bash
    cd dojo-starter
    katana --disable-fee --allowed-origins "*"
    ```

2. **Terminal 2: Build and migrate the Dojo starter**

    ```bash
    cd dojo-starter
    sozo build && sozo migrate

    # Start Torii indexer - world address can be found in the print out of migrate
    torii --world <WORLD_ADDRESS> --allowed-origins "*"
    ```

3. **Terminal 3: Launch the frontend application**

    ```bash
    cd client
    pnpm i && pnpm dev
    ```

> Note: Run each step in a separate terminal window to keep all processes running simultaneously.

### Dojo SDK

Dojo.js provides an instant and easy way to interface with your world you can simply create a client. It exposes a familiar like query language to subscribe to and fetch entities.

```
pnpm i @dojoengine/sdk
```

> To see a full example see the [example-vite-react-sdk](./examples//example-vite-react-sdk/)

```js
// Create client with your parameters
const db =
    (await init) <
    Schema >
    ({
        // your config
        client: {
            rpcUrl: dojoConfig.rpcUrl,
            toriiUrl: dojoConfig.toriiUrl,
            relayUrl: dojoConfig.relayUrl,
            worldAddress: dojoConfig.manifest.world.address,
        },
        // allows typed messaging via indexer
        domain: {
            name: "Example",
            version: "1.0",
            chainId: "your-chain-id",
            revision: "1",
        },
    },
    // typed schema
    schema);

// Query - fetch with a query then pipe into your state of choice
await db.getEntities(
    {
        dojo_starter: {
            Moves: {
                $: {
                    where: {
                        player: {
                            $eq: addAddressPadding(address),
                        },
                    },
                },
            },
        },
    },
    (resp) => {
        if (resp.error) {
            console.error("resp.error.message:", resp.error.message);
            return;
        }
        if (resp.data) {
            // this uses a typed zustand store, but you can use whatever state you choose
            state.setEntities(resp.data);
        }
    }
);
```

## All Packages

Dojo.js is modularized into small packages to keep it light.

Getting started, we recommend using the SDK package, which will provide you with a simple interface to work with:

-   [SDK](./packages/create-burner/): Clean abstraction incorporating other packages and providing the best way to get started

[Read the SDK full documentation](./packages/sdk/readme.md)

Other packages:

-   [core](./packages/core/): Dojo provider for an interface into your world
-   [create Burner](./packages/create-burner/): Create burners for local development fast
-   [react](./packages/create-burner/): React package of hooks for working with Dojo
-   [state](./packages/create-burner/): State package for compatible state managers (Currently RECS)
-   [torii-client](./packages/create-burner/): Client package for working with Torii WASM. This package exports all the types needed to build with torii-client.
-   [torii-wasm](./packages/create-burner/): WASM build
-   [utils](./packages/create-burner/): Helpful utils for working with Dojo apps
-   [utils-wasm](./packages/create-burner/): WASM utils for working with Dojo apps

## All Examples

Spin any of these examples locally

```bash
npx @dojoengine/create-dojo start
```

-   [example-vite-react-sdk](./examples/example-vite-react-sdk/): A React application using Vite and the Dojo SDK
-   [example-vite-react-phaser-recs](./examples/example-vite-react-phaser-recs/): A React application using Vite and the Dojo SDK
-   [example-vite-react-pwa-recs](./examples/example-vite-react-pwa-recs/): A React application using Vite and the Dojo SDK
-   [example-vite-react-threejs-recs](./examples/example-vite-react-threejs-recs/): A React application using Vite and the Dojo SDK
-   [example-vue-app-recs](./examples/example-vue-app-recs/): A React application using Vite and the Dojo SDK
-   [example-vite-kitchen-sink](./examples/example-vite-kitchen-sink/): A React application using Vite and the Dojo SDK
-   [example-nodejs-bot](./examples/example-nodejs-bot/): A React application using Vite and the Dojo SDK

## Contributing to dojo.js

Dojo.js is a work in progress. We welcome contributions! Here's how you can get started:

### Setting up the Development Environment

1. Clone the repository:

    ```bash
    git clone https://github.com/dojoengine/dojo.js.git
    cd dojo.js
    ```

2. Install dependencies:

    ```bash
    pnpm i
    ```

### Building Packages

Before running examples, you need to build the packages:

-   Build all packages:

    ```bash
    pnpm run build
    ```

-   Watch for changes (development mode):
    ```bash
    pnpm run build --watch
    ```

### Running The Examples

To run the examples, you'll need to set up three terminal windows:

**Terminal 1**: Set up the Dojo starter environment

1. Navigate to the Dojo starter directory:

    ```bash
    cd worlds/dojo-starter
    ```

2. Start Katana (local Starknet devnet) with fee disabled and all origins allowed:
    ```bash
    katana --disable-fee --allowed-origins "*"
    ```

**Terminal 2**: Build, migrate, and run Torii

1. Navigate to the Dojo starter example:

    ```bash
    cd examples/dojo-starter
    ```

2. Build and migrate the contracts:

    ```bash
    sozo build
    sozo migrate apply
    ```

3. Run Torii (indexer) with the world address and allowed origins:

    ```bash
    torii --world 0xb4079627ebab1cd3cf9fd075dda1ad2454a7a448bf659591f259efa2519b18 --allowed-origins "*"
    ```

    Note: The world address may change. Ensure you're using the correct address from your migration output.

**Terminal 3**: Start the example application

1. Navigate to the specific example package you want to run:

    ```bash
    cd examples/<package-name>
    ```

    Replace `<package-name>` with the name of the example you want to run (e.g., `example-vite-react-sdk`).

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Start the development server:
    ```bash
    pnpm run dev
    ```

After completing these steps, your example application should be running and connected to the local Dojo environment.

### Debugging

If you encounter issues on WSL:

1. Install the Dojo package:

    ```bash
    npm i @dojoengine/create-dojo -g
    ```

2. Run the Dojo creation command:
    ```bash
    npx @dojoengine/create-dojo
    ```

### Contributing Guidelines

1. Fork the repository and create your branch from `main`.
2. Make your changes and ensure they follow the project's coding style.
3. Write tests for your changes if applicable.
4. Run the test suite to ensure all tests pass.
5. Submit a pull request with a clear description of your changes.

For more detailed information, please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) file.
