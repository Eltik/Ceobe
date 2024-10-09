import type { UpdateGuildInput } from "../../../../../types/impl/database/impl/guilds";
import { table, tableName } from "..";
import { postgres } from "../../../..";
import emitter, { Events } from "../../../../../events";

export const update = async (data: UpdateGuildInput) => {
    const columns = Object.keys(table).filter((col) => col !== "id"); // Exclude 'id' from updateable fields
    const fields = columns.filter((col) => data[col as keyof UpdateGuildInput] !== undefined); // Only update provided data

    if (fields.length === 0) {
        throw new Error("No fields provided for update.");
    }

    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(", "); // Create SET clause
    const query = `
        UPDATE ${tableName}
        SET ${setClause}
        WHERE id = $${fields.length + 1} -- Adding the id as the last parameter
        RETURNING *;
    `;

    const params = [...fields.map((field) => data[field as keyof UpdateGuildInput]), data.id];

    try {
        const res = await postgres.query(query, params);

        await emitter.emit(Events.DATABASE_GUILDS_CREATE, res.rows[0]);

        return res.rows[0];
    } catch (e) {
        console.error(e);

        await emitter.emit(Events.DATABASE_GUILDS_CREATE, null);

        return null;
    }
};
