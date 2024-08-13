import { ApplicationCommandDataResolvable, ApplicationCommandOptionType, Interaction, PermissionFlagsBits } from "discord.js";
import { createGuild } from "../../../database/impl/guilds/impl/create";
import { getGuild } from "../../../database/impl/guilds/impl/get";
import { editGuild } from "../../../database/impl/guilds/impl/edit";

export default {
    name: "create-guild",
    description: "Create's a guild.",
    options: [
        {
            name: "daily-channel",
            description: "The channel to send daily challenges to.",
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "submissions-channel",
            description: "The channel to submit daily challenges to.",
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    execute: async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await interaction.deferReply({ ephemeral: true });

            const exists = await getGuild(interaction.guildId ?? "");

            const dailyChannel = interaction.options.get("daily-channel");
            const submissionsChannel = interaction.options.get("submissions-channel");

            if (!dailyChannel || !dailyChannel.channel) {
                return interaction.editReply("You must provide a daily channel.");
            }

            if (!submissionsChannel || !submissionsChannel.channel) {
                return interaction.editReply("You must provide a submissions channel.");
            }

            const moderatorRoleId = "";

            try {
                if (exists != null) {
                    await editGuild(interaction.guildId ?? "", dailyChannel.channel.id, submissionsChannel.channel.id, moderatorRoleId);
                } else {
                    await createGuild(interaction.guildId ?? "", dailyChannel.channel.id, submissionsChannel.channel.id, moderatorRoleId);
                }
                return interaction.editReply(`Guild created with daily channel <#${dailyChannel.channel.id}>, submissions channel <#${submissionsChannel.channel.id}>, and moderator role <@&${moderatorRoleId}>.`);
            } catch (e) {
                console.error(e);
                return interaction.editReply("An error occurred while creating the guild.");
            }
        } else {
            return;
        }
    },
} as ApplicationCommandDataResolvable;
