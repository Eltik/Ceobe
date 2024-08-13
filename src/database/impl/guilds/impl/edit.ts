import { QueryConfig } from "pg";
import { postgres } from "../../..";
import emitter, { Events } from "../../../../events";

export const editGuild = async (guildId: string, dailyChannelId: string, submissionsChannelId: string, moderatorRole: string) => {
    const query: QueryConfig = {
        text: `
            UPDATE
                guilds
            SET
                daily_channel_id = $2,
                submissions_channel_id = $3,
                moderator_role = $4
            WHERE
                guild_id = $1
        `,
        values: [guildId, dailyChannelId, submissionsChannelId, moderatorRole],
    };

    await postgres.query(query);

    await emitter.emit(Events.DATABASE_GUILD_EDIT, {
        guildId,
        dailyChannelId,
        submissionsChannelId,
        moderatorRole,
    });
};
