import type { SchemaToInput, SchemaToUpdateInput } from "..";
import { table } from "../../../../database/impl/tables/users";

export type CreateUserInput = SchemaToInput<typeof table>;
export type UpdateUserInput = SchemaToUpdateInput<typeof table> & { id: string };
export type GetUserInput = { id?: string; user_id?: string; guild_id?: string };

export type User = {
    id: string;
    guild_id: string;
    user_id: string;
    level: number;
    exp: number;
    submitted_challenges: string[];
    favorites: Record<Favorites, any>;
    created_at: Date;
};

export enum Favorites {
    operator = "operator",
    map = "map",
}
