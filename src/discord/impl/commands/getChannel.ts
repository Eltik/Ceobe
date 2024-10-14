import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Interaction, TextChannel, VoiceChannel } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import type { Channel } from "../../../types/impl/database/impl/guilds";
import { ChannelType } from "../../../types/impl/database/impl/guilds";

export default {
    data: new SlashCommandBuilder()
        .setName("get-channel")
        .setDescription("Generates a JSON object for a channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("The type of channel.")
                .setRequired(true)
                .setChoices([
                    {
                        name: "Daily Channel",
                        value: ChannelType.DAILY_CHANNEL,
                    },
                    {
                        name: "Submissions Channel",
                        value: ChannelType.SUBMISSIONS_CHANNEL,
                    },
                ]),
        )
        .addChannelOption((option) => option.setName("channel").setDescription("The channel to generate a JSON object for.").setRequired(true)),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const type = interaction.options.get("type")?.value as unknown as ChannelType;
        const channel = interaction.options.get("channel")?.channel as unknown as TextChannel | VoiceChannel;

        const data: Channel = {
            id: channel.id,
            metadata: {
                name: channel.name,
            },
            type,
        };

        if (channel.isTextBased()) {
            Object.assign(data.metadata, {
                name: channel.name,
                nsfw: channel.nsfw,
                permissionOverwrites: channel.permissionOverwrites.cache.map((permission) => ({
                    id: permission.id,
                    type: permission.type,
                    allow: permission.allow.toArray(),
                    deny: permission.deny.toArray(),
                })),
                rateLimitPerUser: channel.rateLimitPerUser,
                parentID: channel.parentId,
                position: channel.position,
                flags: channel.flags,
                manageable: channel.manageable,
                deletable: channel.deletable,
                url: channel.isTextBased() ? `https://discord.com/channels/${channel.guild.id}/${channel.id}` : null,
                createdAt: channel.createdAt,
            } as Channel["metadata"]);
        }

        await interaction.reply({ content: "```json\n" + JSON.stringify(data, null, 2) + "```", ephemeral: true });
    },
} as Command;
