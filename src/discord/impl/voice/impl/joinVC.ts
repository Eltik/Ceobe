import { ChannelType, Client } from "discord.js";
import { joinVoiceChannel, VoiceConnection } from "@discordjs/voice";

export const joinVC = async (client: Client, channelId: string): Promise<VoiceConnection | null> => {
    const channel = await client.channels.fetch(channelId);
    if (!channel) return null;

    if (channel.type === ChannelType.GuildVoice) {
        const connection = joinVoiceChannel({
            // @ts-expect-error Currently voice is built in mind with API v10 whereas discord.js v13 uses API v9.
            adapterCreator: channel.guild.voiceAdapterCreator,
            channelId: channel.id,
            guildId: channel.guild.id,
        });

        return connection;
    }

    return null;
};
