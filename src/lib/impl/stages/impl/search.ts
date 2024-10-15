import type { Stage } from "../../../../types/impl/lib/impl/stages";
import { getAll } from "./get";

export const search = async (query: string): Promise<Stage[]> => {
    const data = await getAll();
    return data.filter((stage) => stage.code?.toLowerCase()?.includes(query) || stage.name?.toLowerCase()?.includes(query) || stage.code?.toLowerCase()?.startsWith(query) || stage.name?.toLowerCase()?.startsWith(query));
};
