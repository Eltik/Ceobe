import type { Operator } from "../../../../types/impl/lib/impl/operators";
import { getAll } from "./get";

export const search = async (query: string): Promise<Operator[]> => {
    const data = await getAll();
    return data.filter((operator) => operator.name?.toLowerCase()?.includes(query.toLowerCase()) || operator.id?.toLowerCase()?.includes(query.toLowerCase()) || operator.name?.toLowerCase()?.startsWith(query.toLowerCase()) || operator.id?.toLowerCase()?.startsWith(query.toLowerCase()));
};
