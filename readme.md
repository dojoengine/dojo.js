<div align="center">
  <img src="./media/dojo-mark-full-dark.svg" height="128">

<a href="https://twitter.com/dojostarknet"><img src="https://img.shields.io/twitter/follow/dojostarknet?style=social"/></a>
<a href="https://github.com/dojoengine/dojo"><img src="https://img.shields.io/github/stars/dojoengine/dojo?style=social"/></a>
<br/>
<a href="https://discord.gg/PwDa2mKhR4"><img src="https://img.shields.io/badge/join-discord-blue?logo=discord&logoColor=white" alt="Discord"></a>
<a href="https://t.me/dojoengine"><img src="https://img.shields.io/badge/join-telegram-blue?logo=telegram" alt="Telegram"></a>
<img src="https://img.shields.io/github/actions/workflow/status/dojoengine/dojo/ci.yml?branch=main" alt="CI Status">

</div>
<h2>
  Dojo simplifies <span>provable</span> and
    onchain application development
</h2>

If you are not familiar with Dojo, then you should read the [book](https://book.dojoengine.org/) first.

### Quick start in 5 minutes

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
    pnpm install
    pnpm dev
    ```

> Note: Run each step in a separate terminal window to keep all processes running simultaneously.

### The Packages

Dojo.js is modulrised into small packages to keep it light. Choose all or one when working.

-   [Core](./packages/core/) : Dojo provider for an interface into your world

## Contributing to dojo.js

From the repository root, run the following to install all the necessary package dependencies:

```bash
pnpm i
```

#### Building Packages

**Note**: Before running the examples, you must build each package.

To build all packages, from the root directory, run:

```bash
pnpm run build
```

To watch for changes on all packages in parallel, from the root directory, run:

```bash
pnpm run build-watch
```

#### Dojo starter

To install dojo-starter submodule (which allows interactions with the examples), run:

```bash
git submodule update --init --recursive
```

---

### Debugging

If you have issues on WSL, install package first then run command:

```bash
npm i @dojoengine/create-dojo -g
npx @dojoengine/create-dojo
```

### Examples

To run the examples that have the linked packages, follow the steps below:

**Terminal 1**: Set up the dojo starter with specific configurations.

```bash
cd examples/dojo-starter
katana --disable-fee --allowed-origins "*"
```

**Terminal 2**: Build and migrate the dojo starter.

```bash
cd examples/dojo-starter

# Build and migrate
sozo build
sozo migrate apply
# From your frontend project directory
DOJO_MANIFEST_PATH=../relative/path/to/contracts/Scarb.toml sozo build --typescript --bindings-output=./dojo/gen

# Run Torii
torii --world 0xb4079627ebab1cd3cf9fd075dda1ad2454a7a448bf659591f259efa2519b18 --allowed-origins "*"
```

**Terminal 3**: Start the App

```bash
cd examples/<package>
pnpm install
pnpm run dev
```
