import { QueryConfig } from "pg";
import { postgres } from "../../..";
import emitter, { Events } from "../../../../events";

export const createGuild = async (guildId: string, dailyChannelId: string, submissionsChannelId: string, moderatorRole: string) => {
    const query: QueryConfig = {
        text: `
            INSERT INTO guilds (
                guild_id,
                daily_channel_id,
                submissions_channel_id,
                moderator_role
            ) VALUES (
                $1,
                $2,
                $3,
                $4
            )
        `,
        values: [guildId, dailyChannelId, submissionsChannelId, moderatorRole],
    };

    await postgres.query(query);

    await emitter.emit(Events.DATABASE_GUILD_CREATE, {
        guildId,
        dailyChannelId,
        submissionsChannelId,
        moderatorRole,
    });
};
