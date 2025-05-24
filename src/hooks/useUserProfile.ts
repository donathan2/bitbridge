
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
        console.log('Fetching user data for:', user.id);
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile error:', profileError);
          throw profileError;
        }

        console.log('Profile data:', profileData);
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

        if (achievementsError) {
          console.error('Achievements error:', achievementsError);
          throw achievementsError;
        }

        // Also fetch available achievements that user hasn't earned
        const { data: allAchievements, error: allAchievementsError } = await supabase
          .from('achievements')
          .select('*');

        if (allAchievementsError) {
          console.error('All achievements error:', allAchievementsError);
          throw allAchievementsError;
        }

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

        console.log('Combined achievements:', combinedAchievements);
        setAchievements(combinedAchievements);

        // Fetch user's projects (both created and joined)
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select(`
            *,
            project_members!inner (
              role,
              user_id,
              joined_at
            )
          `)
          .eq('project_members.user_id', user.id);

        if (projectsError) {
          console.error('Projects error:', projectsError);
          throw projectsError;
        }

        // Transform projects data to match expected format
        const transformedProjects = projectsData?.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          status: 'ongoing' as const, // All joined projects are ongoing for now
          difficulty: project.difficulty,
          technologies: project.categories, // Using categories as technologies
          progress: 50, // Default progress for now
          xp_reward: project.xp_reward,
          github_url: project.github_url,
          started_date: project.project_members[0]?.joined_at || project.created_at,
          members: project.project_members.map((member: any) => ({
            role: member.role,
            user_id: member.user_id
          }))
        })) || [];

        console.log('Transformed projects:', transformedProjects);
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
