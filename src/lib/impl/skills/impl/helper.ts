export const formatSkillType = (type: string): string => {
    return type === "INCREASE_WHEN_ATTACK" ? "Offensive" : type === "INCREASE_WITH_TIME" ? "Auto" : "Defensive";
};
