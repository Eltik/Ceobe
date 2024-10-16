import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Interaction, TextChannel } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { search } from "../../../lib/impl/stages/impl/search";
import { getByGuildId as getGuild } from "../../../database/impl/tables/guilds/impl/get";
import { create as createChallenge } from "../../../database/impl/tables/challenges/impl/create";
import { get as getStage } from "../../../lib/impl/stages/impl/get";
import { colors } from "../..";
import { ChannelType } from "../../../types/impl/database/impl/guilds";

export default {
    data: new SlashCommandBuilder()
        .setName("create-challenge")
        .setDescription("Creates a challenge for the server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption((option) => option.setName("stage").setDescription("The stage to create a challenge for.").setRequired(true).setAutocomplete(true))
        .addStringOption((option) => option.setName("challenge").setDescription("The description of the challenge.").setRequired(true)),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const stageId = interaction.options.get("stage")?.value as string;
        const challenge = interaction.options.get("challenge")?.value as string;

        const stage = await getStage(stageId);
        if (!stage) {
            const embed = new EmbedBuilder().setDescription("The stage you provided does not exist.").setColor(colors.errorColor);

            return await interaction.reply({ embeds: [embed] });
        }

        const successEmbed = new EmbedBuilder()
            .setTitle("Challenge Created")
            .setDescription(`A challenge has been created for ${stage.code}!`)
            .addFields({
                name: "Description",
                value: challenge,
            })
            .setColor(colors.successColor);

        const name = stage.difficulty === "FOUR_STAR" ? `${stage.code} CM` : stage.diffGroup === "EASY" ? `${stage.code} Easy` : stage.diffGroup === "NORMAL" ? `${stage.code} Normal` : stage.diffGroup === "TOUGH" ? `${stage.code} Adverse` : stage.code;

        /*
         **Name:** \`${stage.name}\`
         **Description:** ||\`${stage.description.replace(/<[^>]*>?/gm, "")}\`||
         **Stage:** \`${stage.code}\`
         */

        const challengeEmbed = new EmbedBuilder()
            .setTitle(`Challenge: ${name}`)
            .setDescription(
                `
                \`\`\`${challenge}\`\`\`
                **Recommended Level:** \`${stage.dangerLevel}\`
                **Zone:** \`${stage.zoneName}\`
            `,
            )
            .setColor(colors.baseColor);

        if (stage.image) challengeEmbed.setImage(stage.image);
        if (stage.unlockCondition.length > 0) {
            const unlockCondition = stage.unlockCondition[0];
            const unlockStage = await getStage(unlockCondition.stageId);
            if (unlockStage) {
                challengeEmbed.addFields({
                    name: "Unlock Condition",
                    value: `Clear \`${unlockStage.code}\``,
                });
            }
        }

        const guild = await getGuild({
            guild_id: interaction.guildId ?? "",
        });

        if (!guild) {
            const embed = new EmbedBuilder().setDescription("You haven't created a guild for this server! Create one using `/create-guild`.").setColor(colors.errorColor);
            return await interaction.reply({ embeds: [embed] });
        }

        const channel = await interaction.guild?.channels.fetch(guild.channels.find((c) => c.type === ChannelType.DAILY_CHANNEL)?.id ?? "");

        const message = await (channel as TextChannel).send({ embeds: [challengeEmbed] });

        const createdChallenge = await createChallenge({
            guild_id: guild.guild_id,
            message_id: message.id,
            stage_name: stage.code,
            stage_data: stage,
        });

        const submitButton = new ButtonBuilder().setCustomId(`submit_challenge_${createdChallenge.id}`).setLabel("Submit Challenge").setStyle(ButtonStyle.Success);

        const actionBuilder = new ActionRowBuilder().addComponents(submitButton);
        await (channel as TextChannel).send({ components: [actionBuilder as ActionRowBuilder<any>] });

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    },
    autocomplete: async (interaction: Interaction) => {
        if (interaction.isAutocomplete()) {
            const focusedValue = interaction.options.getFocused().toLowerCase();
            const stages = await search(focusedValue);

            await interaction.respond(
                stages.slice(0, 25).map((choice) => ({
                    name: choice.difficulty === "FOUR_STAR" ? `${choice.code} CM` : choice.diffGroup === "EASY" ? `${choice.code} Easy` : choice.diffGroup === "NORMAL" ? `${choice.code} Normal` : choice.diffGroup === "TOUGH" ? `${choice.code} Adverse` : choice.code,
                    value: choice.stageId,
                })),
            );
        }
    },
} as Command;
