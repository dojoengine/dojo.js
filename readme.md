## Dojo Packages

Monorepo for the [dojo engine](https://www.dojoengine.org/en/) npm packages.



### Enviroment setup

We are using [bun](https://bun.sh/) in this repo install it by:

```console
curl -fsSL https://bun.sh/install | bash
```

### Development

From the root to install all the packages deps.
```
bun install
``` 

This will watch for local changes made to the package and compile, which will be reflected in the example.
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