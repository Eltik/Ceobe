import type { SchemaToInput, SchemaToUpdateInput } from "..";
import { table } from "../../../../database/impl/tables/users";

export type CreateUserInput = SchemaToInput<typeof table>;
export type UpdateUserInput = SchemaToUpdateInput<typeof table> & { id: string };
export type GetUserInput = { id: string };

export type User = {
    id: string;
    guild_id: string;
    user_id: string;
    points: number;
    level: number;
    created_at: Date;
};
