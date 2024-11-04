import type { Gacha } from "../../../../types/impl/lib/impl/gacha";
import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import { Operator, OperatorProfession, OperatorRarity } from "../../../../types/impl/lib/impl/operators";
import { get as getGacha } from "../../local/impl/get";
import { getAll as getAllOperators } from "../../operators/impl/get";
import { removeStyleTags } from "../../local/impl/helper";

// Courtesy of https://github.com/Awedtan/HellaBot/blob/main/src/constants.json
export const tagValues = {
    "": 1,
    melee: 2,
    ranged: 3,
    guard: 5,
    medic: 7,
    vanguard: 11,
    caster: 13,
    sniper: 17,
    defender: 19,
    supporter: 23,
    specialist: 29,
    healing: 31,
    support: 37,
    dps: 41,
    aoe: 43,
    slow: 47,
    survival: 53,
    defense: 59,
    debuff: 61,
    shift: 67,
    "crowd-control": 71,
    nuker: 73,
    summon: 79,
    "fast-redeploy": 83,
    "dp-recovery": 89,
    robot: 97,
    starter: 101,
    senior: 103,
    top: 107,
    elemental: 109,
    TIER_1: 1,
    TIER_2: 101,
    TIER_3: 1,
    TIER_4: 1,
    TIER_5: 103,
    TIER_6: 107,
};

export const rarity = {
    TIER_1: 0,
    TIER_2: 1,
    TIER_3: 2,
    TIER_4: 3,
    TIER_5: 4,
    TIER_6: 5,
    "4": 4,
} as Record<OperatorRarity, number>;

const professions = {
    PIONEER: "Vanguard",
    WARRIOR: "Guard",
    TANK: "Defender",
    SNIPER: "Sniper",
    CASTER: "Caster",
    MEDIC: "Medic",
    SUPPORT: "Supporter",
    SPECIAL: "Specialist",
    TOKEN: "Deployable",
    TRAP: "Deployable",
} as Record<OperatorProfession, string>;

export const get = async (
    tags: string[],
): Promise<
    {
        tags: string;
        operators: Operator[];
    }[]
> => {
    const recruitmentTags = await getRecruitmentTags();
    const recruitableOperators = await getRecruitableOperators();

    tags = recruitmentTags.filter((tag) => tags.map((tag) => tag.toLowerCase()).includes(tag.toLowerCase()));

    /**
     * @author As usual, credit to https://github.com/Awedtan/HellaBot/blob/main/src/utils/build.ts#L975
     *
     */
    // chatgpt prompt: in javascript, i have an array of 1-5 unique prime numbers. write a function to get all possible distinct combinations of prime numbers, where a combination of numbers is their product
    const getPrimeCombinations = (primes: number[], currentCombination: number[] = [], index = 0, result: number[] = []): number[] => {
        if (currentCombination.length > 0) {
            const product = currentCombination.reduce((acc, prime) => acc * prime, 1);
            result.push(product);
        }
        for (let i = index; i < primes.length; i++) {
            if (!currentCombination.includes(primes[i])) {
                getPrimeCombinations(primes, [...currentCombination, primes[i]], i, result);
            }
        }
        return result;
    };

    const primeTags = tags.map((tag) => tagValues[tag.toLowerCase() as keyof typeof tagValues]);
    const opMap: Record<number, Operator[]> = getPrimeCombinations(primeTags).reduce((acc: Record<number, Operator[]>, combination) => {
        acc[combination] = [];
        return acc;
    }, {});
    /*
    recruitableOperators.forEach((operator) => {
        const temp = operator.tagList;
        const primeTag = temp.map((tag) => tagValues[tag.toLowerCase() as keyof typeof tagValues]).reduce((acc, tag) => acc * tag, 1);
        if (opMap[primeTag] !== undefined) {
            opMap[primeTag].push(operator);
        }
    });
    */
    for (const key of Object.keys(opMap)) {
        for (const op of recruitableOperators) {
            if (op.recruitId % parseInt(key) !== 0) continue;
            if (op.recruitId % tagValues["top"] === 0 && parseInt(key) % tagValues["top"] !== 0) continue;

            opMap[Number(key)].push(op.operator);
        }
    }

    // Sort by rarity
    for (const value of Object.values(opMap)) {
        value.sort((a, b) => {
            return rarity[b.rarity] - rarity[a.rarity];
        });
    }

    // Find combinations
    const sortArr = [];
    for (const key of Object.keys(opMap)) {
        const tags = Object.keys(tagValues).filter((x) => x !== "" && x.slice(0, 4) !== "TIER" && parseInt(key) % tagValues[x as keyof typeof tagValues] === 0);
        if (opMap[Number(key)].length === 0) continue;
        sortArr.push([tags.join(" + "), opMap[Number(key)]]);
    }

    const formattedResult = sortArr.map((x) => {
        return {
            tags: x[0],
            operators: x[1],
        };
    });

    return formattedResult as {
        tags: string;
        operators: Operator[];
    }[];
};

export const getRecruitableOperators = async (): Promise<
    {
        operator: Operator;
        recruitId: number;
    }[]
> => {
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
    const recruitables = `${lines[7]}/${lines[10]}/${lines[13]}/${lines[16]}/${lines[19]}/${lines[22]}`
        .split("/")
        .map((line) => operators.find((operator) => operator.name.toLowerCase() === line.trim().toLowerCase()))
        .filter((operator) => operator !== undefined) as Operator[];
    const result = recruitables.map((operator) => {
        const rarityId = tagValues[operator.rarity] ?? 1;
        const positionId = tagValues[operator.position.toLowerCase() as keyof typeof tagValues] ?? 1;
        const classId = tagValues[professions[operator.profession].toLowerCase() as keyof typeof tagValues] ?? 1;
        let tagId = 1;
        for (const tag of operator.tagList) {
            tagId *= tagValues[tag.toLowerCase() as keyof typeof tagValues] ?? 1;
        }
        // Robot is not explicitly defined as a tag, infer from operator description instead
        if (operator.itemDesc !== null && operator.itemDesc.includes("robot")) {
            tagId *= tagValues["robot"];
        }

        const recruitId = rarityId * positionId * classId * tagId;

        return {
            operator: operator,
            recruitId: recruitId,
        };
    });

    return result;
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
