export type Voices = {
    charWords: Record<string, CharacterWords>;
    // ...
};

export enum Languages {
    CN = "cn",
    EN = "en",
    JP = "jp",
    KR = "kr",
    GER = "ger",
    ITA = "ita",
    RUS = "rus",
}

export type CharacterWords = {
    charWordId: string;
    wordKey: string;
    charId: string;
    voiceId: string;
    voiceText: string;
    voiceTitle: string;
    voiceIndex: number;
    voiceType: string; // ENUM or ONLY_TEXT
    unlockType: string; // DIRECT or FAVOR etc.
    unlockParam: {
        valueStr: string | null;
        valueInt: number;
    }[];
    lockDescription: string;
    placeType: string;
    voiceAsset: string; // Aceship will then have the voice line for this

    // Added fields
    id?: string;
    voiceURL?: string;
    language?: Languages;
};
