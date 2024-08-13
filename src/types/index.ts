export type Guild = {
    id: string;
    guild_id: string;
    daily_channel_id: string;
    submissions_channel_id: string;
    moderator_role: string;
    created_at: Date;
};

export type Challenge = {
    id: string;
    guild_id: string;
    stage: string;
    challenge: string;
    banned_operators: string;
    created_at: Date;
};
