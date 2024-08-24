import { ApplicationCommandDataResolvable, EmbedBuilder, Interaction, PermissionFlagsBits } from "discord.js";
import { getLatestChallenge } from "../../../database/impl/challenges/impl/get";

export default {
    name: "current-challenge",
    description: "Get's the current challenge.",
    options: [],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    execute: async (interaction: Interaction) => {
        if (interaction.isCommand()) {
            await interaction.deferReply({ ephemeral: true });

            const challenge = await getLatestChallenge(interaction.guildId ?? "");
            if (!challenge) {
                await interaction.editReply("There is no current challenge.");
                return;
            }

            const embed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`Stage: ${challenge.stage}`)
                .setAuthor({ name: "Daily Challenge", iconURL: "https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/char_2013_cerber_whirlwind%232.png", url: "https://aceship.github.io/AN-EN-Tags/akhrchars.html?opname=Ceobe" })
                .setDescription(`**Challenge**: \`\`\`${challenge.challenge}\`\`\`\n**Banned Operators**: \`${challenge.banned_operators}\``)
                .setFooter({ text: "Submitted by: " + interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp(challenge.created_at);

            await interaction.editReply({ embeds: [embed] });
        } else {
            return;
        }
    },
} as ApplicationCommandDataResolvable;
