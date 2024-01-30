## Torii Bot

A bot to interact with your Dojo world via torii

```
bun install
```

### Terminal 1 - Serve the bot

```
bun run serve
```

### Terminal 2 - Build and watch

```
bun run build --watch
```

Now try running it in your server

### Adding Graphql

We use graphql code generator to generate typescript types for our graphql schema.

Step 1: Add your graphql schema to `src/graphql/schema.graphql`

Then run

```
bun run codegen
```
