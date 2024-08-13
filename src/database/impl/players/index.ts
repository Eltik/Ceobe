/**
 * @description Handles all queue related database operations.
 */

export const table = `
    CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        experience INTEGER NOT NULL DEFAULT 0,
        level INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
`;
