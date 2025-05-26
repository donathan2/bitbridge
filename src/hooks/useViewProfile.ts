
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  created_at: string;
  updated_at: string;
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

        if (profileData) {
          const combinedProfile: ViewProfileData = {
            ...profileData,
            bio: userProfileData?.bio || null,
            skill_level: userProfileData?.skill_level || null,
            experience_points: userProfileData?.experience_points || 0,
            bits_currency: userProfileData?.bits_currency || 0,
            bytes_currency: userProfileData?.bytes_currency || 0,
            active_title: userProfileData?.active_title || null,
          };
          
          console.log('Combined profile data:', combinedProfile);
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
