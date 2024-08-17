import { Hono } from "hono";
import { GatewayIntentBits } from "discord.js";
import { SapphireClient } from "@sapphire/framework";
import * as torii from "@dojoengine/torii-wasm";
import { syncEntities } from "@dojoengine/state";

import { createWorld } from "@dojoengine/recs";
import { dojoConfig } from "../dojoConfig";

const app = new Hono();

// export const toriiClient = await torii.createClient({
//     rpcUrl: dojoConfig.rpcUrl,
//     toriiUrl: dojoConfig.toriiUrl,
//     relayUrl: "",
//     worldAddress: dojoConfig.manifest.world.address || "",
// });

torii.poseidonHash(["1"]);

torii.createProvider("http://localhost:5050");

export default {
    port: 7070,
    fetch: app.fetch,
};
