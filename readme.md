<!-- markdownlint-disable -->
<div align="center">
  <img src="./media/dojo-mark-full-dark.svg" height="128">
</div>
<div align="center">
<br />
<!-- markdownlint-restore -->

<a href="https://twitter.com/dojostarknet">
<img src="https://img.shields.io/twitter/follow/dojostarknet?style=social"/>
</a>
<a href="https://github.com/dojoengine/dojo">
<img src="https://img.shields.io/github/stars/dojoengine/dojo?style=social"/>
</a>

[![discord](https://img.shields.io/badge/join-dojo-green?logo=discord&logoColor=white)](https://discord.gg/PwDa2mKhR4)
![Github Actions][gha-badge] [![Telegram Chat][tg-badge]][tg-url]

[gha-badge]: https://img.shields.io/github/actions/workflow/status/dojoengine/dojo/ci.yml?branch=main
[tg-badge]: https://img.shields.io/endpoint?color=neon&logo=telegram&label=chat&style=flat-square&url=https%3A%2F%2Ftg.sumanjay.workers.dev%2Fdojoengine
[tg-url]: https://t.me/dojoengine

</div>

# Dojo: The Provable Game Engine

**Dojo is a community driven open-source, Provable Game Engine, providing a comprehensive toolkit for building verifiable games and autonomous worlds.**

Dojo.js is the official JavaScript SDK for interacting with Dojo worlds. It is currently a work in progress (WIP), and we are actively seeking contributors.

[Read the full dojo documentation](https://book.dojoengine.org)

---

Bootstrap a dojo world like so. You will need [dojo](https://github.com/dojoengine/dojo) installed.

```console
npx @dojoengine/create-dojo
```

### Dojo.js Examples

-   [React-app](./examples/react/react-app) - A vite react app example using Dojo
-   [React-phaser](./examples/react/react-phaser-example) - A vite phaser react app using Dojo
-   [Torii-bot](./examples/node/torii-bot) - A small discord bot for interacting with Torii

## Contributing to dojo.js

Dojo.js is MIT licensed and welcomes contributors. Setting up your environment is simple.

From the repository root, run the following to install all the necessary package dependencies:

```console
pnpm install
```

#### Building Packages:

**Note**: Before running the examples, you must build each package.

To build all packages, from the root directory, run:

```console
pnpm run build
```

To watch for changes on all packages in parallel, from the root directory, run:

```console
pnpm run build-watch
```

#### Dojo starter:

To install dojo-starter submodule (which allows interactions with the examples), run:

```console
git submodule update --init --recursive
```

---

### Debugging

If you have issues on WSL, install package first then run command:

```console
npm i @dojoengine/create-dojo -g
npx @dojoengine/create-dojo
```

### Examples

To run the examples that have the linked packages, follow the steps below:

**Terminal 1**: Set up the dojo starter with specific configurations.

```console
cd examples/dojo-starter
katana --disable-fee --block-time 1000
```

**Terminal 2**: Build and migrate the dojo starter.

```console
cd examples/dojo-starter
sozo build
sozo migrate
```

**Terminal 3**: Start the React app.

```console
cd examples/<package>
pnpm install
pnpm run dev
```
