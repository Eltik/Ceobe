import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { search as searchOperators } from "../../../lib/impl/operators/impl/search";
import { search as searchStages } from "../../../lib/impl/stages/impl/search";
import { getByDiscordId as getUser } from "../../../database/impl/tables/users/impl/get";
import { update as updateUser } from "../../../database/impl/tables/users/impl/update";
import { get as getOperator } from "../../../lib/impl/operators/impl/get";
import { get as getStage } from "../../../lib/impl/stages/impl/get";
import { colors } from "../..";

export default {
    data: new SlashCommandBuilder()
        .setName("set-favorite")
        .setDescription("Sets your favorite operator, stage, event, etc.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("operator")
                .setDescription("Sets your favorite operator.")
                .addStringOption((option) => option.setName("operator").setDescription("The operator you want to set as your favorite.").setRequired(true).setAutocomplete(true)),
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("stage")
                .setDescription("Sets your favorite stage.")
                .addStringOption((option) => option.setName("stage").setDescription("The stage you want to set as your favorite.").setRequired(true).setAutocomplete(true)),
        ),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const user = await getUser({
            user_id: interaction.user.id,
        });

        if (!user) {
            const embed = new EmbedBuilder().setDescription("You aren't registered! Please register using `/register` or submit a challenge to get registered.").setColor(colors.errorColor);
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const operator = interaction.options.get("operator")?.value as string;
        const stage = interaction.options.get("stage")?.value as string;

        if (operator) {
            try {
                const data = await getOperator(operator ?? "");

                if (!data) {
                    const embed = new EmbedBuilder().setDescription("The operator you provided doesn't exist.").setColor(colors.errorColor);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const currentFavorites = user.favorites ?? {};
                Object.assign(currentFavorites, {
                    operator: data.id,
                });

                await updateUser({
                    id: user.id,
                    favorites: currentFavorites,
                });

                const embed = new EmbedBuilder().setDescription(`Favorite operator set to ${data?.name}.`).setColor(colors.successColor);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (e) {
                console.error(e);
                const embed = new EmbedBuilder().setDescription("An error occurred while setting your favorite operator.").setColor(colors.errorColor);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } else if (stage) {
            try {
                const data = await getStage(stage ?? "");

                if (!data) {
                    const embed = new EmbedBuilder().setDescription("The stage you provided doesn't exist.").setColor(colors.errorColor);
                    return await interaction.reply({ embeds: [embed], ephemeral: true });
                }

                const currentFavorites = user.favorites ?? {};
                Object.assign(currentFavorites, {
                    stage: data.stageId,
                });

                await updateUser({
                    id: user.id,
                    favorites: currentFavorites,
                });

                const embed = new EmbedBuilder().setDescription(`Favorite stage set to ${data?.code}.`).setColor(colors.successColor);

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (e) {
                console.error(e);
                const embed = new EmbedBuilder().setDescription("An error occurred while setting your favorite stage.").setColor(colors.errorColor);
                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }
        }
    },
    autocomplete: async (interaction: Interaction) => {
        if (interaction.isAutocomplete()) {
            const choiceName = interaction.options.getFocused(true).name;
            if (choiceName === "operator") {
                const operators = await searchOperators(interaction.options.getFocused().toLowerCase());
                return await interaction.respond(
                    operators.slice(0, 25).map((choice) => ({
                        name: choice.name,
                        value: choice.id ?? "",
                    })),
                );
            } else if (choiceName === "stage") {
                const stages = await searchStages(interaction.options.getFocused().toLowerCase());
                return await interaction.respond(
                    stages.slice(0, 25).map((choice) => ({
                        name: choice.code,
                        value: choice.stageId,
                    })),
                );
            }
        }
    },
} as Command;
