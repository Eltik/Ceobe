import { get as getChallenge } from "../../../database/impl/tables/challenges/impl/get";
import { getByGuildId as getGuild } from "../../../database/impl/tables/guilds/impl/get";
import { EmbedBuilder, type Interaction } from "discord.js";
import type { Button } from "../../../types/impl/discord";
import { colors } from "../..";
import { RoleType } from "../../../types/impl/database/impl/guilds";

export default {
    id: "deny-challenge",
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

        const moderatorRole = guild.roles.filter((role) => role.type === RoleType.MODERATOR_ROLE)[0]?.id;
        if (moderatorRole) {
            if (Array.isArray(interaction.member?.roles)) {
                if (!interaction.member.roles.includes(moderatorRole)) {
                    const embed = new EmbedBuilder().setDescription("You do not have permission to deny challenges.").setColor(colors.errorColor);
                    return await interaction.editReply({ embeds: [embed] });
                }
            } else if (!interaction.member?.roles.cache.has(moderatorRole)) {
                const embed = new EmbedBuilder().setDescription("You do not have permission to deny challenges.").setColor(colors.errorColor);
                return await interaction.editReply({ embeds: [embed] });
            }
        }

        const challengeId = interaction.customId.split(":")[1];
        const userId = interaction.customId.split(":")[2];

        const challenge = await getChallenge({
            id: challengeId,
        });

        if (!challenge) {
            const embed = new EmbedBuilder().setDescription("The challenge you are trying to deny does not exist.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const challengeMessage = await interaction.message;
        if (challengeMessage) {
            const clearLink = challengeMessage.embeds[0].fields.find((field) => field.name === "Clear Link")?.value;
            const embed = new EmbedBuilder()
                .setTitle("Challenge Denied")
                .setDescription(`This challenge has been denied.\n${clearLink ?? "No link provided."}`)
                .setImage(challengeMessage.embeds[0].image?.url || "")
                .setColor(colors.errorColor)
                .setAuthor({
                    name: challengeMessage.embeds[0].author?.name || "",
                    iconURL: challengeMessage.embeds[0].author?.iconURL || "",
                    url: challengeMessage.embeds[0].author?.url || "",
                })
                .setTimestamp();
            await challengeMessage.edit({ embeds: [embed], components: [], content: interaction.message.content ?? "" });
        }

        const embed = new EmbedBuilder().setDescription(`Successfully denied challenge for <@${userId}>`).setColor(colors.successColor);
        return await interaction.editReply({ embeds: [embed] });
    },
} as Button;
