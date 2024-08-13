import emitter, { Events } from "..";
import colors from "colors";

export const listener = async () => {
    emitter.on(Events.DATABASE_CONNECT, async () => {
        console.log(colors.green("Database connected!"));
    });

    emitter.on(Events.DATABASE_INITIATED, async () => {
        console.log(colors.green("Initiated database!"));
    });

    emitter.on(Events.DATABASE_GUILD_CREATE, async (data) => {
        console.log(colors.gray(`Created guild for guild ${data.guildId} with daily channel ID ${data.dailyChannelId}, submissions channel ID ${data.submissionsChannelId}, and moderator role ID ${data.moderatorRole}`));
    });

    emitter.on(Events.DATABASE_GUILD_EDIT, async (data) => {
        console.log(colors.gray(`Edited guild for guild ${data.guildId} with daily channel ID ${data.dailyChannelId}, submissions channel ID ${data.submissionsChannelId}, and moderator role ID ${data.moderatorRole}`));
    });

    emitter.on(Events.DATABASE_PLAYER_CREATE, async (data) => {
        console.log(colors.gray(`Created user for guild ${data.guildId} with user ID ${data.userId}`));
    });

    emitter.on(Events.DISCORD_READY, async () => {
        console.log(colors.green("Discord bot is ready!"));
    });

    emitter.on(Events.DISCORD_COMMAND_REGISTER, async (data) => {
        console.log(colors.gray(`Command registered: ${data.name}`));
    });
};
