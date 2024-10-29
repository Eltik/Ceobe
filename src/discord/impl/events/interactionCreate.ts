import type { Interaction } from "discord.js";
import type { Event } from "../../../types/impl/discord";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import colors from "colors";

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

                console.log(colors.gray(`[COMMAND] ${commandName}`));

                await command.default.execute(interaction);
                break;
            }
        } else if (interaction.isAutocomplete()) {
            const { commandName } = interaction;

            const commands = readdirSync(join(import.meta.dir, "../commands")).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

            for (const file of commands) {
                const command = await import(join(import.meta.dir, `../commands/${file}`));
                if (command.default.data.name !== commandName) {
                    continue;
                }

                await command.default.autocomplete(interaction);
                break;
            }
        } else if (interaction.isButton()) {
            const { customId } = interaction;

            const buttons = readdirSync(join(import.meta.dir, "../buttons")).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

            for (const file of buttons) {
                const button = await import(join(import.meta.dir, `../buttons/${file}`));

                if (!customId.startsWith(button.default.id)) {
                    continue;
                }

                await button.default.execute(interaction);
                break;
            }
        } else if (interaction.isStringSelectMenu()) {
            const { customId } = interaction;

            const menus = readdirSync(join(import.meta.dir, "../menus")).filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

            for (const file of menus) {
                const menu = await import(join(import.meta.dir, `../menus/${file}`));

                if (!customId.startsWith(menu.default.id)) {
                    continue;
                }

                await menu.default.execute(interaction);
                break;
            }
        }
    },
} as Event;
