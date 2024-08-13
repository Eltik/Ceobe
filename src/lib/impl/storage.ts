import { join } from "node:path";

export const fetchGameData = async (name: string) => {
    const file = Bun.file(join(import.meta.dir, `./gamedata/excel/${name}.json`));
    if (await file.exists()) {
        return await file.json();
    } else {
        // https://github.com/Kengxxiao/ArknightsGameData_YoStar/tree/main/en_US/gamedata
        // https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata/excel/character_table.json
        const data = await (await fetch(`https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData_YoStar/main/en_US/gamedata/excel/${name}.json`)).json();
        await Bun.write(join(import.meta.dir, `./gamedata/excel/${name}.json`), JSON.stringify(data));
        return data;
    }
};
