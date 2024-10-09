import type { SchemaToInput, SchemaToUpdateInput } from "..";
import { table } from "../../../../database/impl/tables/guilds";

export type CreateGuildInput = SchemaToInput<typeof table>;
export type UpdateGuildInput = SchemaToUpdateInput<typeof table> & { id: string };
