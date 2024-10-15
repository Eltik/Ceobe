export type Zones = {
    zones: Record<string, Zone>;
    weeklyAdditionInfo: Record<string, WeeklyAdditionInfo>;
    zoneValidInfo: Record<string, ZoneValidInfo>;
    mainlineAdditionInfo: Record<string, MainZone>;
    zoneRecordGroupedData: Record<string, RecordGroupZone>;
    zoneRecordRewardData: Record<string, string[]>;
    zoneMetaData: Record<string, ZoneMetaData>;
};

export type Zone = {
    zoneID: string;
    zoneIndex: number;
    type: string;
    zoneNameFirst: string;
    zoneNameSecond: string;
    zoneNameTitleCurrent: string;
    zoneNameTitleUnCurrent: string;
    zoneNameTitleEx: string;
    zoneNameThird: string;
    lockedText: string;
    canPreview: boolean;
    hasAdditionalPanel: boolean;
};

// Main story stages
export type MainZone = {
    zoneId: string;
    chapterId: string;
    preposedZoneId: string | null;
    zoneIndex: number;
    startStageId: string;
    endStageId: string;
    mainlneBgName: string;
    recapId: string;
    recapPreStageId: string;
    buttonName: string;
    buttonStyle: string;
    spoilAlert: boolean;
    zoneOpenTime: number; // -1 is open all the time
    diffGroup: string[];
};

export type RecordGroupZone = {
    zoneId: string;
    records: {
        recordId: string;
        zoneId: string;
        recordTitleName: string;
        preRecordId: string | null;
        nodeTitle1: string | null;
        nodeTitle2: string | null;
        rewards: {
            bindStageId: string;
            stageDiff1: string;
            stageDiff: string;
            textPath: string;
            textDesc: string;
            recordReward: {
                id: string;
                count: number;
                type: string;
            }[];
        }[];
        unlockData: {
            noteId: string;
            zoneId: string;
            initialName: string;
            finalName: string;
            accordingExposeId: string;
            initialDes: string;
            finalDes: string;
            remindDes: string;
        };
    }[];
};

export type WeeklyAdditionInfo = {
    daysOfWeek: number[];
    type: string;
};

export type ZoneValidInfo = {
    startTs: number;
    endTs: number;
};

export type ZoneMetaData = Record<
    string,
    {
        missionId: string;
        recordStageId: string;
        templateDesc: string;
        desc: string;
    }
>;
