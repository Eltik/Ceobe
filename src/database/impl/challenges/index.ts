/**
 * @description Handles all queue related database operations.
 */

export const table = `
    CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        guild_id TEXT NOT NULL,
        stage TEXT NOT NULL,
        challenge TEXT NOT NULL,
        banned_operators TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
`;
