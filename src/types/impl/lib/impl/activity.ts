export type Activity = {
    basicInfo: BasicInfo;
    homeActConfig: HomeActConfig;
    zoneToActivity: ZoneToActivity;
    missionData: MissionDaum[];
    missionGroup: MissionGroup[];
    replicateMissions: any;
    activity: Activity2;
    //extraData: ExtraData;
    //activityItems: ActivityItems;
    //syncPoints: SyncPoints;
    //dynActs: DynActs;
    //stageRewardsData: StageRewardsData;
    //actThemes: ActTheme[];
    //actFunData: ActFunData;
    //carData: CarData;
    //siracusaData: SiracusaData;
    //kvSwitchData: KvSwitchData;
    //dynEntrySwitchData: DynEntrySwitchData;
    //hiddenStageData: HiddenStageDaum[];
    //missionArchives: MissionArchives;
    //fifthAnnivExploreData: FifthAnnivExploreData;
    //stringRes: StringRes;
    //activityTraps: ActivityTraps;
    //activityTrapMissions: ActivityTrapMissions;
    //trapRuneDataDict: TrapRuneDataDict;
};

export type BasicInfo = Record<
    string,
    {
        id: string;
        type: string;
        displayType: string;
        name: string;
        startTime: number;
        endTime: number;
        rewardEndTime: number;
        displayOnHome: boolean;
        hasStage: boolean;
        templateShopId: string | null;
        medalGroupId: string | null;
        ungroupedMedalIds: string[] | null;
        isReplicate: boolean;
        needFixedSync: boolean;
        trapDomainId: string | null;
        isPageEntry: boolean;
    }
>;

export type HomeActConfig = Record<
    string,
    {
        actId: string;
        isPopupAfterCheckin: boolean;
        showTopBarMenu: boolean;
        actTopBarColor: string;
        actTopBarText: string;
    }
>;

export type ZoneToActivity = Record<string, string>;

export type MissionDaum = {
    id: string;
    sortId: number;
    description: string;
    type: string;
    itemBgType: string;
    preMissionIds: string[] | null;
    template: string;
    templateType: string;
    param: string[];
    unlockCondition:
        | {
              stageId: string;
              completeState: string;
          }[]
        | null;
    unlockParam: null;
    missionGroup: string;
    toPage: null;
    periodicalPoint: number;
    rewards?: Reward[];
    backImagePath: null;
    foldId: string | null;
    haveSubMissionToUnlock: boolean;
};

export type Reward = {
    type: string;
    id: string;
    count: number;
};

export type MissionGroup = {
    id: string;
    title: string | null;
    type: string;
    preMissionGroup: null;
    period: null;
    rewards?: Reward[];
    missionIds: string[];
    startTs: number;
    endTs: number;
};

export type Activity2 = {
    DEFAULT: Default;
    //CHECKIN_ONLY: CheckinOnly;
    //CHECKIN_ALL_PLAYER: CheckinAllPlayer;
    //CHECKIN_VS: CheckinVs;
    //TYPE_ACT3D0: TypeAct3D0;
    //TYPE_ACT4D0: TypeAct4D0;
    //TYPE_ACT5D0: TypeAct5D0;
    //TYPE_ACT5D1: TypeAct5D1;
    //COLLECTION: Collection;
    //TYPE_ACT9D0: TypeAct9D0;
    //TYPE_ACT12SIDE: TypeAct12Side;
    //TYPE_ACT13SIDE: TypeAct13Side;
    //TYPE_ACT17SIDE: TypeAct17Side;
    //TYPE_ACT20SIDE: TypeAct20Side;
    //TYPE_ACT21SIDE: TypeAct21Side;
    //LOGIN_ONLY: LoginOnly;
    //SWITCH_ONLY: SwitchOnly;
    //MINISTORY: Ministory;
    //ROGUELIKE: Roguelike;
    //MULTIPLAY_VERIFY2: MultiplayVerify2;
    //INTERLOCK: Interlock;
    //BOSS_RUSH: BossRush;
    //FLOAT_PARADE: FloatParade;
    //MAIN_BUFF: MainBuff;
    //TYPE_ACT24SIDE: TypeAct24Side;
    //TYPE_ACT25SIDE: TypeAct25Side;
    //TYPE_ACT27SIDE: TypeAct27Side;
    //TYPE_ACT42D0: TypeAct42D0;
    //TYPE_ACT29SIDE: TypeAct29Side;
    //YEAR_5_GENERAL: Year5General;
};

export type Default = {
    "1stact": N1stact2;
};

export type N1stact2 = {
    zoneList: ZoneList[];
    shopList: null;
};

export type ZoneList = {
    zoneId: string;
    zoneIndex: string;
    zoneName: string;
    zoneDesc: string;
    itemDropList: string[];
};
