import { ApplicationCommandOptionType, Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import { env } from "../env";
import emitter, { Events } from "../events";

export const client = new Client({
    shards: "auto",
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions],
    presence: {
        status: "dnd",
        activities: [{ name: "Ranked Bridge" }],
    },
});

export const commands = [await import("./impl/commands/ping"), await import("./impl/commands/createGuild"), await import("./impl/commands/dailyChallenge")];
export const events = [await import("./impl/events/ready"), await import("./impl/events/interactionCreate"), await import("./impl/events/voiceStateUpdate")];

export const init = async () => {
    await registerEvents();
    await registerCommands();

    await client.login(env.CLIENT_TOKEN);
};

export const registerCommands = async () => {
    const rest = new REST().setToken(env.CLIENT_TOKEN);

    const commandList: SlashCommandBuilder[] = [];

    for (const command of commands) {
        await client.application?.commands.set([command.default]);

        const slashCommand = new SlashCommandBuilder().setName((command.default as { name: string }).name).setDescription((command.default as { description: string }).description);

        if (
            (
                command.default as {
                    options: { name: string; description: string; type: ApplicationCommandOptionType; autocomplete?: boolean; required?: boolean }[];
                }
            ).options.length > 0
        ) {
            for (const option of (
                command.default as {
                    options: { name: string; description: string; type: ApplicationCommandOptionType; autocomplete?: boolean; required?: boolean }[];
                }
            ).options) {
                switch (option.type) {
                    case ApplicationCommandOptionType.String:
                        slashCommand.addStringOption((opt) =>
                            opt
                                .setName(option.name)
                                .setDescription(option.description)
                                .setAutocomplete(option.autocomplete || false)
                                .setRequired(option.required || false),
                        );
                        break;
                    case ApplicationCommandOptionType.Channel:
                        slashCommand.addChannelOption((opt) =>
                            opt
                                .setName(option.name)
                                .setDescription(option.description)
                                .setRequired(option.required || false),
                        );
                        break;
                }
            }
        }

        commandList.push(slashCommand);

        await emitter.emit(Events.DISCORD_COMMAND_REGISTER, command.default);
    }

    if (env.USE_GUILD_COMMANDS) {
        console.log(`Using guild commands for guild ${env.GUILD_ID}`);
        await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), { body: commandList });
    } else {
        await rest.put(Routes.applicationCommands(env.CLIENT_ID), { body: commandList });
    }
};

export const registerEvents = async () => {
    for (const event of events) {
        if (event.default.once) {
            client.once(event.default.name, event.default.execute);
            continue;
        }

        client.on(event.default.name, event.default.execute);
    }
};