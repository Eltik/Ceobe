import EventEmitter2 from "eventemitter2";

export enum Events {
    DISCORD_READY = "discord.ready",
    DISCORD_COMMAND_REGISTER = "discord.command.register",

    DATABASE_CONNECT = "database.connect",
    DATABASE_INITIATED = "database.initiated",
    DATABSE_TABLES_INITIATED = "database.tables.initiated",
    DATABASE_TABLE_CREATE = "database.table.create",

    DATABASE_GUILDS_CREATE = "database.guilds.create",
    DATABASE_GUILDS_UPDATE = "database.guilds.update",
    DATABASE_GUILDS_DELETE = "database.guilds.delete",

    DATABASE_USERS_CREATE = "database.users.create",
    DATABASE_USERS_UPDATE = "database.users.update",
    DATABASE_USERS_DELETE = "database.users.delete",

    LOCAL_TABLES_DOWNLOADED = "local.tables.downloaded",
    LOCAL_TABLES_INITIATED = "local.tables.initiated",
}

const emitter = new EventEmitter2({});

export default emitter;
