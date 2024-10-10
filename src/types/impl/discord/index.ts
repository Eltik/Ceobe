import type { SlashCommandBuilder } from "discord.js";

export type Event = {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => Promise<void>;
};

export type Command = {
    data: SlashCommandBuilder;
    execute: (interaction: any) => Promise<void>;
};
