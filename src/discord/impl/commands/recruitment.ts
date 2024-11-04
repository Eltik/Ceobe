import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { get, rarity, tagValues } from "../../../lib/impl/gacha/impl/get";
import { colors } from "../..";
import type { Operator } from "../../../types/impl/lib/impl/operators";
import { capitalize } from "../../../lib/impl/helper";

const choices = Object.keys(tagValues)
    .filter((tag) => tag && tag.length > 0 && !tag.includes("TIER") && tag !== "top" && tag !== "senior" && tag !== "starter" && tag !== "robot") // Discord can't handle more than 25 choices :despair:
    .filter(Boolean)
    .map((tag) => {
        return { name: tag, value: tag };
    });

export default {
    data: new SlashCommandBuilder()
        .setName("recruitment")
        .setDescription("Recruitment calculator.")
        .addStringOption((option) => option.setName("tag1").setDescription("Tag 1.").addChoices(choices))
        .addStringOption((option) => option.setName("tag2").setDescription("Tag 2.").addChoices(choices))
        .addStringOption((option) => option.setName("tag3").setDescription("Tag 3.").addChoices(choices))
        .addStringOption((option) => option.setName("tag4").setDescription("Tag 4.").addChoices(choices))
        .addStringOption((option) => option.setName("tag5").setDescription("Tag 5.").addChoices(choices)),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        await interaction.deferReply();

        const placeholders = [await interaction.editReply("Loading...")];

        const tags = [interaction.options.get("tag1")?.value as string, interaction.options.get("tag2")?.value as string, interaction.options.get("tag3")?.value as string, interaction.options.get("tag4")?.value as string, interaction.options.get("tag5")?.value as string].filter(
            (tag) => tag && tag.length > 0,
        );

        const recruitEmbed = new EmbedBuilder().setColor(colors.baseColor).setTitle("Recruitment Calculator");

        const data = await get(tags);
        const reverseFormattedResult = (formattedResult: { tags: string; operators: Operator[] }[]) => {
            const sortArr: [string, Operator[]][] = formattedResult.map((entry) => {
                return [entry.tags, entry.operators];
            });
            return sortArr;
        };

        const sortArr = reverseFormattedResult(data);

        let combCount = 0;
        for (const opArr of sortArr) {
            let opCount = 0,
                opString = "";
            for (const op of opArr[1]) {
                if (opCount < 12) {
                    opString += `${rarity[op.rarity] + 1}★ ${op.name}\n`;
                }
                opCount++;
            }
            if (combCount < 6) {
                opString = opCount >= 13 ? `${opString}${opCount - 12} more...` : opString;
                recruitEmbed.addFields({ name: capitalize(opArr[0]), value: opString, inline: true });
            }
            combCount++;
        }

        await placeholders[0].edit({ content: "", embeds: [recruitEmbed] });
    },
} as Command;
