import { RESOURCE_REPOSITORY } from "..";
import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import type { Stage, Stages } from "../../../../types/impl/lib/impl/stages";
import { get as getStages } from "../../local/impl/get";
import { get as getZone } from "../../zones/impl/get";
import { get as getActivity } from "../../activity/impl/get";

export const get = async (id: string): Promise<Stage | null> => {
    const stages = await getAll();
    const stage = stages.find((stage) => stage.stageId === id) ?? null;

    const zone = await getZone(stage?.zoneId ?? "");
    const activity = zone ? await getActivity(zone) : null;
    const zoneName = activity ? activity.name : zone ? (zone.zoneNameFirst ?? zone.zoneNameSecond ?? zone.zoneNameThird ?? zone.zoneNameTitleCurrent) : "Unknown";

    if (stage) {
        Object.assign(stage, {
            image: `https://raw.githubusercontent.com/${RESOURCE_REPOSITORY}/main/map/${stage.stageId.replace("easy", "main").replace("tough", "main")}.png`,
        });

        if (zoneName) {
            Object.assign(stage, {
                zoneName,
            });
        }
    }

    return stage;
};

export const getByName = async (code: string): Promise<Stage | null> => {
    const stages = await getAll();
    const stage = stages.find((stage) => stage.code === code) ?? null;

    const zone = await getZone(stage?.zoneId ?? "");
    const activity = zone ? await getActivity(zone) : null;
    const zoneName = activity ? activity.name : zone ? (zone.zoneNameFirst ?? zone.zoneNameSecond ?? zone.zoneNameThird ?? zone.zoneNameTitleCurrent) : "Unknown";

    if (stage) {
        Object.assign(stage, {
            image: `https://raw.githubusercontent.com/${RESOURCE_REPOSITORY}/main/map/${stage.stageId.replace("easy", "main").replace("tough", "main")}.png`,
        });

        if (zoneName) {
            Object.assign(stage, {
                zoneName,
            });
        }
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
