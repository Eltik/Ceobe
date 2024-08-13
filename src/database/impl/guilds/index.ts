/**
 * @description Handles all queue related database operations.
 */

export const table = `
    CREATE TABLE IF NOT EXISTS guilds (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        guild_id TEXT NOT NULL,
        daily_channel_id TEXT NOT NULL,
        submissions_channel_id TEXT NOT NULL,
        moderator_role TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
`;
