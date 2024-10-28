import { EmbedBuilder, type Embed, type Interaction } from "discord.js";
import type { Button } from "../../../types/impl/discord";
import { get as getOperator } from "../../../lib/impl/operators/impl/get";
import { get as getRange } from "../../../lib/impl/ranges/impl/get";
import { insertBlackboard } from "../../../lib/impl/operators/impl/helper";
import { buildRangeField } from "../../../lib/impl/ranges/impl/helper";
import { formatSkillType } from "../../../lib/impl/skills/impl/helper";
import { getByCharId, getModuleDetails } from "../../../lib/impl/modules/impl/get";
import { colors } from "../..";

export default {
    id: "get-operator",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        await interaction.deferReply({ ephemeral: true });

        const operatorId = interaction.customId.split(":")[1];
        const type = interaction.customId.split(":")[2];

        const operator = await getOperator(operatorId);

        const embeds: Embed[] = [];
        if (interaction.message.embeds[0]) embeds.push(interaction.message.embeds[0]);

        const newEmbeds = [];

        switch (type) {
            case "level-up-cost":
                break;
            case "skills":
                if (operator?.skills.length === 0) {
                    const embed = new EmbedBuilder().setDescription("No skills found.").setColor(colors.errorColor);
                    newEmbeds.push(embed);
                    break;
                }

                for (const skill of operator?.skills ?? []) {
                    const staticSkill = skill?.static?.levels[skill.static.levels.length - 1];

                    const skillDescription =
                        `**${formatSkillType(staticSkill?.spData.spType ?? "")} - ${staticSkill?.skillType}**` +
                        `\n**Initial:** \`${staticSkill?.spData.initSp} SP\` - **Cost:** \`${staticSkill?.spData.spCost} SP\`${staticSkill?.duration && staticSkill?.duration > 0 ? ` - **Duration:** \`${staticSkill?.duration} sec\`` : ""}` +
                        `\n${insertBlackboard(staticSkill?.description ?? "", staticSkill?.blackboard?.concat({ key: "duration", value: staticSkill?.duration ?? 0, valueStr: staticSkill?.duration?.toString() ?? "" }) ?? [])}`;

                    const range = await getRange(staticSkill?.rangeId ?? "");

                    const thumbnail = `https://raw.githubusercontent.com/yuanyan3060/ArknightsGameResource/main/skills/skill_icon_${skill?.static?.iconId ?? skill?.skillId}.png`;

                    const skillEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`${staticSkill?.name}`).setThumbnail(thumbnail).setDescription(skillDescription);

                    if (range) {
                        skillEmbed.addFields(buildRangeField(range));
                    }

                    newEmbeds.push(skillEmbed);
                }
                break;
            case "modules":
                const operatorModules = await getByCharId(operator?.id ?? "");
                if (operatorModules.length === 0) {
                    const embed = new EmbedBuilder().setDescription("No modules found.").setColor(colors.errorColor);
                    newEmbeds.push(embed);
                    break;
                }

                for (const module of operatorModules) {
                    const moduleData = await getModuleDetails(module.uniEquipId);
                    for (const phase of moduleData?.phases ?? []) {
                        const embed = new EmbedBuilder().setTitle(`${module.typeIcon.toUpperCase()} ${module.uniEquipName} - Lv${phase.equipLevel}`).setThumbnail(module.image ?? "");

                        let description = "",
                            talentName = null,
                            talentDescription = null;
                        for (const part of phase.parts) {
                            if (part.overrideTraitDataBundle.candidates) {
                                const candidate = part.overrideTraitDataBundle.candidates[part.overrideTraitDataBundle.candidates.length - 1];
                                if (candidate.additionalDescription) {
                                    description += `${insertBlackboard(candidate.additionalDescription, candidate.blackboard)}\n`;
                                }
                                if (candidate.overrideDescripton) {
                                    description += `${insertBlackboard(candidate.overrideDescripton, candidate.blackboard)}\n`;
                                }
                            }
                            if (part.addOrOverrideTalentDataBundle.candidates) {
                                const candidate = part.addOrOverrideTalentDataBundle.candidates[part.addOrOverrideTalentDataBundle.candidates.length - 1];
                                talentName = candidate.name ?? talentName;
                                talentDescription = insertBlackboard(candidate.upgradeDescription, candidate.blackboard) ?? talentDescription;
                            }
                        }
                        embed.setDescription(description);
                        if (talentName && talentDescription) {
                            embed.addFields({ name: talentName, value: talentDescription });
                        }

                        const statDescription = phase.attributeBlackboard.map((attribute) => `${attribute.key.toUpperCase()} ${attribute.value > 0 ? "+" : ""}${attribute.value}`).join("\n");
                        embed.addFields({ name: `Stats`, value: statDescription });

                        newEmbeds.push(embed);
                    }
                }
                break;
            case "skins":
                //const skinImage =
                //operator?.rarity === OperatorRarity.oneStar || operator?.rarity === OperatorRarity.twoStar || operator?.rarity === OperatorRarity.threeStar
                //? `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/characters/${encodeURIComponent(operator?.id?.replaceAll("#", "_") ?? "")}_1.png`
                //: `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/characters/${encodeURIComponent(operator?.id?.replaceAll("#", "_") ?? "")}_2.png`;
                break;
            case "cancel":
                break;
            default:
                break;
        }

        await interaction.message.edit({ embeds: [...embeds, ...newEmbeds] });

        return await interaction.editReply({ content: "Operator data updated." });
    },
} as Button;
