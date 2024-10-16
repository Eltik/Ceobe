import type { SchemaToInput, SchemaToUpdateInput } from "..";
import { table } from "../../../../database/impl/tables/challenges";
import { Operator, OperatorProfession } from "../../lib/impl/operators";
import type { Stage } from "../../lib/impl/stages";

export type CreateChallengeInput = SchemaToInput<typeof table>;
export type UpdateChallengeInput = SchemaToUpdateInput<typeof table> & { id: string };
export type GetChallengeInput = { id: string };

export type Challenge = {
    id: string;
    guild_id: string;
    message_id: string;
    challenge_description: string;
    challenge_data: ChallengeData;
    stage_name: string;
    stage_data: Stage;
    created_at: Date;
};

export type ChallengeData = {
    banned_operators: Operator[];
    banned_classes: OperatorProfession[];
    banned_rarities: number[];
    banned_tiles: string;
};
