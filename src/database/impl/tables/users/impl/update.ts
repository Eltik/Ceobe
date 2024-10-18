import { table, tableName } from "..";
import { postgres } from "../../../..";
import emitter, { Events } from "../../../../../events";
import type { UpdateUserInput } from "../../../../../types/impl/database/impl/users";

export const update = async (data: UpdateUserInput) => {
    const columns = Object.keys(table).filter((col) => col !== "id"); // Exclude 'id' from updateable fields
    const fields = columns.filter((col) => data[col as keyof UpdateUserInput] !== undefined); // Only update provided data

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

    const params = [...fields.map((field) => data[field as keyof UpdateUserInput]), data.id];

    try {
        const res = await postgres.query(query, params);

        await emitter.emit(Events.DATABASE_USERS_UPDATE, res.rows[0]);

        return res.rows[0];
    } catch (e) {
        console.error(e);

        await emitter.emit(Events.DATABASE_USERS_UPDATE, null);

        return null;
    }
};
