import { OperatorRarity } from "./operators";

export type Gacha = {
    gachaPoolClient: GachaPool[];
    newbeeGachaPoolClient: NewbeeGachaPool[];
    specialRecruitPool: []; // What
    gachaTags: {
        tagId: number;
        tagName: string;
        tagGroup: number;
    }[];
    recruitPool: {
        recruitTimeTable: {
            timeLength: number;
            recruitPrice: number;
        }[];
        recruitConstants: {
            tagPriceList: Record<string, number>;
            maxRecruitTime: number;
        };
    };
    potentialMaterialConverter: {
        items: Record<
            string,
            {
                id: string;
                count: number;
                type: string;
            }
        >;
    };
    classicPotentialMaterialConverter: {
        items: Record<
            string,
            {
                id: string;
                count: number;
                type: string;
            }
        >;
    };
    recruitRarityTable: Record<
        string,
        {
            rarityStart: number;
            rarityEnd: number;
        }
    >;
    specialTagRarityTable: Record<string, number[]>;
    recruitDetail: string;
    carousel: GachaCarousel[];
    freeGacha: FreeGacha[];
    limitTenGachaItem: {
        itemId: string;
        endTime: number;
    }[];
    linkageTenGachaItem: {
        itemId: string;
        endTime: number;
        gachaPoolId: string;
    }[];
    normalGachaItem: {
        itemId: string;
        endTime: number;
        gachaPoolId: string;
        isTen: boolean;
    }[];
    fesGachaPoolRelateItem: Record<
        string,
        {
            rarityRank5ItemId: string;
            rarityRank6ItemId: string;
        }
    >;
    dicRecruit6StarHint: Record<string, string>;
};

export type GachaPool = {
    gachaPoolId: string;
    gachaIndex: number;
    openTime: number;
    endTime: number;
    gachaPoolName: string;
    gachaPoolSummary: string;
    gachaPoolDetail: string;
    guarantee5Avail: number;
    guarantee5Count: number;
    LMTGSID: string | null;
    CDPrimColor: string | null;
    CDSecColor: string | null;
    freeBackColor: string | null;
    gachaRuleType: GachaRuleType;
    dynMeta:
        | {
              /**
               * @description Celebration
               */
              attainRare6CharList: string[]; // Character IDs
              attainRare6Num: number;
          }
        | {
              main6RarityCharId: string;
              rare5CharList: string[]; // Character IDs
              scrollIndex: number;
              sub6RarityCharId: string;
          }
        | {
              /**
               * @description Kernel locating
               */
              chooseRuleConst: string;
              homeDescConst: string;
              rarityPickCharDict: Record<OperatorRarity, string[]>; // Character IDs
              scrollIndex: number;
              star5ChooseRuleConst: string;
              star6ChooseRuleConst: string;
          }
        | null; // Celebration
    linkageRuleId: string | null;
    linkageParam: {
        guaranteeTarget6Count: number;
    } | null;
    limitParam: {
        freeCount: number;
        hasFreeChar: boolean;
        limitedCharId: string;
    } | null;
};

export enum GachaRuleType {
    NORMAL = "NORMAL", // Standard banner
    LIMITED = "LIMITED",
    SINGLE = "SINGLE",
    LINKAGE = "LINKAGE", // R6 banner for example
    ATTAIN = "ATTAIN", // Celebration
    CLASSIC = "CLASSIC", // Kernel headhunting
    FESCLASSIC = "FESCLASSIC", // Kernel locating
}

export type NewbeeGachaPool = {
    gachaPoolId: string;
    gachaIndex: number;
    gachaPoolName: string;
    gachaPoolDetail: string;
    gachaPrice: number;
    gachaTimes: number;
    gachaOffset: string; // Idk why this is a string lol
};

export type GachaCarousel = {
    poolId: string;
    index: number;
    startTime: number;
    endTime: number;
    spriteId: string;
};

export type FreeGacha = {
    poolId: string;
    openTime: number;
    endTime: number;
    freeCount: number;
};
