## Squire V2

Squire is designed to be a template to build bots for the onchain gaming ecosystem.

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

NOTE: There is a ts bug in the schema gen right now, so you will have to remove the errors in the schema by changing them to any.
