import { get as getChallenge } from "../../../database/impl/tables/challenges/impl/get";
import { getByGuildId as getGuild } from "../../../database/impl/tables/guilds/impl/get";
import { getByDiscordId as getUser } from "../../../database/impl/tables/users/impl/get";
import { create as createUser } from "../../../database/impl/tables/users/impl/create";
import { update as updateUser } from "../../../database/impl/tables/users/impl/update";
import { EmbedBuilder, type Interaction } from "discord.js";
import type { Button } from "../../../types/impl/discord";
import { colors } from "../..";
import { RoleType } from "../../../types/impl/database/impl/guilds";
import { awardExperience, EXPERIENCE_PER_CHALLENGE } from "../../../lib/impl/leveling";

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

        const moderatorRole = guild.roles.filter((role) => role.type === RoleType.MODERATOR_ROLE)[0]?.id;
        if (moderatorRole) {
            if (Array.isArray(interaction.member?.roles)) {
                if (!interaction.member.roles.includes(moderatorRole)) {
                    const embed = new EmbedBuilder().setDescription("You do not have permission to approve challenges.").setColor(colors.errorColor);
                    return await interaction.editReply({ embeds: [embed] });
                }
            } else if (!interaction.member?.roles.cache.has(moderatorRole)) {
                const embed = new EmbedBuilder().setDescription("You do not have permission to approve challenges.").setColor(colors.errorColor);
                return await interaction.editReply({ embeds: [embed] });
            }
        }

        const challengeId = interaction.customId.split(":")[1];
        const userId = interaction.customId.split(":")[2];

        const challenge = await getChallenge({
            id: challengeId,
        });

        if (!challenge) {
            const embed = new EmbedBuilder().setDescription("The challenge you are trying to approve does not exist.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const user = await getUser({
            user_id: userId,
        });

        if (!user) {
            await createUser({
                guild_id: interaction.guildId ?? "",
                user_id: userId,
                submitted_challenges: [challengeId],
                exp: EXPERIENCE_PER_CHALLENGE,
            });
        } else {
            const awardedExperience = awardExperience(user.exp, user.level, EXPERIENCE_PER_CHALLENGE);
            if (user.submitted_challenges && Array.isArray(user.submitted_challenges)) {
                await updateUser({
                    id: user.id,
                    exp: awardedExperience.userExperience,
                    level: awardedExperience.userLevel,
                    submitted_challenges: [...user.submitted_challenges, challengeId],
                });
            } else {
                await updateUser({
                    id: user.id,
                    exp: awardedExperience.userExperience,
                    level: awardedExperience.userLevel,
                    submitted_challenges: [challengeId],
                });
            }

            if (awardedExperience.levelUps > 0) {
                const levelUpEmbed = new EmbedBuilder().setTitle("Level Up!").setDescription(`Congratulations, <@${userId}>! You have leveled up to level ${awardedExperience.userLevel}.`).setColor(colors.successColor).setTimestamp();
                await interaction.followUp({ embeds: [levelUpEmbed], content: `<@${userId}>` });
            }
        }

        const challengeMessage = await interaction.message;
        if (challengeMessage) {
            const clearLink = challengeMessage.embeds[0].fields.find((field) => field.name === "Clear Link")?.value;
            const embed = new EmbedBuilder()
                .setTitle(challengeMessage.embeds[0].title)
                .setDescription(`${challengeMessage.embeds[0].description}\n${clearLink ?? "No link provided."}`)
                .setImage(challengeMessage.embeds[0].image?.url || "")
                .setColor(colors.baseColor)
                .setTimestamp();
            await challengeMessage.edit({ embeds: [embed], components: [], content: interaction.message.content ?? "" });
        }

        const embed = new EmbedBuilder().setDescription(`Successfully approved challenge for <@${userId}>`).setColor(colors.successColor);
        return await interaction.editReply({ embeds: [embed] });
    },
} as Button;
