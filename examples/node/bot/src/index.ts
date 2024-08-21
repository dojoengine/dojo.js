import { Hono } from "hono";
import { GatewayIntentBits } from "discord.js";
import { SapphireClient } from "@sapphire/framework";
import * as torii from "@dojoengine/torii-wasm";
import { syncEntities } from "@dojoengine/state";

import { createWorld } from "@dojoengine/recs";
import { dojoConfig } from "../dojoConfig";

const app = new Hono();

async function initializeToriiClient() {
    return await torii.createClient({
        rpcUrl: dojoConfig.rpcUrl,
        toriiUrl: dojoConfig.toriiUrl,
        relayUrl: "",
        worldAddress: dojoConfig.manifest.world.address || "",
    });
}

let toriiClient: Awaited<ReturnType<typeof torii.createClient>>;

app.use(async (c, next) => {
    if (!toriiClient) {
        toriiClient = await initializeToriiClient();

        toriiClient.onEntityUpdated([], (fetchedEntities: any, data: any) => {
            console.log("Entity updated", data);
        });
    }
    await next();
});

export default {
    port: 7070,
    fetch: app.fetch,
};
