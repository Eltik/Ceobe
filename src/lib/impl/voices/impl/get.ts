import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import { get as getVoices } from "../../local/impl/get";
import type { CharacterWords, Voices } from "../../../../types/impl/lib/impl/voices";
import { REPOSITORY } from "..";

export const get = async (id: string): Promise<CharacterWords | null> => {
    const voices = await getAll();
    const voice = voices.find((voice) => voice.id === id) ?? null;

    if (voice) {
        Object.assign(voice, {
            voiceURL: `https://raw.githubusercontent.com/${REPOSITORY}/refs/heads/main/voice/${voice.voiceAsset}.mp3`,
        });
    }

    return voice;
};

export const getByCharacterId = async (id: string): Promise<CharacterWords[]> => {
    const voiceList = await getAll();
    const voices = voiceList.filter((voice) => voice.charId === id);

    for (const voice of voices) {
        Object.assign(voice, {
            voiceURL: `https://raw.githubusercontent.com/${REPOSITORY}/refs/heads/main/voice/${voice.voiceAsset}.mp3`,
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
