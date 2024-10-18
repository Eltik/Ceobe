import { getByGuildId as getGuild } from "../../../database/impl/tables/guilds/impl/get";
import { deleteItem as deleteGuild } from "../../../database/impl/tables/guilds/impl/delete";
import { EmbedBuilder, type Interaction } from "discord.js";
import type { Button } from "../../../types/impl/discord";
import { colors } from "../..";

export default {
    id: "delete-guild",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        await interaction.deferReply({ ephemeral: true });

        const userId = interaction.customId.split(":")[1];
        if (userId !== interaction.user.id) {
            const embed = new EmbedBuilder().setDescription("You are not allowed to delete this guild.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const guild = await getGuild({
            guild_id: interaction.guildId ?? "",
        });

        if (!guild) {
            const embed = new EmbedBuilder().setDescription("The guild to delete does not exist.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        try {
            await deleteGuild({
                id: guild.id,
            });

            const embed = new EmbedBuilder().setDescription("The guild has been deleted.").setColor(colors.successColor);
            return await interaction.editReply({ embeds: [embed] });
        } catch {
            const embed = new EmbedBuilder().setDescription("Failed to delete the guild.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }
    },
} as Button;
