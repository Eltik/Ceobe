import { QueryConfig } from "pg";
import { postgres } from "../../..";
import emitter, { Events } from "../../../../events";

export const createChallenge = async (guildId: string, stage: string, challenge: string, bannedOperators: string): Promise<string> => {
    const id = Math.random().toString(36).substring(7);
    const query: QueryConfig = {
        text: `
            INSERT INTO challenges (
                id,
                guild_id,
                stage,
                challenge,
                banned_operators
            ) VALUES (
                $1,
                $2,
                $3,
                $4,
                $5
            )
        `,
        values: [id, guildId, stage, challenge, bannedOperators],
    };

    await postgres.query(query);

    await emitter.emit(Events.DATABASE_CHALLENGES_CREATE, {
        guildId,
        stage,
        challenge,
        bannedOperators,
        id,
    });

    return id;
};
