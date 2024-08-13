import { fetchGameData } from "./storage";

export const getOperator = async (): Promise<CharacterData[]> => {
    return await fetchGameData("character_table");
};

export type CharacterData = {
    instId: number;
    charId: string;
    favorPoint: number;
    potentialRank: number;
    mainSkillLvl: number;
    skin: string;
    level: number;
    exp: number;
    evolvePhase: number;
    defaultSkillIndex: number;
    gainTime: number;
    skills: {
        skillId: string;
        unlock: number;
        state: number;
        specializeLevel: number;
        completeUpgradeTime: number;
        static: {
            name: string;
            description: string;
            duration: number;
            levels: {
                name: string;
                rangeId: string | null;
                description: string;
                skillType: number;
                durationType: number;
                spData: {
                    spType: number;
                    levelUpCost: [];
                    maxChargeTime: number;
                    spCost: number;
                    initSp: number;
                    increment: number;
                };
                prefabId: string;
                duration: number;
                blackboard: { key: string; value: number; valueStr: string | null }[];
            }[];
            skillId: string;
            iconId: string | null;
            hidden: boolean;
        };
    }[];
    voiceLan: string; // Could be fixed string like JP | CN | EN | KR | TW etc.
    currentEquip: null; // TODO: Figure out what currentEquip is lol. Maybe its module
    equip: Record<
        string,
        {
            hide: number;
            locked: number;
            level: number;
        }
    >;
    static: {
        name: string;
        description: string;
        nationId: string;
        appellation: string;
        position: string;
        profession: string;
        subProfessionId: string;
        trust: number;
        rarity: string;
    };
};
