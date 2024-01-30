import { sdk } from "../config.js";
import { client } from "../index.js";

export const getTransations = async () => {
    try {
        await sdk.getTransations().then((data) => {
            console.log(data);
            client.channels
                .fetch(process.env.DISCORD_CHANNEL_ID || "")
                .then((channel) => {
                    if (channel?.isTextBased()) {
                        channel.send({
                            embeds: [
                                {
                                    color: 0x00ff3c,
                                    title: "Transactions",
                                    description: "new transactions",
                                    timestamp: new Date().toISOString(),
                                },
                            ],
                        });
                    }
                });
        });
    } catch (error) {
        console.error("Fetching error:", error);
        throw error;
    }
};

export const getMoves = async (player: string) => {
    try {
        const { data } = await sdk.getMoves({ player });

        return data;
    } catch (error) {
        console.error("Fetching error:", error);
        throw error;
    }
};
