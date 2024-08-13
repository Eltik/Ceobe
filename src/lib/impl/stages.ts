import { fetchGameData } from "./storage";

export const fetchStages = async (): Promise<StageData[]> => {
    const stages = (await fetchGameData("stage_table")).stages;
    return Object.values(stages);
};

export type StageData = {
    stageType: string;
    difficulty: string;
    performanceStageFlag: string;
    diffGroup: string;
    unlockCondition: []; // TODO: Figure out what this is
    stageId: string;
    levelId: string;
    zoneId: string;
    code: string; // Stage name, like SN-6
    name: string; // Official stage name, like Central Passage
    description: string;
    hardStageId: string | null;
    dangerLevel: string; // Ex. Elite 1 Lv. 40
    dangerPoint: number;
    loadingPicId: string;
    canPractice: boolean;
    canBattleReplay: boolean;
    apCost: number; // How much Sanity it takes
    apFailReturn: number; // How much Sanity returned if you fail
    etItemId: null; // TODO: Figure out what this is
    etCost: number;
    etFailReturn: number;
    etButtonStyle: null; // TODO: Figure out what this is
    apProtectTimes: number; // If you fail, how many times it should fully return your Sanity. Usually is 1.
    diamondOnceDrop: number; // How many OP can be dropped after 3* a stage. Usually 1.
    practiceTicketCost: number;
    dailyStageDifficulty: number; // I think this is related to the Daily CC's?
    expGain: number;
    goldGain: number;
    loseExpGain: number;
    loseGoldGain: number;
    passFavor: number;
    completeFavor: number;
    slProgress: number;
    displayMainItem: null; // TODO: Figure out what this is
    hilightMark: boolean;
    bossMark: boolean;
    isPredefined: boolean;
    isHardPredefined: boolean;
    isSkillSelectablePRedefined: boolean;
    isStoryOnly: boolean;
    appearanceStyle: string;
    stageDropInfo: {
        firstPassRewards: null; // TODO: Figure out what this is
        firstCompleteRewards: null; // TODO: Figure out what this is
        passRewards: null; // TODO: Figure out what this is
        completeRewards: null; // TODO: Figure out what this is
        displayRewards: {
            type: string;
            id: string;
            dropType: string;
        }[];
        displayDetailRewards: {
            occPercent: string;
            type: string;
            id: string;
            dropType: string;
        }[];
    };
    canUseCharm: boolean;
    canUseTech: boolean;
    canUseTrapTool: boolean;
    canUseBattlePerformance: boolean;
    startButtonOverrideId: null; // TODO: Figure out what this is
    isStagePatch: boolean;
    mainStageId: string;
    extraCondition: null; // TODO: Figure out what this is
    extraInfo: null; // TODO: Figure out what this is
};
