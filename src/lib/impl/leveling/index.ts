export const EXPERIENCE_PER_CHALLENGE = 100;

export const getExperienceForNextLevel = (level: number): number => level ** 2 * 100;
export const awardExperience = (userExperience: number, userLevel: number, experience: number): { userExperience: number; userLevel: number; levelUps: number } => {
    userExperience += experience;

    let levelUps = 0;
    while (userExperience >= getExperienceForNextLevel(userLevel)) {
        userExperience -= getExperienceForNextLevel(userLevel);
        userLevel++;
        levelUps++;
    }

    return { userExperience, userLevel, levelUps };
};
