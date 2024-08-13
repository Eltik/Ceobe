import { ApplicationCommandDataResolvable, ApplicationCommandOptionType, Interaction } from "discord.js";
import { getGuild } from "../../../database/impl/guilds/impl/get";
import { fetchStages } from "../../../lib/impl/stages";

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

            const exists = await getGuild(interaction.guildId ?? "");

            if (!exists) {
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

            return interaction.editReply(`Daily challenge submitted for stage ${stage.value} with challenge ${challenge.value} and banned operators ${bannedOperators.value}.`);
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
