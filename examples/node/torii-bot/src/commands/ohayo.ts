import { Command } from "@sapphire/framework";
import { ragChain } from "../models/loaders/utils.js";
import { generateImage, getText } from "../models/dalle/index.js";
import fs from "fs";
import fetch from "node-fetch";

const downloadImage = async (url: string, path: string) => {
    const response = await fetch(url);
    const buffer = await response.buffer();
    fs.writeFileSync(path, buffer);
};

export class Ohayo extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, { ...options, description: "Ask sensei" });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder //
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((builder) =>
                    builder //
                        .setName("question")
                        .setDescription("Ask Sensei a Question")
                        .setRequired(true)
                )
        );
    }

    public override async chatInputRun(
        interaction: Command.ChatInputCommandInteraction
    ) {
        const query = interaction.options.getString("question");

        await interaction.deferReply();

        console.log("response", query);

        if (query == "ohayo") {
            await generateImage((await getText()) || "").then((image: any) => {
                downloadImage(image[0].url, "test" + ".png").then(() => {
                    return interaction.editReply({
                        files: ["test" + ".png"],
                    });
                });
            });
        } else {
            const response = await ragChain.invoke(query);

            return interaction.editReply({
                content: "**" + query + "**: " + response,
            });
        }
    }
}
