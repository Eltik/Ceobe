import { ApplicationCommandDataResolvable, ApplicationCommandOptionType, EmbedBuilder, Interaction, PermissionFlagsBits } from "discord.js";
import { getGuild } from "../../../database/impl/guilds/impl/get";

export default {
    name: "submit-challenge",
    description: "Submits a daily challenge.",
    options: [
        {
            name: "title",
            description: "The title of your submission.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "description",
            description: "Description of your clear.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "file",
            description: "Image or video of your clear.",
            type: ApplicationCommandOptionType.Attachment,
            required: true,
        },
    ],
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    execute: async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await interaction.deferReply({ ephemeral: true });

            const guild = await getGuild(interaction.guildId ?? "");
            if (!guild) {
                return interaction.editReply("Guild does not exist. Create a guild using `/create-guild`.");
            }

            const title = interaction.options.get("title");
            const description = interaction.options.get("description");
            const file = interaction.options.get("file");

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

            if (!file) {
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply("You must provide a valid file.");
                return;
            }

            if (
                !file.attachment?.name.toLowerCase().endsWith(".jpg") &&
                !file.attachment?.name.toLowerCase().endsWith(".heic") &&
                !file.attachment?.name.toLowerCase().endsWith(".png") &&
                !file.attachment?.name.toLowerCase().endsWith(".jpeg") &&
                !file.attachment?.name.toLowerCase().endsWith(".gif") &&
                !file.attachment?.name.toLowerCase().endsWith(".mp4") &&
                !file.attachment?.name.toLowerCase().endsWith(".mov") &&
                !file.attachment?.name.toLowerCase().endsWith(".mkv")
            ) {
                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply("You must provide a valid file with the format of `.jpg`, `.jpeg`, `.heic`, `.png`, `.gif`, `.mp4`, `.mov`, or `.mkv`.");
                return;
            }

            try {
                const guild = await getGuild(interaction.guildId ?? "");
                if (!guild) {
                    await interaction.deferReply({ ephemeral: true });
                    await interaction.editReply("An error occurred while fetching the guild.");
                    return;
                }

                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(title.value as string)
                    .setAuthor({ name: "Daily Challenge", iconURL: "https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/char_2013_cerber_whirlwind%232.png", url: "https://aceship.github.io/AN-EN-Tags/akhrchars.html?opname=Ceobe" })
                    .setDescription(description.value as string)
                    .setFooter({ text: "Submitted by: " + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

                const channel = await interaction.client.channels.cache.get(guild.submissions_channel_id);
                if (!channel) {
                    const channel = await interaction.guild!.channels.fetch(guild.submissions_channel_id);
                    if (!channel?.isTextBased()) {
                        return interaction.editReply("Daily challenge channel is not a text channel.");
                    } else {
                        channel?.send({ embeds: [embed], files: [file.attachment] });
                    }
                } else if (channel?.isTextBased()) {
                    channel.send({ embeds: [embed], files: [file.attachment] });
                } else {
                    return interaction.editReply("Daily challenge channel is not a text channel. Run `/create-guild` again to edit the channel.");
                }

                console.log(`Submission sent by ${interaction.user.username} in guild ${guild.guild_id}.`);

                await interaction.deferReply({ ephemeral: true });
                await interaction.editReply("Submission has been sent.");
            } catch (e) {
                console.error(e);
                return interaction.editReply("An error occurred while submitting the daily challenge.");
            }
        } else {
            return;
        }
    },
} as ApplicationCommandDataResolvable;
