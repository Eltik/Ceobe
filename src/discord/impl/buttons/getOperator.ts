import { EmbedBuilder, type Embed, type Interaction } from "discord.js";
import type { Button } from "../../../types/impl/discord";
import { get as getOperator } from "../../../lib/impl/operators/impl/get";
import { get as getRange } from "../../../lib/impl/ranges/impl/get";
import { insertBlackboard } from "../../../lib/impl/operators/impl/helper";
import { buildRangeField } from "../../../lib/impl/ranges/impl/helper";
import { formatSkillType } from "../../../lib/impl/skills/impl/helper";
import { colors } from "../..";

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

        return await interaction.message.edit({ embeds: [...embeds, ...newEmbeds] });
    },
} as Button;
