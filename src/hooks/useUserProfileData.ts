
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  bio: string | null;
  skill_level: string | null;
  experience_points: number;
  experience_level: number;
  bits_currency: number;
  bytes_currency: number;
  active_title: string | null;
}

export const useUserProfileData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching user profile data for:', user.id);
      
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*, active_title')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile error:', profileError);
        throw new Error(`Profile fetch failed: ${profileError.message}`);
      }

      console.log('Profile data:', profileData);
      setProfile(profileData);

    } catch (err) {
      console.error('Error fetching user profile data:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading profile data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateActiveTitle = async (titleName: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ active_title: titleName })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? { ...prev, active_title: titleName } : null);
      
      return { success: true };
    } catch (err) {
      console.error('Error updating active title:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update title' 
      };
    }
  };

  return {
    profile,
    loading,
    error,
    updateActiveTitle,
    refetch: fetchProfile
  };
};
