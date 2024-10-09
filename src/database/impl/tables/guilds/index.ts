import { env } from "../../../../env";
import { Schema } from "../../../../types/impl/database";

export const tableName = `${env.PREFIX}_guilds`;
export const table: Schema = {
    id: {
        type: "TEXT",
        options: {
            primaryKey: true,
            default: "gen_random_uuid()",
            notNull: true,
            unique: true,
        },
    },
    guild_id: {
        type: "TEXT",
        options: {
            notNull: true,
            unique: true,
        },
    },
    channels: {
        type: "JSONB",
        options: {
            notNull: true,
            default: "'[]'",
        },
    },
    users: {
        type: "JSONB",
        options: {
            notNull: true,
            default: "'[]'",
        },
    },
    roles: {
        type: "JSONB",
        options: {
            notNull: true,
            default: "'[]'",
        },
    },
    created_at: {
        type: "TIMESTAMP",
        options: {
            notNull: true,
            default: "now()",
        },
    },
};
