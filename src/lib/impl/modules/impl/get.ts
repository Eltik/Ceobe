import { RESOURCE_REPOSITORY } from "..";
import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import type { BattleEquip, Module, ModuleData, Modules } from "../../../../types/impl/lib/impl/modules";
import { get as getMaterials } from "../../local/impl/get";

export const get = async (id: string): Promise<Module | null> => {
    const modules = (await getAll()).equipDict;
    return Object.values(modules).find((module) => module.uniEquipId === id) ?? null;
};

export const getByCharId = async (id: string): Promise<Module[]> => {
    const modules = (await getAll()).equipDict;
    return Object.values(modules).filter((module) => module.charId === id);
};

export const getModuleDetails = async (id: string): Promise<ModuleData | null> => {
    const modules = await getBattleEquip();
    return modules[id] ?? null;
};

export const getAll = async (): Promise<Modules> => {
    const data = (await getMaterials(ExcelTables.UNIEQUIP_TABLE)) as Modules;
    for (const module in data.equipDict) {
        Object.assign(data.equipDict[module], { id: module, image: `https://raw.githubusercontent.com/${RESOURCE_REPOSITORY}/main/equip/icon/${encodeURIComponent(data.equipDict[module].uniEquipIcon)}.png` });
    }
    return data;
};

const getBattleEquip = async (): Promise<BattleEquip> => {
    const data = (await getMaterials(ExcelTables.BATTLE_EQUIP_TABLE)) as BattleEquip;
    return data;
};
