import { QueryConfig } from "pg";
import { postgres } from "../../..";
import { Challenge } from "../../../../types";

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
