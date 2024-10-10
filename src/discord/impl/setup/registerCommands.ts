import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { env } from "../../../env";
import { client } from "../..";
import emitter, { Events } from "../../../events";
import { readdirSync } from "node:fs";
import { join } from "node:path";

export const registerCommands = async () => {
    const rest = new REST().setToken(env.CLIENT_TOKEN);

    const commands = readdirSync(join(import.meta.dir, "../commands")).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    const commandList: SlashCommandBuilder[] = [];

    for (const file of commands) {
        const command = await import(`../../commands/${file}`);
        await client.application?.commands.set([command.default.data]);

        commandList.push(command.default.data);
        await emitter.emit(Events.DISCORD_COMMAND_REGISTER, command.default);
    }

    if (env.USE_GUILD_COMMANDS) {
        console.log(`Using guild commands for guild ${env.GUILD_ID}`);
        await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), { body: commandList });
    } else {
        await rest.put(Routes.applicationCommands(env.CLIENT_ID), { body: commandList });
    }
};
