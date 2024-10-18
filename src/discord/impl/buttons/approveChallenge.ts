import { get as getChallenge } from "../../../database/impl/tables/challenges/impl/get";
import { getByGuildId as getGuild } from "../../../database/impl/tables/guilds/impl/get";
import { EmbedBuilder, type Interaction } from "discord.js";
import type { Button } from "../../../types/impl/discord";
import { colors } from "../..";

export default {
    id: "approve-challenge",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        await interaction.deferReply({ ephemeral: true });

        const guild = await getGuild({
            guild_id: interaction.guildId ?? "",
        });

        if (!guild) {
            const embed = new EmbedBuilder().setDescription("The guild for the provided challenge does not exist.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const challengeId = interaction.customId.split(":")[1];
        const challenge = await getChallenge({
            id: challengeId,
        });

        if (!challenge) {
            const embed = new EmbedBuilder().setDescription("The challenge you are trying to approve does not exist.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }
    },
} as Button;
