import { QueryConfig } from "pg";
import { postgres } from "../../..";
import emitter, { Events } from "../../../../events";

export const createUser = async (guildId: string, userId: string) => {
    const query: QueryConfig = {
        text: `
            INSERT INTO players (
                guild_id,
                user_id
            ) VALUES (
                $1,
                $2
            )
        `,
        values: [guildId, userId],
    };

    await postgres.query(query);

    await emitter.emit(Events.DATABASE_PLAYER_CREATE, {
        guildId,
        userId,
    });
};
