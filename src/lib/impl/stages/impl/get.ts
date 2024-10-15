import { RESOURCE_REPOSITORY } from "..";
import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import type { Stage, Stages } from "../../../../types/impl/lib/impl/stages";
import { get as getStages } from "../../local/impl/get";

export const get = async (id: string): Promise<Stage | null> => {
    const stages = await getAll();
    const stage = stages.find((stage) => stage.stageId === id) ?? null;
    if (stage) {
        Object.assign(stage, {
            image: `https://raw.githubusercontent.com/${RESOURCE_REPOSITORY}/main/map/${stage.stageId.replace("easy", "main").replace("tough", "main")}.png`,
        });
    }

    return stage;
};

export const getByName = async (code: string): Promise<Stage | null> => {
    const stages = await getAll();
    const stage = stages.find((stage) => stage.code === code) ?? null;
    if (stage) {
        Object.assign(stage, {
            image: `https://raw.githubusercontent.com/${RESOURCE_REPOSITORY}/main/map/${stage.stageId}.png`,
        });
    }

    return stage;
};

export const getAll = async (): Promise<Stage[]> => {
    const data = (await getStages(ExcelTables.STAGE_TABLE)) as Stages;
    const stages = Object.values(data.stages);
    for (const stage of stages) {
        Object.assign(stage, {
            image: `https://raw.githubusercontent.com/${RESOURCE_REPOSITORY}/main/map/${stage.stageId}.png`,
        });
    }

    return stages;
};
