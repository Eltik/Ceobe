import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { colors } from "../..";
import { leaderboard } from "../../../database/impl/tables/users/impl/leaderboard";

export default {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Displays the leaderboard of the current server.")
        .addIntegerOption((option) => option.setName("page").setDescription("The page of the leaderboard to display."))
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("The type of leaderboard to display.")
                .addChoices([
                    {
                        name: "Level",
                        value: "level",
                    },
                    {
                        name: "Experience",
                        value: "exp",
                    },
                    {
                        name: "Submitted Challenges",
                        value: "submitted_challenges",
                    },
                ]),
        ),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        await interaction.deferReply();

        const page = interaction.options.get("page") ? (interaction.options.get("page")?.value as number) : 1;
        const type = interaction.options.get("type") ? (interaction.options.get("type")?.value as string) : "level";

        if ((page !== 0 && page < 0) || isNaN(page)) {
            const embed = new EmbedBuilder().setColor(colors.errorColor).setDescription("You need to provide a valid page number.");
            return interaction.editReply({ embeds: [embed] });
        }

        const data = await leaderboard({
            guild_id: interaction.guildId!,
            limit: 10,
            offset: (page - 1) * 10,
            sort_by: type as "level" | "exp" | "submitted_challenges",
        });

        if (!data || data.length === 0) {
            const embed = new EmbedBuilder().setDescription("No users found for that page.").setColor(colors.errorColor);
            return await interaction.editReply({ embeds: [embed] });
        }

        try {
            const embed = new EmbedBuilder()
                .setTitle(`Leaderboard - ${(type.charAt(0).toUpperCase() + type.slice(1)).replaceAll("_", " ")}`)
                .setColor(colors.baseColor)
                .setFooter({ text: `Page ${page + 1}` })
                .setTimestamp();

            let description = "```";

            for (let i = 0; i < data.length; i++) {
                const user = await interaction.client.users.fetch(data[i].user_id);
                switch (type) {
                    case "level":
                        description += `${(i + 1).toString().padEnd(3, " ")}${user.username.toString().padEnd(17, " ")} ${Math.round(data[i].level).toString().padEnd(4, " ")}\n`;
                        break;
                    case "exp":
                        description += `${(i + 1).toString().padEnd(3, " ")}${user.username.toString().padEnd(17, " ")} ${Math.round(data[i].exp).toString().padEnd(4, " ")}\n`;
                        break;
                    case "submitted_challenges":
                        description += `${(i + 1).toString().padEnd(3, " ")}${user.username.toString().padEnd(17, " ")} ${data[i].submitted_challenges.length.toString().padEnd(4, " ")}\n`;
                        break;
                    default:
                        break;
                }
            }

            embed.setDescription(description + "```");

            const previousPageButton = new ButtonBuilder()
                .setCustomId(`leaderboard:${page - 1}:previous:${type}`)
                .setLabel("Previous Page")
                .setStyle(ButtonStyle.Success)
                .setDisabled(page === 1);
            const nextPageButton = new ButtonBuilder()
                .setCustomId(`leaderboard:${page + 1}:next:${type}`)
                .setLabel("Next Page")
                .setStyle(ButtonStyle.Success)
                .setDisabled(data.length < 10);

            const actionBuilder = new ActionRowBuilder().addComponents(previousPageButton, nextPageButton);

            await interaction.editReply({ embeds: [embed], components: [actionBuilder as ActionRowBuilder<ButtonBuilder>] });
        } catch (e) {
            console.error(e);

            const embed = new EmbedBuilder().setDescription("An error occurred while processing the request.").setColor(colors.errorColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
} as Command;
