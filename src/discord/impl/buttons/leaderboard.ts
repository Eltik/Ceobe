import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, type Interaction } from "discord.js";
import type { Button } from "../../../types/impl/discord";
import { leaderboard } from "../../../database/impl/tables/users/impl/leaderboard";

export default {
    id: "leaderboard",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        await interaction.deferUpdate();

        const id = interaction.customId;

        const page = id.split(":")[1];
        const type = id.split(":")[3];

        if (page === "0" || isNaN(parseInt(page))) {
            return;
        }

        const data = await leaderboard({
            guild_id: interaction.guildId!,
            limit: 10,
            offset: (parseInt(page) - 1) * 10,
            sort_by: type as "level" | "exp" | "submitted_challenges",
        });

        if (!data || data.length === 0) {
            return;
        }

        const previousPageButton = new ButtonBuilder()
            .setCustomId(`leaderboard:${String(parseInt(page) - 1)}:previous:${type}`)
            .setLabel("Previous Page")
            .setStyle(ButtonStyle.Success)
            .setDisabled(parseInt(page) === 1);
        const nextPageButton = new ButtonBuilder()
            .setCustomId(`leaderboard:${String(parseInt(page) + 1)}:next:${type}`)
            .setLabel("Next Page")
            .setStyle(ButtonStyle.Success)
            .setDisabled(data.length < 10);

        const actionBuilder = new ActionRowBuilder().addComponents(previousPageButton, nextPageButton);

        const embed = new EmbedBuilder().setTitle(interaction.message.embeds[0]?.title ?? "").setColor(interaction.message.embeds[0]?.color ?? null);

        let description = "```";

        for (let i = 0; i <= 10; i++) {
            if (!data[i]) break;

            const user = await interaction.client.users.fetch(data[i].user_id);
            const p = i + 1 + 10 * (parseInt(page) - 1);

            switch (type) {
                case "level":
                    description += `${p.toString().padEnd(3, " ")}${user.username.toString().padEnd(17, " ")} ${Math.round(data[i].level).toString().padEnd(4, " ")}\n`;
                    break;
                case "exp":
                    description += `${p.toString().padEnd(3, " ")}${user.username.toString().padEnd(17, " ")} ${Math.round(data[i].exp).toString().padEnd(4, " ")}\n`;
                    break;
                case "submitted_challenges":
                    description += `${p.toString().padEnd(3, " ")}${user.username.toString().padEnd(17, " ")} ${data[i].submitted_challenges.length.toString().padEnd(4, " ")}\n`;
                    break;
                default:
                    break;
            }
        }

        description += "```";

        embed.setDescription(description);
        embed.setFooter({ text: `Page ${parseInt(page)}` });

        await interaction.message.edit({ embeds: [embed], components: [actionBuilder as ActionRowBuilder<ButtonBuilder>] });
    },
} as Button;
