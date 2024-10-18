import { tableName } from "..";
import { postgres } from "../../../..";
import type { GetChallengeInput, Challenge } from "../../../../../types/impl/database/impl/challenges";

export const get = async (input: GetChallengeInput): Promise<Challenge | null> => {
    const query = `
        SELECT * FROM ${tableName}
        WHERE id = $1;
    `;

    const params = [input.id];

    try {
        const res = await postgres.query(query, params);

        if (res.rows.length > 0) {
            const guild = res.rows[0] as Challenge;
            return guild;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const getLatestChallenge = async (): Promise<Challenge | null> => {
    const query = `
        SELECT * FROM ${tableName}
        ORDER BY created_at DESC
        LIMIT 1;
    `;

    try {
        const res = await postgres.query(query);

        if (res.rows.length > 0) {
            const guild = res.rows[0] as Challenge;
            return guild;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
};
