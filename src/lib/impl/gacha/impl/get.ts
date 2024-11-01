import type { Gacha } from "../../../../types/impl/lib/impl/gacha";
import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import { Operator } from "../../../../types/impl/lib/impl/operators";
import { get as getGacha } from "../../local/impl/get";
import { getAll as getAllOperators } from "../../operators/impl/get";
import { removeStyleTags } from "../../local/impl/helper";

export const get = async (): Promise<Operator[]> => {
    const data = await getAll();
    /**
     * @author Credit to https://github.com/Awedtan/HellaAPI/blob/main/src/load.ts#L842
     */

    const operators = await getAllOperators();

    const recruitDetail = data.recruitDetail;

    const lines = removeStyleTags(recruitDetail)
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    const recruitables = `${lines[7]}/${lines[10]}/${lines[13]}/${lines[16]}/${lines[19]}/${lines[22]}`.split("/").map((line) => operators.find((operator) => operator.name.toLowerCase() === line.trim().toLowerCase()));

    return recruitables.filter((operator) => operator !== undefined) as Operator[];
};

export const getRecruitmentTags = async (): Promise<string[]> => {
    const data = await getAll();
    const tags = data.gachaTags.map((tag) => tag.tagName);
    return tags;
};

export const getAll = async (): Promise<Gacha> => {
    const data = await getGacha(ExcelTables.GACHA_TABLE);
    return data;
};
