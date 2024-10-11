import { Client, GatewayIntentBits } from "discord.js";
import { env } from "../env";
import { registerCommands } from "./impl/setup/registerCommands";
import { registerEvents } from "./impl/setup/registerEvents";

export const colors = {
    baseColor: 0x5ca3f5,
    successColor: 0xbc77fc,
    errorColor: 0xff003c,
};

export const client = new Client({
    shards: "auto",
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions],
    presence: {
        status: "online",
        activities: [{ name: "Dadadada!" }],
    },
});

export const init = async () => {
    await registerEvents();
    await registerCommands();

    await client.login(env.CLIENT_TOKEN);
};
