import { tableName } from "..";
import { postgres } from "../../../..";
import type { LeaderboardUserInput, User } from "../../../../../types/impl/database/impl/users";

export const leaderboard = async (input: LeaderboardUserInput): Promise<User[] | null> => {
    let query = `
        SELECT * FROM ${tableName}
        WHERE guild_id = $1
    `;

    const params: (string | number)[] = [input.guild_id];

    if (input.sort_by) {
        let sortField = "level"; // Default sort field

        if (input.sort_by === "level") {
            sortField = "level";
        } else if (input.sort_by === "exp") {
            sortField = "exp";
        } else if (input.sort_by === "submitted_challenges") {
            // Use array_length to sort by the length of submitted_challenges
            sortField = "array_length(submitted_challenges, 1)";
        }

        query += ` ORDER BY ${sortField} DESC`;
    }

    if (input.limit) {
        params.push(input.limit);
        query += ` LIMIT $${params.length}`;
    }
    if (input.offset) {
        params.push(input.offset);
        query += ` OFFSET $${params.length}`;
    }

    try {
        const res = await postgres.query(query, params);

        return res.rows.length > 0 ? (res.rows as User[]) : null;
    } catch (e) {
        console.error(e);
        return null;
    }
};
