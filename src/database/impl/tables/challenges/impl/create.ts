import type { CreateChallengeInput } from "../../../../../types/impl/database/impl/challenges";
import { table, tableName } from "..";
import { postgres } from "../../../..";
import emitter, { Events } from "../../../../../events";

export const create = async (data: CreateChallengeInput) => {
    const columns = Object.keys(table).filter((col) => col !== "id");
    const fields = columns.filter((col) => data[col as keyof CreateChallengeInput] !== undefined);
    const values = fields.map((_, i) => `$${i + 1}`);

    const query = `
        INSERT INTO ${tableName} (${fields.join(", ")})
        VALUES (${values.join(", ")})
        RETURNING *;
    `;

    const params = fields.map((field) => data[field as keyof CreateChallengeInput]);

    try {
        const res = await postgres.query(query, params);

        await emitter.emit(Events.DATABASE_CHALLENGE_CREATE, res.rows[0]);

        return res.rows[0];
    } catch (e) {
        console.error(e);

        await emitter.emit(Events.DATABASE_CHALLENGE_CREATE, null);

        return null;
    }
};
