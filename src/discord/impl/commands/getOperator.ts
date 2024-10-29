import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import type { Interaction } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import { search } from "../../../lib/impl/operators/impl/search";
import { get } from "../../../lib/impl/operators/impl/get";
import { get as getRange } from "../../../lib/impl/ranges/impl/get";
import { colors } from "../..";
import { OperatorProfession } from "../../../types/impl/lib/impl/operators";
import { insertBlackboard } from "../../../lib/impl/operators/impl/helper";
import { removeStyleTags } from "../../../lib/impl/local/impl/helper";
import { buildRangeField } from "../../../lib/impl/ranges/impl/helper";
import { capitalize } from "../../../lib/impl/helper";

export default {
    data: new SlashCommandBuilder()
        .setName("get-operator")
        .setDescription("Get's an Arknights operator and displays their data.")
        .addStringOption((option) => option.setName("operator").setDescription("The operator to get data for.").setRequired(true).setAutocomplete(true)),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const operatorId = interaction.options.get("operator")?.value as string;
        const operator = await get(operatorId);

        if (!operator) {
            const embed = new EmbedBuilder().setDescription("Operator not found.").setColor(colors.errorColor);

            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const avatarImage = `https://raw.githubusercontent.com/yuanyan3060/ArknightsGameResource/main/avatar/${operator.id}.png`;

        const operatorClass =
            operator.profession === OperatorProfession.CASTER
                ? "Caster"
                : operator.profession === OperatorProfession.MEDIC
                  ? "Medic"
                  : operator.profession === OperatorProfession.SNIPER
                    ? "Sniper"
                    : operator.profession === OperatorProfession.SUPPORTER
                      ? "Supporter"
                      : operator.profession === OperatorProfession.SPECIALIST
                        ? "Specialist"
                        : operator.profession === OperatorProfession.VANGUARD
                          ? "Vanguard"
                          : operator.profession === OperatorProfession.GUARD
                            ? "Guard"
                            : operator.profession === OperatorProfession.DEFENDER
                              ? "Defender"
                              : "N/A";

        // Build the author field
        /**
         * @author All credit to https://github.com/Awedtan/HellaBot/
         */
        const urlName = operator.name.toLowerCase().split(" the ").join("-").split(/'|,/).join("").split(" ").join("-").split("ë").join("e").split("ł").join("l"); // Unholy dumbness
        const authorField = { name: operator.name, iconURL: avatarImage, url: `https://gamepress.gg/arknights/operator/${urlName}` };

        const embed = new EmbedBuilder()
            .setColor(colors.baseColor)
            .setTitle(`${operator.name} ${"★".repeat(Number(operator.rarity))}`)
            .setURL(authorField.url)
            .setThumbnail(avatarImage);

        let description = removeStyleTags(operator.description);
        if (operator.trait) {
            const candidate = operator.trait.candidates[operator.trait.candidates.length - 1];
            if (candidate.overrideDescripton) {
                description = insertBlackboard(candidate.overrideDescripton, candidate.blackboard) ?? description;
            }
        }

        if (description === "") description = "No description available.";

        embed.addFields({ name: `${operatorClass} - ${capitalize(operator.subProfessionId)}`, value: description });

        const rangeId = operator.phases?.[operator.phases.length - 1].rangeId;
        if (rangeId) {
            const range = await getRange(rangeId);
            if (range) embed.addFields(buildRangeField(range));
        }

        if (operator.talents) {
            for (const talent of operator.talents) {
                if (talent.candidates) {
                    const candidate = talent.candidates[talent.candidates.length - 1];
                    if (candidate.name) {
                        embed.addFields({ name: `*${candidate.name}*`, value: removeStyleTags(candidate.description) });
                    }
                }
            }
        }

        if (operator.potentialRanks && operator.potentialRanks.length > 0) {
            const potentialString = operator.potentialRanks.map((potential, index) => `${index} - ${potential.description}`).join("\n");
            embed.addFields({ name: "Potentials", value: potentialString, inline: true });
        }
        if (operator.favorKeyFrames) {
            const trustString = Object.entries(operator.favorKeyFrames[1].data)
                .filter(([, bonus]) => bonus)
                .map(([key, bonus]) => `${key.toUpperCase()} +${bonus}`)
                .join("\n");
            if (trustString !== "") {
                embed.addFields({ name: "Trust Bonus", value: trustString, inline: true });
            }
        }

        const maxStats = operator.phases[operator.phases.length - 1].attributesKeyFrames[operator.phases[operator.phases.length - 1].attributesKeyFrames.length - 1].data;
        const hp = maxStats.maxHp.toString();
        const atk = maxStats.atk.toString();
        const def = maxStats.def.toString();
        const res = maxStats.magicResistance.toString();
        const dpCost = maxStats.cost.toString();
        const block = maxStats.blockCnt.toString();
        const redeploy = maxStats.respawnTime.toString();
        const atkInterval = maxStats.baseAttackTime.toString();
        embed.addFields(
            { name: "\u200B", value: "**Max Stats**" },
            { name: "❤️ HP", value: hp, inline: true },
            { name: "⚔️ ATK", value: atk, inline: true },
            { name: "🛡️ DEF", value: def, inline: true },
            { name: "✨ RES", value: res, inline: true },
            { name: "🏁 DP", value: dpCost, inline: true },
            { name: "✋ Block", value: block, inline: true },
            { name: "⌛ Redeploy Time", value: redeploy, inline: true },
            { name: "⏱️ Attack Interval", value: atkInterval, inline: true },
        );

        const levelUpCost = new ButtonBuilder().setCustomId(`get-operator:${operatorId}:level-up-cost`).setLabel("Level-Up Cost").setStyle(ButtonStyle.Secondary);

        const modulesButton = new StringSelectMenuBuilder()
            .setCustomId(`get-operator:${operatorId}:modules`)
            .setPlaceholder("Select a module level to view.")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(new StringSelectMenuOptionBuilder().setLabel("Level 1").setValue("1"), new StringSelectMenuOptionBuilder().setLabel("Level 2").setValue("2"), new StringSelectMenuOptionBuilder().setLabel("Level 3").setValue("3"));

        const skillsButton = new ButtonBuilder().setCustomId(`get-operator:${operatorId}:skills`).setLabel("Skills").setStyle(ButtonStyle.Secondary);
        const skinsButton = new ButtonBuilder().setCustomId(`get-operator:${operatorId}:skins`).setLabel("Skins").setStyle(ButtonStyle.Secondary);
        const cancelButton = new ButtonBuilder().setCustomId(`get-operator:${operatorId}:cancel`).setLabel("Cancel").setStyle(ButtonStyle.Danger);

        const buttons = new ActionRowBuilder().addComponents(skillsButton, levelUpCost, skinsButton, cancelButton);
        const selectMenus = new ActionRowBuilder().addComponents(modulesButton);

        await interaction.reply({ embeds: [embed], components: [buttons as ActionRowBuilder<ButtonBuilder>, selectMenus as ActionRowBuilder<StringSelectMenuBuilder>] });
    },
    autocomplete: async (interaction: Interaction) => {
        if (interaction.isAutocomplete()) {
            const focusedValue = interaction.options.getFocused().toLowerCase();
            const operators = await search(focusedValue);

            await interaction.respond(
                operators.slice(0, 25).map((choice) => ({
                    name: choice.name,
                    value: choice.id ?? "",
                })),
            );
        }
    },
} as Command;
