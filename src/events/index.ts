import EventEmitter2 from "eventemitter2";

export enum Events {
    DISCORD_READY = "discord.ready",
    DISCORD_COMMAND_REGISTER = "discord.command.register",
    DATABASE_CONNECT = "database.connect",
    DATABASE_INITIATED = "database.initiated",
    DATABASE_PLAYER_CREATE = "database.player.create",
    DATABASE_GUILD_CREATE = "database.guild.create",
    DATABASE_GUILD_EDIT = "database.guild.edit",
    DATABASE_CHALLENGES_CREATE = "database.challenges.create",
}

const emitter = new EventEmitter2({});

export default emitter;
