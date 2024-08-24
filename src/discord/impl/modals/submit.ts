import { EmbedBuilder, Interaction } from "discord.js";
import { getGuild } from "../../../database/impl/guilds/impl/get";

export default {
    id: "submit",
    execute: async (interaction: Interaction) => {
        if (interaction.isModalSubmit()) {
            const id = interaction.customId;
            const buttonId = id.split("submit-")[1];

            const title = interaction.fields.getTextInputValue(`submit-${buttonId}-title`);
            const description = interaction.fields.getTextInputValue(`submit-${buttonId}-description`);
            const imageURL = interaction.fields.getTextInputValue(`submit-${buttonId}-image`);

            if (!title) {
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply("You must provide a valid title.");
                return;
            }

            if (!description) {
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply("You must provide a valid description.");
                return;
            }

            if (!imageURL) {
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply("You must provide an image URL.");
                return;
            } else {
                try {
                    new URL(imageURL);
                } catch {
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply("You must provide a valid image URL.");
                    return;
                }
            }

            const guild = await getGuild(interaction.guildId ?? "");
            if (!guild) {
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply("An error occurred while fetching the guild.");
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(title)
                .setAuthor({ name: "Daily Challenge", iconURL: "https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/char_2013_cerber_whirlwind%232.png", url: "https://aceship.github.io/AN-EN-Tags/akhrchars.html?opname=Ceobe" })
                .setDescription(description)
                .setFooter({ text: "Submitted by: " + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            const channel = await interaction.client.channels.cache.get(guild.submissions_channel_id);
            if (!channel) {
                const channel = await interaction.guild!.channels.fetch(guild.submissions_channel_id);
                if (!channel?.isTextBased()) {
                    return interaction.editReply("Daily challenge channel is not a text channel.");
                } else {
                    channel?.send({ embeds: [embed], content: imageURL });
                }
            } else if (channel?.isTextBased()) {
                channel.send({ embeds: [embed], content: imageURL });
            } else {
                return interaction.editReply("Daily challenge channel is not a text channel. Run `/create-guild` again to edit the channel.");
            }

            console.log(`Submission sent by ${interaction.user.username} in guild ${guild.guild_id}.`);

            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply("Submission has been sent.");
        }
    },
};
