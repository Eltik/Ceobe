import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import type { Range, Ranges } from "../../../../types/impl/lib/impl/ranges";
import { get as getStages } from "../../local/impl/get";

export const get = async (id: string): Promise<Range | null> => {
    const ranges = await getAll();
    for (const range of Object.values(ranges)) {
        if (range.id === id) return range;
    }

    return null;
};

export const getAll = async (): Promise<Ranges> => {
    const data = (await getStages(ExcelTables.RANGE_TABLE)) as Ranges;
    return data;
};
