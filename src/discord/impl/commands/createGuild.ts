import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { create } from "../../../database/impl/tables/guilds/impl/create";
import { colors } from "../..";

export default {
    data: new SlashCommandBuilder()
        .setName("create-guild")
        .setDescription("Creates a new guild.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption((option) => option.setName("channels").setDescription("A JSON object containing channels obtained from /get-channel.").setRequired(true))
        .addStringOption((option) => option.setName("roles").setDescription("A JSON object containing roles obtained from /get-role.").setRequired(true)),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const channels = JSON.parse(interaction.options.get("channels")?.value as string);
        const roles = JSON.parse(interaction.options.get("roles")?.value as string);

        await create({
            guild_id: interaction.guildId,
            channels,
            roles,
        });

        const embed = new EmbedBuilder().setDescription("The guild has been created successfully.").setColor(colors.successColor);

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
} as Command;
