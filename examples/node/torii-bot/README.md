## Torii Bot

A Discord bot for interacting with your Dojo world via Torii.

Features:

-   Poll a Torii for information.
-   Expose a slash command for reading Torii state.
-   Easy to extend with new commands.
-   GraphQL codegen for Torii models.

---

### Setup

> Follow the steps [below](#create-discord-bot-step-by-step) to obtain your Discord Token. You will also need to acquire your Discord channel ID where you want to send messages. You can obtain this by right-clicking on a channel in your Discord and selecting 'Copy Channel ID'.

### Developing

```bash
bun install
```

### Terminal 1 - Serve the Bot

```bash
bun run serve
```

### Terminal 2 - Build and Watch

```bash
bun run build --watch
```

Now, try running it on your server. Remember to restart your bot after making changes.

### Adding Torii GraphQL Models

Torii exposes dynamically generated models based on your world's models. We can use this to generate a GraphQL SDK for easy querying of the world.

You can access the GraphQL dashboard by navigating to [http://0.0.0.0:8080/graphql](http://0.0.0.0:8080/graphql) if your Torii is running locally.

#### Codegen

Add your GraphQL schema to `src/graphql/schema.graphql`, then run

```bash
bun run codegen
```

Now you can access the sdk in your app like:

```js
import { sdk } from "../config.js";

const { data } = await sdk.getMoves({ player });
```

### Create discord bot step by step

### Create a Discord Bot Step by Step

> Step 1: Go to [Discord Developers](https://discord.com/developers/applications) and create a new application.
> ![Step 1](./images/Step%201.png)

> Step 2: Name the application.
> ![Step 2](./images/Step%202.png)

> Step 3: Select the 'Bot' sidebar item and reset and save the Auth token. Store it in a .env file within your application. Do not share or commit this token. Ensure its confidentiality.
> ![Step 3](./images/Step%203.png)

> Step 4: Enable the switches as shown in the image below. Your app will not function properly without doing this.
> ![Step 4](./images/Step%204.png)

> Step 5: Choose the 'OAuth2' sidebar item and make the selections as shown. Opt for additional choices if you understand their implications.
> ![Step 5](./images/Step%205.png)

> Step 6: Determine the permissions for the bot. As our goal is only to send messages, that's what we'll select.
> ![Step 6](./images/Step%206.png)

> Step 7: Navigate to the URL generated in the previous step and add the bot to your server.
> ![Step 7](./images/Step%207.png)

### Deploying

Deploying these apps onto [Railway](https://railway.app/) is the easiest.

1. Create Account
2. Create a new project and deploy via git
3. In your project settings

Update the project settings:

**Build Command:**
`bun run build`

**Run Commands:**
`bun run serve`

OHAYO
