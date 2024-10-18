import type { ChannelFlagsBitField } from "discord.js";
import type { SchemaToInput, SchemaToUpdateInput } from "..";
import { table } from "../../../../database/impl/tables/guilds";
import type { User } from "./users";

export type CreateGuildInput = SchemaToInput<typeof table>;
export type UpdateGuildInput = SchemaToUpdateInput<typeof table> & { id: string };
export type GetGuildInput = { id?: string; guild_id?: string };
export type DeleteGuildInput = { id: string };

export type Guild = {
    id: string;
    guild_id: string;
    channels: Channel[];
    users: User[];
    roles: Role[];
    created_at: Date;
};

export type Channel = {
    id: string;
    // Metadata from Discord API
    metadata: {
        name: string;
        description?: string;
        position?: number;
        rateLimitPerUser?: number;
        nsfw?: boolean;
        bitrate?: number;
        userLimit?: number;
        permissionOverwrites?: Record<string, any>[];
        parentID?: string;
        flags?: ChannelFlagsBitField;
        manageable?: boolean;
        deletable?: boolean;
        url?: string;
        createdAt?: Date;
    };
    type: ChannelType;
};

export enum ChannelType {
    DAILY_CHANNEL = "daily",
    SUBMISSIONS_CHANNEL = "submissions",
}

export type Role = {
    id: string;
    // Metadata from Discord API
    metadata: {
        name: string;
        permissions: string[];
        color: number;
        hoist: boolean;
        mentionable: boolean;
    };
    type: RoleType;
};

export enum RoleType {
    DAILY_ROLE = "daily",
    MODERATOR_ROLE = "moderator",
}
