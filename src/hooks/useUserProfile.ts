
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
        setError(null);
        console.log('Fetching user data for:', user.id);
        
        // Fetch user profile
        console.log('Fetching user profile...');
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile error:', profileError);
          throw new Error(`Profile fetch failed: ${profileError.message}`);
        }

        console.log('Profile data:', profileData);
        setProfile(profileData);

        // Fetch user achievements with achievement details
        console.log('Fetching achievements...');
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
          throw new Error(`Achievements fetch failed: ${achievementsError.message}`);
        }

        // Also fetch available achievements that user hasn't earned
        console.log('Fetching all achievements...');
        const { data: allAchievements, error: allAchievementsError } = await supabase
          .from('achievements')
          .select('*');

        if (allAchievementsError) {
          console.error('All achievements error:', allAchievementsError);
          throw new Error(`All achievements fetch failed: ${allAchievementsError.message}`);
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

        // Fetch user's joined projects - with improved error handling
        console.log('Fetching project memberships...');
        try {
          const { data: membershipData, error: membershipError } = await supabase
            .from('project_members')
            .select('project_id, role, joined_at')
            .eq('user_id', user.id);

          if (membershipError) {
            console.error('Membership error:', membershipError);
            console.log('Setting projects to empty array due to membership error');
            setProjects([]);
            return; // Continue without failing the entire load
          }

          console.log('Membership data:', membershipData);

          if (membershipData && membershipData.length > 0) {
            const projectIds = membershipData.map(m => m.project_id);
            
            // Fetch the actual project details
            console.log('Fetching project details for IDs:', projectIds);
            const { data: projectsData, error: projectsError } = await supabase
              .from('projects')
              .select('*')
              .in('id', projectIds);

            if (projectsError) {
              console.error('Projects error:', projectsError);
              console.log('Setting projects to empty array due to projects error');
              setProjects([]);
              return; // Continue without failing the entire load
            }

            // Transform projects data to match expected format
            const transformedProjects = projectsData?.map(project => {
              const membership = membershipData.find(m => m.project_id === project.id);
              return {
                id: project.id,
                title: project.title,
                description: project.description,
                status: 'ongoing' as const,
                difficulty: project.difficulty,
                technologies: project.categories || [],
                progress: 50, // Default progress for now
                xp_reward: project.xp_reward,
                github_url: project.github_url,
                started_date: membership?.joined_at || project.created_at,
                members: [{
                  role: membership?.role || 'Developer',
                  user_id: user.id
                }]
              };
            }) || [];

            console.log('Transformed projects:', transformedProjects);
            setProjects(transformedProjects);
          } else {
            console.log('No project memberships found');
            setProjects([]);
          }
        } catch (projectError) {
          console.error('Error in project fetching section:', projectError);
          console.log('Setting projects to empty array due to project section error');
          setProjects([]);
          // Continue without failing the entire load
        }

      } catch (err) {
        console.error('Error fetching user data:', err);
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading profile data';
        setError(errorMessage);
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
