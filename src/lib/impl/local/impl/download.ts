import { REPOSITORY } from "..";
import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import { join } from "node:path";

export const download = async (table: ExcelTables) => {
    const data = await (await fetch(`https://raw.githubusercontent.com/${REPOSITORY}/main/en_US/gamedata/excel/${table}.json`)).json();
    Bun.write(join(import.meta.dir, `./data/${table}.json`), JSON.stringify(data, null, 4));
    return data;
};
