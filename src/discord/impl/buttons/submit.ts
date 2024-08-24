import { ActionRowBuilder, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export default {
    id: "submit",
    execute: async (interaction: Interaction) => {
        if (interaction.isButton()) {
            const id = interaction.customId;

            const modal = new ModalBuilder().setCustomId(`submit-${id}`).setTitle("Submit Challenge");

            const title = new TextInputBuilder().setCustomId(`submit-${id}-title`).setLabel("Submission Title").setStyle(TextInputStyle.Short).setPlaceholder("Short title of your clear...");
            const description = new TextInputBuilder().setCustomId(`submit-${id}-description`).setLabel("Submission Description").setStyle(TextInputStyle.Paragraph).setPlaceholder("Short description of the submission...");
            const imageURL = new TextInputBuilder().setCustomId(`submit-${id}-image`).setLabel("Image/Video URL").setStyle(TextInputStyle.Short).setPlaceholder("https://example.com/image.jpg").setRequired(true);

            modal.addComponents(new ActionRowBuilder().addComponents(title), new ActionRowBuilder().addComponents(description), new ActionRowBuilder().addComponents(imageURL) as any);

            await interaction.showModal(modal);
        }
    },
};
