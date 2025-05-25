
// XP scaling system utilities
export const getExperienceForLevel = (level: number): number => {
  // Progressive scaling: each level requires more XP
  // Level 1: 0 XP, Level 2: 100 XP, Level 3: 250 XP, Level 4: 450 XP, etc.
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
};

export const getLevelFromExperience = (xp: number): number => {
  let level = 1;
  while (getExperienceForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
};

export const getProgressToNextLevel = (xp: number): {
  currentLevel: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressInCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercentage: number;
} => {
  const currentLevel = getLevelFromExperience(xp);
  const currentLevelXP = getExperienceForLevel(currentLevel);
  const nextLevelXP = getExperienceForLevel(currentLevel + 1);
  const progressInCurrentLevel = xp - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const progressPercentage = (progressInCurrentLevel / xpNeededForNextLevel) * 100;

  return {
    currentLevel,
    currentLevelXP,
    nextLevelXP,
    progressInCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage))
  };
};
