<!-- markdownlint-disable -->
<div align="center">
  <img src=".github/dojo-mark-full-dark.svg" height="128">
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

### Packages

Monorepo for the [dojo engine](https://www.dojoengine.org/en/) npm packages.

- [core](./packages/core)
- [burner](./packages/create-burner)
- [utils](./packages/utils)


### Enviroment setup

We are using [bun](https://bun.sh/) in this repo install it by:

```console
curl -fsSL https://bun.sh/install | bash
```

### Development

From the root to install all the packages deps
```
bun install
``` 

### Building packages

Navigate to a package and run the following. This will launch bun and watch for local changes, automatically compiling and updating.

```
bun run build --watch
```

### Examples

To run the example which has the linked packages:

**Terminal 1**
```
cd examples/react-app

bun install 

bun dev
```

**Terminal 2**
```
cd examples/dojo-starter

katana --disable-fee --block-time 1000
```

**Terminal 3**
```
cd examples/dojo-starter && sozo build && sozo migrate
```