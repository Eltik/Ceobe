import type { SlashCommandBuilder } from "discord.js";

export type Event = {
    name: string;
    once?: boolean;
    execute: (...args: any[]) => Promise<void>;
};

export type Command = {
    data: SlashCommandBuilder;
    execute: (interaction: any) => Promise<void>;
    autocomplete?: (interaction: any) => Promise<void>;
};

export type Button = {
    id: string;
    execute: (interaction: any) => Promise<void>;
};

export type Menu = {
    id: string;
    execute: (interaction: any) => Promise<void>;
};
