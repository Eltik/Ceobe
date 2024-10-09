import type { SchemaToInput, SchemaToUpdateInput } from "..";
import { table } from "../../../../database/impl/tables/users";

export type CreateUserInput = SchemaToInput<typeof table>;
export type UpdateUserInput = SchemaToUpdateInput<typeof table> & { id: string };
