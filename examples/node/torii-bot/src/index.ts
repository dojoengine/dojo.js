import { SapphireClient } from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import { POLL_INTERVAL } from "./config";
import { getMoves } from "./queries/getMoves";

export const client = new SapphireClient({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
    loadMessageCommandListeners: true,
});

console.log("Logging in.....");

await client.login(process.env.DISCORD_TOKEN);

setInterval(getMoves, POLL_INTERVAL * 3);
