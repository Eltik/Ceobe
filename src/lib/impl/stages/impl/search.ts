import type { Stage } from "../../../../types/impl/lib/impl/stages";
import { getAll } from "./get";
import { get as getZone } from "../../zones/impl/get";
import { get as getActivity } from "../../activity/impl/get";
import { RESOURCE_REPOSITORY } from "..";

export const search = async (query: string): Promise<Stage[]> => {
    const data = await getAll();
    const stages = data.filter((stage) => stage.code?.toLowerCase()?.includes(query.toLowerCase()) || stage.name?.toLowerCase()?.includes(query.toLowerCase()) || stage.code?.toLowerCase()?.startsWith(query.toLowerCase()) || stage.name?.toLowerCase()?.startsWith(query.toLowerCase()));

    const promises: Promise<void>[] = [];

    for (const stage of stages) {
        const promise = new Promise<void>(async (resolve) => {
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

            resolve();
        });

        promises.push(promise);
    }

    await Promise.all(promises);

    return stages;
};
