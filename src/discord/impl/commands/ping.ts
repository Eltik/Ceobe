import { ApplicationCommandDataResolvable, Interaction, PermissionFlagsBits } from "discord.js";

export default {
    name: "ping",
    description: "Ping!",
    options: [],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    execute: async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            const responses = ["Dadadada!", "Gooooooo!", "Haah!", "Prey should stay still!"]
            await interaction.reply(responses[Math.floor(Math.random() * responses.length)]);
        } else {
            return;
        }
    },
} as ApplicationCommandDataResolvable;
