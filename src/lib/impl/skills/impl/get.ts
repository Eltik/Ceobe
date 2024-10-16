import { ExcelTables } from "../../../../types/impl/lib/impl/local";
import type { Skill } from "../../../../types/impl/lib/impl/skills";
import { get as getSkills } from "../../local/impl/get";

export const get = async (id: string): Promise<Skill | null> => {
    const skills = await getAll();
    const skill = skills.find((skill) => skill.id === id) ?? null;
    return skill;
};

export const getAll = async (): Promise<Skill[]> => {
    const data = (await getSkills(ExcelTables.SKILL_TABLE)) as Record<string, Skill>;
    const skills = Object.entries(data).map(([id, data]) => ({
        id,
        ...data,
    }));
    return skills;
};
