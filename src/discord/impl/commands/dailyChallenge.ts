import { ApplicationCommandDataResolvable, ApplicationCommandOptionType, EmbedBuilder, Interaction } from "discord.js";
import { getGuild } from "../../../database/impl/guilds/impl/get";
import { fetchStages } from "../../../lib/impl/stages";
import { createChallenge } from "../../../database/impl/challenges/impl/create";
import { getChallenge } from "../../../database/impl/challenges/impl/get";

export default {
    name: "daily-challenge",
    description: "Submits a daily challenge",
    options: [
        {
            name: "stage",
            description: "The stage in Arknights.",
            type: ApplicationCommandOptionType.String,
            autocomplete: true,
            required: true,
        },
        {
            name: "challenge",
            description: "Description of the challenge.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "banned-operators",
            description: "Banned operators",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    execute: async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await interaction.deferReply({ ephemeral: true });

            const guild = await getGuild(interaction.guildId ?? "");
            if (!guild) {
                return interaction.editReply("Guild does not exist. Create a guild using `/create-guild`.");
            }

            const stage = interaction.options.get("stage");
            const challenge = interaction.options.get("challenge");
            const bannedOperators = interaction.options.get("banned-operators");

            if (!stage || !stage.value) {
                return interaction.editReply("You must provide a stage.");
            }

            if (!challenge || !challenge.value) {
                return interaction.editReply("You must provide a challenge.");
            }

            if (!bannedOperators || !bannedOperators.value) {
                return interaction.editReply("You must provide banned operators.");
            }

            try {
                const id = await createChallenge(interaction.guildId ?? "", String(stage.value), String(challenge.value), String(bannedOperators.value));

                const currentChallenge = await getChallenge(interaction.guildId ?? "", id);
                if (!currentChallenge) return interaction.editReply("An error occurred while submitting the daily challenge.");

                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle(`${currentChallenge.stage} | Challenge ID: ${id}`)
                    .setAuthor({ name: "Daily Challenge", iconURL: "https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/char_2013_cerber_whirlwind%232.png", url: "https://aceship.github.io/AN-EN-Tags/akhrchars.html?opname=Ceobe" })
                    .setDescription(`**Challenge**: \`\`\`${currentChallenge.challenge}\`\`\`\n**Banned Operators**: \`${currentChallenge.banned_operators}\``)
                    .setFooter({ text: "Submitted by: " + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

                const channel = await interaction.client.channels.cache.get(guild.daily_channel_id);
                if (!channel) {
                    const channel = await interaction.guild!.channels.fetch(guild.daily_channel_id);
                    if (!channel?.isTextBased()) {
                        return interaction.editReply("Daily challenge channel is not a text channel.");
                    } else {
                        channel?.send({ embeds: [embed] });
                    }
                } else if (channel?.isTextBased()) {
                    channel.send({ embeds: [embed] });
                } else {
                    return interaction.editReply("Daily challenge channel is not a text channel. Run `/create-guild` again to edit the channel.");
                }

                return interaction.editReply(`Daily challenge submitted for stage \`${stage.value}\`.\n**Challenge**: \`\`\`${challenge.value}\`\`\`\n**Banned Operators**:\`${bannedOperators.value}\`\n **Challenge ID**: \`${id}\``);
            } catch (e) {
                console.error(e);
                return interaction.editReply("An error occurred while submitting the daily challenge.");
            }
        } else {
            return;
        }
    },
    autocomplete: async (interaction: Interaction) => {
        if (interaction.isAutocomplete()) {
            const focusedValue = interaction.options.getFocused().toLowerCase();
            const stages = await fetchStages();

            const filtered = stages
                .filter((choice) => {
                    return choice.stageId?.startsWith(focusedValue) || choice.stageId?.includes(focusedValue);
                })
                .slice(0, 25);
            await interaction.respond(filtered.map((choice) => ({ name: choice.stageId, value: choice.stageId })));
        } else {
            return;
        }
    },
} as ApplicationCommandDataResolvable;
