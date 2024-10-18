import type { Stage } from "../../../../types/impl/lib/impl/stages";
import { getAll } from "./get";

export const search = async (query: string): Promise<Stage[]> => {
    const data = await getAll();
    const stages = data.filter((stage) => stage.code?.toLowerCase()?.includes(query.toLowerCase()) || stage.name?.toLowerCase()?.includes(query.toLowerCase()) || stage.code?.toLowerCase()?.startsWith(query.toLowerCase()) || stage.name?.toLowerCase()?.startsWith(query.toLowerCase()));
    return stages;
};
