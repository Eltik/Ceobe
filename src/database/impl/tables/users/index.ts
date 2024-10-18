import { env } from "../../../../env";
import { Schema } from "../../../../types/impl/database";

export const tableName = `${env.PREFIX}_users`;
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
        },
    },
    user_id: {
        type: "TEXT",
        options: {
            notNull: true,
        },
    },
    level: {
        type: "INTEGER",
        options: {
            notNull: true,
            default: 1,
        },
    },
    exp: {
        type: "INTEGER",
        options: {
            notNull: true,
            default: 1,
        },
    },
    submited_challenges: {
        type: "TEXT[]",
        options: {
            notNull: true,
            default: "ARRAY[]::TEXT[]",
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
