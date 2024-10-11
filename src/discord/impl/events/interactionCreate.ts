import type { Interaction } from "discord.js";
import type { Event } from "../../../types/impl/discord";
import { readdirSync } from "node:fs";
import { join } from "node:path";

export default {
    name: "interactionCreate",
    execute: async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            const { commandName } = interaction;

            const commands = readdirSync(join(import.meta.dir, "../commands")).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

            for (const file of commands) {
                const command = await import(join(import.meta.dir, `../commands/${file}`));

                if (command.default.data.name !== commandName) {
                    continue;
                }

                await command.default.execute(interaction);
                break;
            }
        } else if (interaction.isAutocomplete()) {
            const name = interaction.commandName;

            const commands = readdirSync(join(import.meta.dir, "../commands")).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

            for (const file of commands) {
                const command = await import(join(import.meta.dir, `../commands/${file}`));
                if (command.default.name !== name) {
                    continue;
                }

                await command.default.autocomplete(interaction);
                break;
            }
        }
    },
} as Event;
