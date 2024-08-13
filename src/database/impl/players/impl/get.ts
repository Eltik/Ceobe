import { QueryConfig } from "pg";
import { postgres } from "../../..";

export const getPlayer = async (guildId: string, userId: string) => {
    const query: QueryConfig = {
        text: `
            SELECT
                *
            FROM
                players
            WHERE
                guild_id = $1
            AND
                user_id = $2
        `,
        values: [guildId, userId],
    };

    const result = await postgres.query(query);
    return result.rows;
};

export const getPlayers = async (guildId: string) => {
    const query: QueryConfig = {
        text: `
            SELECT
                *
            FROM
                players
            WHERE
                guild_id = $1
        `,
        values: [guildId],
    };

    const result = await postgres.query(query);

    return result.rows;
};
