import emitter, { Events } from "..";
import colors from "colors";

export const listener = async () => {
    emitter.on(Events.DATABASE_CONNECT, async () => {
        console.log(colors.green("Database connected!"));
    });

    emitter.on(Events.DATABASE_INITIATED, async () => {
        console.log(colors.green("Initiated database!"));
    });

    emitter.on(Events.DATABASE_TABLE_CREATE, async (data) => {
        console.log(colors.gray(`Table created: ${data}`));
    });

    emitter.on(Events.DATABASE_GUILDS_CREATE, async (data) => {
        console.log(colors.gray(`Guild created: ${data?.guild_id}`));
    });

    emitter.on(Events.DATABASE_GUILDS_UPDATE, async (data) => {
        console.log(colors.gray(`Guild updated: ${data?.guild_id}`));
    });

    emitter.on(Events.DATABASE_GUILDS_DELETE, async (data) => {
        console.log(colors.gray(`Guild deleted: ${data?.guild_id}`));
    });

    emitter.on(Events.DATABASE_USERS_CREATE, async (data) => {
        console.log(colors.gray(`User created: ${data?.user_id}`));
    });

    emitter.on(Events.DATABASE_USERS_UPDATE, async (data) => {
        console.log(colors.gray(`User updated: ${data?.user_id}`));
    });

    emitter.on(Events.DATABASE_USERS_DELETE, async (data) => {
        console.log(colors.gray(`User deleted: ${data?.user_id}`));
    });

    emitter.on(Events.DISCORD_READY, async () => {
        console.log(colors.green("Discord bot is ready!"));
    });

    emitter.on(Events.DISCORD_COMMAND_REGISTER, async (data) => {
        console.log(colors.gray(`Command registered: ${data.name}`));
    });
};
