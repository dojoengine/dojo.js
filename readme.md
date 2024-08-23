<div align="center">
  <img src="./media/dojo-mark-full-dark.svg" height="128">
  <h1>Dojo: The Provable Game Engine</h1>
  <p><strong>Dojo is a community driven open-source, Provable Game Engine, providing a comprehensive toolkit for building verifiable games and autonomous worlds.</strong></p>
  <a href="https://twitter.com/dojostarknet"><img src="https://img.shields.io/twitter/follow/dojostarknet?style=social"/></a>
  <a href="https://github.com/dojoengine/dojo"><img src="https://img.shields.io/github/stars/dojoengine/dojo?style=social"/></a>
  <a href="https://discord.gg/PwDa2mKhR4"><img src="https://img.shields.io/badge/join-discord-blue?logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://t.me/dojoengine"><img src="https://img.shields.io/badge/join-telegram-blue?logo=telegram" alt="Telegram"></a>
  <img src="https://img.shields.io/github/actions/workflow/status/dojoengine/dojo/ci.yml?branch=main" alt="CI Status">
</div>

</div>

Dojo.js is the official JavaScript SDK for interacting with Dojo worlds. It is currently a work in progress (WIP), and we are actively seeking contributors.

[Read the full dojo documentation](https://book.dojoengine.org)

---

Bootstrap a dojo world like so. You will need [dojo](https://github.com/dojoengine/dojo) installed.

```bash
npx @dojoengine/create-dojo
```

### Dojo.js Examples

-   [React-app](./examples/clients/react/react-app) - A vite react app example using Dojo
-   [React-phaser](./examples/clients/react/react-phaser-example) - A vite phaser react app using Dojo
-   [React-nextjs](./examples/clients/react/react-nextjs) - A next.js react app example using Dojo
-   [Torii-bot](./examples/clients/node/torii-bot) - A small discord bot for interacting with Torii
-   [vue-app](./examples/clients/vue/vue-app) - A vite vue app example using Dojo
-   [Vanilla-phaser](./examples/clients/vanilla/phaser) - A vanilla phaser example using Dojo

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
