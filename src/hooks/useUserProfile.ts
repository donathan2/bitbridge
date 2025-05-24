
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  bio: string | null;
  skill_level: string | null;
  experience_points: number;
  experience_level: number;
  bits_currency: number;
  bytes_currency: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: string;
  xp_reward: number;
  icon_name: string;
  earned_at?: string;
  progress?: number;
  total?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'ongoing' | 'completed';
  difficulty: string;
  technologies: string[];
  progress?: number;
  xp_reward?: number;
  github_url?: string;
  started_date?: string;
  completed_date?: string;
  members: Array<{
    role: string;
    user_id: string;
  }>;
}

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        setProfile(profileData);

        // Fetch user achievements with achievement details
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('user_achievements')
          .select(`
            earned_at,
            progress,
            total,
            achievements (
              id,
              title,
              description,
              category,
              rarity,
              xp_reward,
              icon_name
            )
          `)
          .eq('user_id', user.id);

        if (achievementsError) throw achievementsError;

        // Also fetch available achievements that user hasn't earned
        const { data: allAchievements, error: allAchievementsError } = await supabase
          .from('achievements')
          .select('*');

        if (allAchievementsError) throw allAchievementsError;

        // Combine earned and unearned achievements
        const earnedAchievementIds = achievementsData?.map(ua => ua.achievements?.id) || [];
        const unearnedAchievements = allAchievements?.filter(a => !earnedAchievementIds.includes(a.id)) || [];

        const combinedAchievements = [
          ...(achievementsData?.map(ua => ({
            ...ua.achievements,
            earned_at: ua.earned_at,
            progress: ua.progress,
            total: ua.total
          })) || []),
          ...unearnedAchievements
        ];

        setAchievements(combinedAchievements);

        // Fetch user projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('project_members')
          .select(`
            role,
            projects (
              id,
              title,
              description,
              status,
              difficulty,
              technologies,
              progress,
              xp_reward,
              github_url,
              started_date,
              completed_date
            )
          `)
          .eq('user_id', user.id);

        if (projectsError) throw projectsError;

        // Transform the data to include member info
        const transformedProjects = projectsData?.map(pm => ({
          ...pm.projects,
          members: [{ role: pm.role, user_id: user.id }]
        })) || [];

        setProjects(transformedProjects);

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  return {
    profile,
    achievements,
    projects,
    loading,
    error
  };
};
