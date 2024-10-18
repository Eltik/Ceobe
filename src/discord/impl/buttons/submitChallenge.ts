import { get as getChallenge } from "../../../database/impl/tables/challenges/impl/get";
import { EmbedBuilder, type Interaction } from "discord.js";
import type { Button } from "../../../types/impl/discord";
import { colors } from "../..";

export default {
    id: "submit-challenge",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        await interaction.deferReply({ ephemeral: true });

        const challengeId = interaction.customId.split(":")[1];
        const challenge = await getChallenge({
            id: challengeId,
        });

        if (!challenge) {
            const embed = new EmbedBuilder().setDescription("The challenge you are trying to submit does not exist.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder().setDescription("Submitting challenges via buttons doesn't work at the moment. Please use `/submit-challenge` for now.").setColor(colors.errorColor);
        await interaction.editReply({ embeds: [embed] });
    },
} as Button;
