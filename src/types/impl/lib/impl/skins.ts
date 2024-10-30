export type Skins = {
    charSkins: Record<string, Skin>;
    buildinEvolveMap: Record<string, Record<string, string>>; // E2 art ID(s)
    buildinPatchMap: Record<string, Record<string, string>>; // Just for Amiya lol
    brandList: Record<string, Brand>;
    specialSkinInfoList: {
        skinId: string;
        startTime: number;
        endTime: number;
    }[];
};

export type Skin = {
    // Added fields
    id?: string;
    image?: string;
    eliteImage?: string;

    skinId: string;
    charId: string;
    tokenSkinMap:
        | {
              tokenId: string;
              tokenSkinId: string;
          }[]
        | null;
    illustId: string;
    dynIllustId: string | null;
    avatarId: string;
    portraitId: string;
    dynPortraitId: string | null;
    dynEntranceId: string | null;
    buildingId: string | null;
    battleSkin: {
        overwritePrefab: boolean;
        skinOrPrefabId: string;
    };
    isBuySkin: boolean;
    tmplId: string | null;
    voiceId: string | null;
    voiceType: string;
    displaySkin: {
        skinName: string | null;
        colorList: string[];
        titleList: string[];
        modelName: string;
        drawerList: string[];
        designerList: string[] | null;
        skinGroupId: string;
        skinGroupName: string;
        skinGroupSortIndex: number;
        content: string;
        dialogue: string | null;
        usage: string | null;
        description: string | null;
        obtainApproach: string | null;
        sortId: number;
        displayTagId: string | null;
        getTime: number;
        onYear: number;
        onPeriod: number;
    };
};

export type Brand = {
    brandId: string;
    groupList: {
        skinGroupId: string;
        publishTime: number;
    }[];
    kvImgIdList: {
        kvImgId: string;
        linkedSkinGroupId: string;
    }[];
    brandName: string;
    brandCapitalName: string;
    description: string;
    publishTime: number;
    sortId: number;
};
