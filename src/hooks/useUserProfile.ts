
import { useUserProfileData, UserProfile } from './useUserProfileData';
import { useUserAchievements, Achievement } from './useUserAchievements';
import { useUserProjects, Project, ProjectMember } from './useUserProjects';

export type { UserProfile, Achievement, ProjectMember, Project };

export const useUserProfile = () => {
  const { 
    profile, 
    loading: profileLoading, 
    error: profileError, 
    updateActiveTitle, 
    refetch: refetchProfile 
  } = useUserProfileData();
  
  const { 
    achievements, 
    loading: achievementsLoading, 
    error: achievementsError, 
    refetch: refetchAchievements 
  } = useUserAchievements();
  
  const { 
    projects, 
    loading: projectsLoading, 
    error: projectsError, 
    refetch: refetchProjects 
  } = useUserProjects();

  // Combine loading states
  const loading = profileLoading || achievementsLoading || projectsLoading;
  
  // Combine errors (prioritize profile error as it's most critical)
  const error = profileError || achievementsError || projectsError;

  // Combined refetch function
  const refetch = async () => {
    await Promise.all([
      refetchProfile(),
      refetchAchievements(),
      refetchProjects()
    ]);
  };

  return {
    profile,
    achievements,
    projects,
    loading,
    error,
    updateActiveTitle,
    refetch
  };
};
