import type { SchemaToInput, SchemaToUpdateInput } from "..";
import { table } from "../../../../database/impl/tables/challenges";

export type CreateChallengenput = SchemaToInput<typeof table>;
export type UpdateChallengeInput = SchemaToUpdateInput<typeof table> & { id: string };
export type GetChallengeInput = { id: string };

export type Challenge = {
    id: string;
    guild_id: string;
    message_id: string;
    stage_name: string;
    stage_data: any;
    created_at: Date;
};
