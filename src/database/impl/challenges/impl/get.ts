import { QueryConfig } from "pg";
import { postgres } from "../../..";
import { Challenge } from "../../../../types";

export const getLatestChallenge = async (guildId: string): Promise<Challenge | undefined> => {
    const query: QueryConfig = {
        text: `
            SELECT
                *
            FROM
                challenges
            WHERE
                guild_id = $1
            ORDER BY
                created_at DESC
            LIMIT
                1
        `,
        values: [guildId],
    };

    const result = await postgres.query(query);
    return result.rows[0];
};

export const getChallenge = async (guildId: string, id: string): Promise<Challenge | undefined> => {
    const query: QueryConfig = {
        text: `
            SELECT
                *
            FROM
                challenges
            WHERE
                guild_id = $1
            AND
                id = $2
        `,
        values: [guildId, id],
    };

    const result = await postgres.query(query);
    return result.rows[0];
};
