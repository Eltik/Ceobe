import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import { get as getVoices } from "../../local/impl/get";
import { CharacterWords, Languages, Voices } from "../../../../types/impl/lib/impl/voices";

const VOICE_REPOSITORY = "PseudoMon/arknights-audio";

export const get = async (id: string, language: Languages = Languages.JP): Promise<CharacterWords | null> => {
    const voices = await getAll();
    const voice = voices.find((voice) => voice.id === id) ?? null;

    if (voice) {
        const voiceAsset = voice.voiceAsset;
        let dir = voiceAsset.split("/")[0];
        const file = voiceAsset.split("/")[1];

        if (!isCustom(language) && voiceAsset.split("/")[0].split("_").length > 4) {
            dir = voiceAsset.split("/")[0].split("_").slice(0, -2).join("_");
        } else if (isCustom(language) && voiceAsset.split("/")[0].split("_").length > 4) {
            dir = voiceAsset.split("/")[0];
        } else if (isCustom(language)) {
            const appended = appendedCustom(language);
            dir = voiceAsset.split("/")[0] + appended;
        }

        Object.assign(voice, {
            voiceURL: `https://raw.githubusercontent.com/${VOICE_REPOSITORY}/global-server-voices/${language === Languages.CN ? "voice_cn" : language === Languages.JP ? "voice" : language === Languages.KR ? "voice_kr" : language === Languages.EN ? "voice_en" : "voice"}/${dir.toLowerCase()}/${file}.mp3`,
            language,
        });
    }

    return voice;
};

const isCustom = (lang: Languages) => {
    return lang !== Languages.EN && lang !== Languages.JP && lang !== Languages.KR && lang !== Languages.CN;
};

const appendedCustom = (lang: Languages) => {
    switch (lang) {
        case Languages.GER:
            return "_ger";
        case Languages.ITA:
            return "_ita";
        case Languages.RUS:
            return "_rus";
        default:
            return "";
    }
};

export const getByCharacterId = async (id: string, language: Languages = Languages.JP): Promise<CharacterWords[]> => {
    const voiceList = await getAll();
    const voices = voiceList.filter((voice) => voice.charId === id);

    for (const voice of voices) {
        const voiceAsset = voice.voiceAsset;
        let dir = voiceAsset.split("/")[0];
        const file = voiceAsset.split("/")[1];

        if (!isCustom(language) && voiceAsset.split("/")[0].split("_").length > 4) {
            dir = voiceAsset.split("/")[0].split("_").slice(0, -2).join("_");
        } else if (isCustom(language) && voiceAsset.split("/")[0].split("_").length > 4) {
            dir = voiceAsset.split("/")[0];
        } else if (isCustom(language)) {
            const appended = appendedCustom(language);
            dir = voiceAsset.split("/")[0] + appended;
        }

        Object.assign(voice, {
            voiceURL: `https://raw.githubusercontent.com/${VOICE_REPOSITORY}/global-server-voices/${language === Languages.CN ? "voice_cn" : language === Languages.JP ? "voice" : language === Languages.KR ? "voice_kr" : language === Languages.EN ? "voice_en" : "voice"}/${dir.toLowerCase()}/${file}.mp3`,
            language,
        });
    }

    return voices;
};

export const getAllLines = async (): Promise<
    {
        name: string;
        id: string;
    }[]
> => {
    const voices = await getAll();
    const voiceLines: {
        name: string;
        id: string;
    }[] = [];
    for (const voice of voices) {
        const title = voice.voiceTitle;
        if (voiceLines.some((line) => line.name === title || line.id === voice.id)) continue;
        voiceLines.push({
            name: title,
            id: voice.id ?? "",
        });
    }
    return voiceLines;
};

export const getAll = async (): Promise<CharacterWords[]> => {
    const data = (await getVoices(ExcelTables.CHARWORD_TABLE)) as Voices;
    const voices = Object.entries(data.charWords).map(([id, data]) => ({
        id,
        ...data,
    }));

    return voices;
};
