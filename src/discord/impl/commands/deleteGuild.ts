import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { getByGuildId as getGuild } from "../../../database/impl/tables/guilds/impl/get";
import { colors } from "../..";

export default {
    data: new SlashCommandBuilder().setName("delete-guild").setDescription("Deletes the current guild.").setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const guild = await getGuild({
            guild_id: interaction.guildId ?? "",
        });
        if (!guild) {
            const embed = new EmbedBuilder().setDescription("The guild does not exist.").setColor(colors.errorColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new EmbedBuilder().setDescription("Are you sure you want to delete the guild?").setColor(colors.successColor);
        const yes = new ButtonBuilder().setCustomId(`delete-guild:${interaction.user.id}`).setLabel("Delete").setStyle(ButtonStyle.Danger);

        const actionBuilder = new ActionRowBuilder().addComponents(yes);
        return await interaction.reply({ embeds: [embed], components: [actionBuilder as ActionRowBuilder<any>], ephemeral: true });
    },
} as Command;
