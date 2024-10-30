import { EmbedBuilder, type Embed, type Interaction } from "discord.js";
import type { Button } from "../../../types/impl/discord";
import { get as getOperator } from "../../../lib/impl/operators/impl/get";
import { get as getRange } from "../../../lib/impl/ranges/impl/get";
import { get as getSkill } from "../../../lib/impl/skills/impl/get";
import { getSkinsByCharacter as getSkins } from "../../../lib/impl/skins/impl/get";
import { insertBlackboard } from "../../../lib/impl/operators/impl/helper";
import { buildRangeField } from "../../../lib/impl/ranges/impl/helper";
import { formatSkillType } from "../../../lib/impl/skills/impl/helper";
import { colors } from "../..";
import { calculateCost } from "../../../lib/impl/operators/impl/levelUpCost";

export default {
    id: "get-operator",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        await interaction.deferUpdate();

        const operatorId = interaction.customId.split(":")[1];
        const type = interaction.customId.split(":")[2];

        const operator = await getOperator(operatorId);

        const embeds: Embed[] = [];
        if (interaction.message.embeds[0]) embeds.push(interaction.message.embeds[0]);

        const newEmbeds = [];

        switch (type) {
            case "level-up-cost":
                if (!operator) {
                    const embed = new EmbedBuilder().setDescription("Operator not found.").setColor(colors.errorColor);
                    newEmbeds.push(embed);
                    break;
                }

                const cost = await calculateCost(operator);

                const skillsEmbed = new EmbedBuilder().setColor(colors.baseColor).setTitle(`${operator.name} - Skill Level Up Cost`);
                let skillDescription = "";
                for (const skill of cost.skillCost) {
                    const skillData = await getSkill(skill.skillId);

                    skillDescription += `**${skillData?.levels[0].name}**\n`;

                    for (const cost of skill.cost) {
                        skillDescription += `\`${cost.level}\`:\`\`\`md\n`;
                        skillDescription += cost.skillCost
                            .map((material) => `- ${material.material.name}: ${material.quantity}`)
                            .join("\n")
                            .trim();
                        skillDescription += `\`\`\`\n`;
                    }

                    skillDescription += "\n";
                }

                skillsEmbed.setDescription(skillDescription);

                const eliteEmbed = new EmbedBuilder().setColor(colors.baseColor).setTitle(`${operator.name} - Elite Level Up Cost`);
                let eliteDescription = "";
                for (const elite of cost.eliteCost.reverse()) {
                    eliteDescription += `**${elite.elite}**\n`;
                    if (elite.eliteCost.length === 0) {
                        eliteDescription += "No materials required.\n";
                        continue;
                    }

                    eliteDescription += `\`\`\`md\n`;

                    for (const cost of elite.eliteCost) {
                        eliteDescription += `- ${cost.material.name}: ${cost.quantity}\n`;
                    }

                    eliteDescription += `\`\`\``;

                    eliteDescription += "\n";
                }

                eliteEmbed.setDescription(eliteDescription);

                newEmbeds.push(skillsEmbed, eliteEmbed);
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

                    const skillEmbed = new EmbedBuilder().setColor("#2f3136").setTitle(`${staticSkill?.name}`).setDescription(skillDescription);

                    if (range) {
                        skillEmbed.addFields(buildRangeField(range));
                    }
                    if (skill.static?.image) {
                        skillEmbed.setThumbnail(skill.static.image);
                    }

                    newEmbeds.push(skillEmbed);
                }
                break;
            case "skins":
                const skins = await getSkins(operatorId);
                for (const skin of skins) {
                    const displaySkin = skin.displaySkin;

                    const embed = new EmbedBuilder().setColor(colors.baseColor).setTitle(`${displaySkin.skinGroupName}${displaySkin.skinName ? ` - ${displaySkin.skinName}` : ""}`);

                    if (skin.image) embed.setImage(skin.image);
                    if (skin.eliteImage) embed.setThumbnail(skin.eliteImage);

                    if (displaySkin.drawerList && displaySkin.drawerList.length > 0) {
                        const artistString = displaySkin.drawerList.join("\n");
                        embed.addFields({ name: displaySkin.drawerList.length > 1 ? "Artists" : "Artist", value: artistString });
                    }

                    newEmbeds.push(embed);
                }

                if (skins.length === 0) {
                    const embed = new EmbedBuilder().setDescription("No skills found.").setColor(colors.errorColor);
                    newEmbeds.push(embed);
                    break;
                }
                break;
            case "cancel":
                break;
            default:
                break;
        }

        return await interaction.message.edit({ embeds: [...embeds, ...newEmbeds] });
    },
} as Button;
