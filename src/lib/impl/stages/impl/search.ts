import { Stage } from "../../../../types/impl/lib/impl/stages";
import { getAll } from "./get";

export const search = async (query: string): Promise<Stage[]> => {
    const data = await getAll();
    return data.filter((stage) => stage.code.includes(query) || stage.name.includes(query) || stage.code.startsWith(query) || stage.name.startsWith(query));
};
