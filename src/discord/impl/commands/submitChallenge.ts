import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Interaction, TextChannel } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { getByGuildId as getGuild } from "../../../database/impl/tables/guilds/impl/get";
import { get as getChallenge } from "../../../database/impl/tables/challenges/impl/get";
import { getLatestChallenge } from "../../../database/impl/tables/challenges/impl/get";
import { colors } from "../..";
import { ChannelType } from "../../../types/impl/database/impl/guilds";

export default {
    data: new SlashCommandBuilder()
        .setName("submit-challenge")
        .setDescription("Submits a challenge.")
        .addAttachmentOption((option) => option.setName("clear-file").setDescription("Direct image or video of your clear."))
        .addStringOption((option) => option.setName("clear-link").setDescription("A link to an image or video of your clear."))
        .addStringOption((option) => option.setName("challenge-id").setDescription("The challenge ID.")),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        await interaction.deferReply({ ephemeral: true });

        const challengeId = interaction.options.get("challenge-id")?.value as string;

        const challenge = challengeId
            ? await getChallenge({
                  id: challengeId,
              })
            : await getLatestChallenge();
        if (!challenge) {
            const embed = new EmbedBuilder().setDescription("The provided challenge does not exist.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const guild = await getGuild({
            guild_id: challenge.guild_id,
        });

        if (!guild) {
            const embed = new EmbedBuilder().setDescription("The guild for the provided challenge does not exist.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const clearLink = interaction.options.get("clear-link")?.value as string;
        const clearFile = interaction.options.get("clear-file");

        if (!clearLink && !clearFile) {
            const embed = new EmbedBuilder().setDescription("Please provide a clear link or file. Use either the `clear-file` or `clear-link` option, providing either a direct link to your clear or uploading an image/video of the clear.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const challengeSubmission = new EmbedBuilder()
            .setTitle("Challenge Submission")
            .setDescription(`Submitted by <@${interaction.user.id}>`)
            .addFields({
                name: "Challenge ID",
                value: `\`${challenge.id}\``,
            })
            .addFields({
                name: "Guild ID",
                value: `\`${guild.id}\``,
            })
            .addFields({
                name: "Clear Link",
                value: clearLink || "No link provided.",
            })
            .setColor(colors.baseColor)
            .setTimestamp();

        const isImage =
            (clearFile?.attachment?.name || "").toLowerCase().endsWith(".jpg") ||
            (clearFile?.attachment?.name || "").toLowerCase().endsWith(".heic") ||
            (clearFile?.attachment?.name || "").toLowerCase().endsWith(".png") ||
            (clearFile?.attachment?.name || "").toLowerCase().endsWith(".jpeg") ||
            (clearFile?.attachment?.name || "").toLowerCase().endsWith(".gif") ||
            (clearLink || "").toLowerCase().endsWith(".jpg") ||
            (clearLink || "").toLowerCase().endsWith(".heic") ||
            (clearLink || "").toLowerCase().endsWith(".png") ||
            (clearLink || "").toLowerCase().endsWith(".jpeg") ||
            (clearLink || "").toLowerCase().endsWith(".gif");
        const isVideo =
            (clearFile?.attachment?.name || "").toLowerCase().endsWith(".mp4") ||
            (clearFile?.attachment?.name || "").toLowerCase().endsWith(".mov") ||
            (clearFile?.attachment?.name || "").toLowerCase().endsWith(".avi") ||
            (clearFile?.attachment?.name || "").toLowerCase().endsWith(".webm") ||
            (clearLink || "").toLowerCase().endsWith(".mp4") ||
            (clearLink || "").toLowerCase().endsWith(".mov") ||
            (clearLink || "").toLowerCase().endsWith(".avi") ||
            (clearLink || "").toLowerCase().endsWith(".webm");

        if (clearFile) {
            if (!isImage && !isVideo) {
                const embed = new EmbedBuilder().setDescription("The provided file is not a valid image or video.").setColor(colors.errorColor);
                return await interaction.editReply({ embeds: [embed] });
            }
            try {
                challengeSubmission.setImage(clearFile.attachment?.url || "");
            } catch {
                const embed = new EmbedBuilder().setDescription("The provided file is too large. You can upload it to YouTube, Imgur, etc. and use the `clear-link` option instead. **Max file size is ~50mb.**").setColor(colors.errorColor);
                return await interaction.editReply({ embeds: [embed] });
            }
        }

        if (clearLink) {
            if (!isImage && !isVideo) {
                const embed = new EmbedBuilder().setDescription("The provided link is not a valid image or video.").setColor(colors.errorColor);
                return await interaction.editReply({ embeds: [embed] });
            }

            challengeSubmission.setImage(clearLink);
        }

        const channel = interaction.guild?.channels.cache.get(guild.channels.find((c) => c.type === ChannelType.SUBMISSIONS_CHANNEL)?.id || "");
        if (!channel) {
            const embed = new EmbedBuilder().setDescription("The submissions channel for the provided guild does not exist.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const approve = new ButtonBuilder().setCustomId(`approve-challenge:${challenge.id}:${interaction.user.id}`).setLabel("Approve").setStyle(ButtonStyle.Success);
        const deny = new ButtonBuilder().setCustomId(`deny-challenge:${challenge.id}:${interaction.user.id}`).setLabel("Deny").setStyle(ButtonStyle.Danger);

        const actionBuilder = new ActionRowBuilder().addComponents(approve, deny);

        try {
            await (channel as TextChannel).send({ embeds: [challengeSubmission], components: [actionBuilder as ActionRowBuilder<any>], files: isVideo && clearFile ? [clearFile.attachment!] : [] });
        } catch {
            const embed = new EmbedBuilder().setDescription("The provided file is too large. You can upload it to YouTube, Imgur, etc. and use the `clear-link` option instead. **Max file size is ~50mb.**").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        const embed = new EmbedBuilder().setDescription("Challenge submitted!").setColor(colors.successColor);
        await interaction.editReply({ embeds: [embed] });
    },
} as Command;
