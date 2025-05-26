
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getLevelFromExperience } from '@/utils/xpUtils';

export interface ViewProfileData {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  profile_picture_url: string | null;
  bio: string | null;
  skill_level: string | null;
  experience_points: number | null;
  bits_currency: number | null;
  bytes_currency: number | null;
  active_title: string | null;
  level: number;
  created_at: string;
  updated_at: string;
  projects?: {
    completed: any[];
    ongoing: any[];
  };
}

export const useViewProfile = (userId?: string) => {
  const [profile, setProfile] = useState<ViewProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for user:', userId);
        
        // Fetch from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        // Fetch from user_profiles table for additional data
        const { data: userProfileData, error: userProfileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (userProfileError) {
          console.error('User profile fetch error:', userProfileError);
        }

        // Fetch user's projects
        const { data: projectMemberships, error: membershipError } = await supabase
          .from('project_members')
          .select('project_id, role, joined_at')
          .eq('user_id', userId);

        let projects = { completed: [], ongoing: [] };
        
        if (!membershipError && projectMemberships && projectMemberships.length > 0) {
          const projectIds = projectMemberships.map(m => m.project_id);
          
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .in('id', projectIds);

          if (!projectsError && projectsData) {
            projects.completed = projectsData.filter(p => p.status === 'completed');
            projects.ongoing = projectsData.filter(p => p.status !== 'completed');
          }
        }

        if (profileData) {
          const experiencePoints = userProfileData?.experience_points || 0;
          const level = getLevelFromExperience(experiencePoints);
          
          const combinedProfile: ViewProfileData = {
            ...profileData,
            bio: userProfileData?.bio || null,
            skill_level: userProfileData?.skill_level || null,
            experience_points: experiencePoints,
            bits_currency: userProfileData?.bits_currency || 0,
            bytes_currency: userProfileData?.bytes_currency || 0,
            active_title: userProfileData?.active_title || null,
            level: level,
            projects
          };
          
          console.log('Combined profile data:', combinedProfile);
          console.log('Experience points:', experiencePoints);
          console.log('Calculated level:', level);
          console.log('Active title:', userProfileData?.active_title);
          setProfile(combinedProfile);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return {
    profile,
    loading,
    error
  };
};
