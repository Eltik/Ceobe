export type Stages = {
    stages: Record<string, Stage>;
    runeStageGroups: Record<string, any>; // Empty object, unsure what this is.
    mapThemes: Record<string, MapTheme>;
    tileInfo: Record<string, TileInfo>;
    forceOpenTable: Record<string, OpenTable>;
    timelyStageDropInfo: Record<string, StageDropInfo>;
    overrideDropInfo: Record<string, OverrideDropInfo>;
    overrideUnlockInfo: Record<string, any>; // Empty object, unsure what this is.
    timelyTable: Record<string, TimelyTable>;
    stageValidInfo: Record<string, StageValidInfo>;
    stageFogInfo: Record<string, StageFogInfo>;
    stageStartConds: Record<string, StageStartConditions>;
    diffGroupTable: Record<string, DifferenceGroupTable>;
    storyStageShowGroup: Record<string, StoryStageShowGroup>;
    specialBattleFinishStageData: Record<string, SpecialBattleFinishStageData> & {
        recordRewardData: boolean;
    };
    apProtectZoneInfo: Record<string, APProtectZoneInfo>;
    antiSpoilerDict: Record<string, any>; // Empty object, unsure what this is.
    actCustomStageDatas: Record<string, ActCustomStageDatas>;
    spNormalStageIdFor4StarList: string[];
};

export type Stage = {
    stageType: string;
    difficulty: string;
    performanceStageFlag: string;
    diffGroup: string;
    unlockCondition: {
        stageId: string;
        completeState: string;
    }[];
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

    // Added fields
    image?: string;
    zoneName?: string;
};

export type MapTheme = {
    themeId: string;
    unitColor: string; // Hex color, eg. #f2ddcf. However, sometimes it doesn't start with #.
    buildingColor: string | null; // Hex color, eg. #f2ddcf. However, sometimes it doesn't start with #.
    themeType: string | null;
    trapTintColor: string | null; // Hex color, eg. #f2ddcf. However, sometimes it doesn't start with #.
};

export type TileInfo = {
    tileKey: string;
    name: string; // Official name, eg. Specialist Tactical Point
    description: string;
    isFunctional: boolean;
};

export type OpenTable = {
    id: string;
    startTime: number;
    endTime: number;
    forceOpenList: string[];
};

export type StageDropInfo = {
    startTs: number;
    endTs: number;
    stagePic: string;
    dropPicId: string;
    stageUnlock: string; // stage ID
    entranceDownPicId: string;
    entranceUpPicId: string;
    timelyGroupId: string;
    weeklyPicId: string;
    isReplace: boolean;
    apSupplyOutOfDateDict: Record<string, number>;
};

export type OverrideDropInfo = {
    itemId: string;
    startTs: number;
    endTs: number;
    zoneRange: string;
    times: number;
    name: string;
    egName: string;
    desc: string;
    desc2: string;
    desc3: string;
    dropTag: string;
    dropTypeDesc: string;
    dropInfo: Record<string, DropInfo>;
};

export type DropInfo = {
    firstPassRewards: null;
    firstCompleteRewards: null;
    passRewards: null;
    completeRewards: null;
    displayRewards: {
        type: string; // Material, like GOLD or MATERIAL
        id: string;
        dropType: string;
    }[];
    displayDetailRewards: {
        occPercent: string;
        type: string; // Material, like GOLD or MATERIAL
        id: string;
        dropType: string;
    }[];
};

export type TimelyTable = {
    dropInfo: Record<string, DropInfo>;
};

export type StageValidInfo = {
    startTs: number;
    endTs: number;
};

export type StageFogInfo = {
    lockId: string;
    fogType: string;
    stageId: string;
    lockName: string;
    lockDesc: string;
    unlockItemId: string;
    unlockItemType: string; // Eg. MATERIAL, GOLD, etc.
    unlockItemNum: number;
    preposedStageId: string;
    preposedLockId: string | null;
};

export type StageStartConditions = {
    requireChars: {
        charId: string;
        evolvePhase: string;
    }[];
    excludeAssists: string[]; // Character IDs
    isNotPass: boolean;
};

export type DifferenceGroupTable = {
    normalId: string;
    toughId: string | null;
    easyId: string;
};

export type StoryStageShowGroup = Record<
    string,
    {
        displayRecordId: string;
        stageId: string;
        accordingStageId: string | null;
        diffGroup: string;
    }
>;

export type SpecialBattleFinishStageData = {
    stageId: string;
    skipAccomplishPerform: boolean;
};

export type APProtectZoneInfo = {
    zoneId: string;
    timeRanges: {
        startTs: number;
        endTs: number;
    }[];
};

export type ActCustomStageDatas = {
    overrideGameMode: string;
};
