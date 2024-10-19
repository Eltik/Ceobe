import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Interaction, TextChannel } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { search } from "../../../lib/impl/stages/impl/search";
import { getByGuildId as getGuild } from "../../../database/impl/tables/guilds/impl/get";
import { create as createChallenge } from "../../../database/impl/tables/challenges/impl/create";
import { get as getStage } from "../../../lib/impl/stages/impl/get";
import { get as getOperator } from "../../../lib/impl/operators/impl/get";
import { colors } from "../..";
import { ChannelType, RoleType } from "../../../types/impl/database/impl/guilds";

export default {
    data: new SlashCommandBuilder()
        .setName("create-challenge")
        .setDescription("Creates a challenge for the server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addStringOption((option) => option.setName("stage").setDescription("The stage to create a challenge for.").setRequired(true).setAutocomplete(true))
        .addStringOption((option) => option.setName("challenge").setDescription("The description of the challenge.").setRequired(true))
        .addStringOption((option) => option.setName("operators").setDescription("A list of operator IDs separated by commas. Used for banning operators."))
        .addStringOption((option) => option.setName("classes").setDescription("A list of classes separated by commas."))
        .addStringOption((option) => option.setName("rarities").setDescription("A list of rarities separated by commas.")),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        await interaction.deferReply({ ephemeral: true });

        const stageId = interaction.options.get("stage")?.value as string;
        const challenge = interaction.options.get("challenge")?.value as string;
        const operators = ((interaction.options.get("operators")?.value as string) ?? "")
            .split(",")
            .map((o) => o.trim())
            .filter((o) => o !== "");
        const classes = ((interaction.options.get("classes")?.value as string) ?? "")
            .split(",")
            .map((c) => c.trim())
            .filter((o) => o !== "");
        const rarities = ((interaction.options.get("rarities")?.value as string) ?? "")
            .split(",")
            .map((r) => parseInt(r.trim()))
            .filter((o) => !isNaN(o));

        const stage = await getStage(stageId);
        if (!stage) {
            const embed = new EmbedBuilder().setDescription("The stage you provided does not exist.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
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

        if (operators.length > 0) {
            const ops = await Promise.all(
                operators.map(async (operator) => {
                    const op = await getOperator(operator);
                    return op;
                }),
            );

            challengeEmbed.addFields({
                name: "Banned Operators",
                value: ops
                    .filter((o) => o?.name !== undefined)
                    .map((o) => o!.name)
                    .join(", "),
            });
        }

        if (classes.length > 0) {
            challengeEmbed.addFields({
                name: "Banned Classes",
                value: classes.join(", "),
            });
        }

        if (rarities.length > 0) {
            challengeEmbed.addFields({
                name: "Banned Rarities",
                value: rarities.join(", "),
            });
        }

        const guild = await getGuild({
            guild_id: interaction.guildId ?? "",
        });

        if (!guild) {
            const embed = new EmbedBuilder().setDescription("You haven't created a guild for this server! Create one using `/create-guild`.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const channel = await interaction.guild?.channels.fetch(guild.channels.find((c) => c.type === ChannelType.DAILY_CHANNEL)?.id ?? "");
        const dailyChallengeRole = guild.roles.find((r) => r.type === RoleType.DAILY_ROLE)?.id;

        const message = await (channel as TextChannel).send({ embeds: [challengeEmbed], content: dailyChallengeRole ? `<@&${dailyChallengeRole}>` : "" });

        const createdChallenge = await createChallenge({
            guild_id: guild.guild_id,
            message_id: message.id,
            stage_name: stage.code,
            stage_data: stage,
            challenge_description: challenge,
            challenge_data: {
                banned_operators: operators,
                banned_classes: classes,
                banned_rarities: rarities,
                banned_tiles: "",
            },
        });

        const submitButton = new ButtonBuilder().setCustomId(`submit-challenge:${createdChallenge.id}`).setLabel("Submit Challenge").setStyle(ButtonStyle.Success);

        const actionBuilder = new ActionRowBuilder().addComponents(submitButton);
        await (channel as TextChannel).send({ components: [actionBuilder as ActionRowBuilder<any>] });

        await interaction.editReply({ embeds: [successEmbed] });
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
