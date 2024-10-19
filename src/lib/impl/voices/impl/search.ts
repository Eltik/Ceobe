import { getAllLines } from "./get";

export const search = async (
    query: string,
): Promise<
    {
        name: string;
        id: string;
    }[]
> => {
    const data = await getAllLines();
    return data.filter((voice) => voice.name?.toLowerCase()?.includes(query.toLowerCase()) || voice.id?.toLowerCase()?.includes(query.toLowerCase()) || voice.name?.toLowerCase()?.startsWith(query.toLowerCase()) || voice.id?.toLowerCase()?.startsWith(query.toLowerCase()));
};
