import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { Interaction, Role } from "discord.js";
import type { Command } from "../../../types/impl/discord";
import type { Role as GuildRole } from "../../../types/impl/database/impl/guilds";
import { RoleType } from "../../../types/impl/database/impl/guilds";

export default {
    data: new SlashCommandBuilder()
        .setName("get-role")
        .setDescription("Generates a JSON object for a role.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("The type of role.")
                .setRequired(true)
                .setChoices([
                    {
                        name: "Daily Ping",
                        value: RoleType.DAILY_ROLE,
                    },
                    {
                        name: "Moderator",
                        value: RoleType.MODERATOR_ROLE,
                    },
                ]),
        )
        .addRoleOption((option) => option.setName("role").setDescription("The role to generate a JSON object for.").setRequired(true)),
    execute: async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const type = interaction.options.get("type")?.value as unknown as RoleType;
        const role = interaction.options.get("role")?.role as unknown as Role;

        const data: GuildRole = {
            id: role.id,
            metadata: {
                name: role.name,
                permissions: role.permissions.toArray(),
                color: role.color,
                hoist: role.hoist,
                mentionable: role.mentionable,
            },
            type,
        };

        await interaction.reply({ content: "```json\n" + JSON.stringify(data, null, 2) + "```", ephemeral: true });
    },
} as Command;
