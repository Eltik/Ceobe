import type { Activity, BasicInfo } from "../../../../types/impl/lib/impl/activity";
import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import type { Zone } from "../../../../types/impl/lib/impl/zones";
import { get as getActivity } from "../../local/impl/get";

export const get = async (zone: Zone): Promise<BasicInfo | null> => {
    if (zone.type === "ACTIVITY") {
        const data = (await getActivity(ExcelTables.ACTIVITY_TABLE)) as Activity;
        const activities = Object.values(data.basicInfo);
        const found = activities.find((activity) => activity.id === zone.zoneID.split("_")[0]);
        return (found as unknown as BasicInfo) ?? null;
    }
    return null;
};
