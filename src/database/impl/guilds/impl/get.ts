import { QueryConfig } from "pg";
import { postgres } from "../../..";

export const getGuild = async (guildId: string) => {
    const query: QueryConfig = {
        text: `
            SELECT
                *
            FROM
                guilds
            WHERE
                guild_id = $1
        `,
        values: [guildId],
    };

    const result = await postgres.query(query);
    return result.rows;
};
