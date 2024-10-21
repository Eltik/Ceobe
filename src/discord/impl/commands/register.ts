import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { getByDiscordId as getUser } from "../../../database/impl/tables/users/impl/get";
import { create as createUser } from "../../../database/impl/tables/users/impl/create";
import { colors } from "../..";

export default {
    data: new SlashCommandBuilder().setName("register").setDescription("Registers you in the database."),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const user = await getUser({
            user_id: interaction.user.id,
        });

        if (user) {
            const embed = new EmbedBuilder().setDescription("You are already registered!").setColor(colors.errorColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            await createUser({
                guild_id: interaction.guildId ?? "",
                user_id: interaction.user.id,
            });

            const embed = new EmbedBuilder().setDescription("You have been registered!").setColor(colors.successColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error(error);

            const embed = new EmbedBuilder().setDescription("An error occurred while registering you.").setColor(colors.errorColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
} as Command;
