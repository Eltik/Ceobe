import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import type { Zone, Zones } from "../../../../types/impl/lib/impl/zones";
import { get as getStages } from "../../local/impl/get";

export const get = async (id: string): Promise<Zone | null> => {
    const zones = await getAll();
    for (const zone of zones) {
        const found = zone.zones.find((z) => z.zoneID === id);
        if (found) {
            return found;
        }
    }

    return null;
};

export const getAll = async (): Promise<
    {
        type: string;
        zones: Zone[];
    }[]
> => {
    const data = (await getStages(ExcelTables.ZONE_TABLE)) as Zones;
    const zones = Object.values(data.zones);

    const zoneTypes: string[] = [];
    const result = [];

    for (const zone of zones) {
        const zoneType = zone.type;
        if (!zoneTypes.includes(zoneType)) {
            zoneTypes.push(zoneType);
        }
    }

    // Create an object of all zones
    for (const zoneType of zoneTypes) {
        const zonesOfType = zones.filter((zone) => zone.type === zoneType);
        result.push({
            type: zoneType,
            zones: zonesOfType,
        });
    }

    return result;
};
