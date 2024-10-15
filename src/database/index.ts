import { env } from "../env";
import { Client } from "pg";
import emitter, { Events } from "../events";
import { table as guildsTable, tableName as guildsTableName } from "./impl/tables/guilds";
import { table as usersTable, tableName as usersTableName } from "./impl/tables/users";
import { table as challengesTable, tableName as challengesTableName } from "./impl/tables/challenges";
import { Schema } from "../types/impl/database";
import { createTables } from "./impl/createTables";

export const postgres = new Client(env.DATABASE_URL);

export const tables: {
    schema: Schema;
    tableName: string;
}[] = [
    {
        schema: guildsTable,
        tableName: guildsTableName,
    },
    {
        schema: usersTable,
        tableName: usersTableName,
    },
    {
        schema: challengesTable,
        tableName: challengesTableName,
    },
];

export const init = async () => {
    await postgres.connect();
    await emitter.emit(Events.DATABASE_CONNECT);

    await createTables();

    await emitter.emit(Events.DATABASE_INITIATED);
};
