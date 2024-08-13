import { Interaction } from "discord.js";
import { commands } from "../..";

export default {
    name: "interactionCreate",
    once: false,
    execute: async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            const { commandName } = interaction;

            for (const command of commands) {
                if ((command.default as { name: string }).name !== commandName) {
                    continue;
                }

                await (command.default as any).execute(interaction);
                break;
            }
        } else if (interaction.isAutocomplete()) {
            const name = interaction.commandName;

            for (const command of commands) {
                if ((command.default as { name: string }).name !== name) {
                    continue;
                }

                await (command.default as any).autocomplete(interaction);
                break;
            }
        } else {
            console.log("uh oh");
            return;
        }
    },
};
