
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAvatar = (userId?: string) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [otherUserProfile, setOtherUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // If userId is provided and it's different from current user, fetch that user's profile
  useEffect(() => {
    if (userId && userId !== user?.id) {
      setLoading(true);
      const fetchOtherUserProfile = async () => {
        try {
          // First try to get from profiles table
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
          
          // Also try to get from user_profiles for additional data
          const { data: userProfileData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
          
          setOtherUserProfile({ 
            ...profileData, 
            user_profile: userProfileData 
          });
        } catch (error) {
          console.error('Error fetching other user profile:', error);
          setOtherUserProfile(null);
        } finally {
          setLoading(false);
        }
      };
      fetchOtherUserProfile();
    } else {
      setOtherUserProfile(null);
      setLoading(false);
    }
  }, [userId, user?.id]);
  
  // If userId is provided and it's different from current user
  if (userId && userId !== user?.id) {
    if (loading) {
      return {
        avatarUrl: "/placeholder.svg",
        name: "Loading...",
        username: "loading",
        loading: true
      };
    }
    
    if (otherUserProfile) {
      return {
        avatarUrl: otherUserProfile.profile_picture_url || 
                  otherUserProfile.avatar_url || 
                  "/placeholder.svg",
        name: otherUserProfile.full_name || 'User',
        username: otherUserProfile.username || 'user',
        loading: false
      };
    }
    
    // Fallback for other user
    return {
      avatarUrl: "/placeholder.svg",
      name: "User",
      username: "user",
      loading: false
    };
  }
  
  // For current user or when userId matches current user
  if (!userId || userId === user?.id) {
    // Get avatar from multiple potential sources, prioritizing profile_picture_url
    const avatarUrl = profile?.profile_picture_url || 
                     profile?.avatar_url || 
                     user?.user_metadata?.avatar_url || 
                     user?.user_metadata?.picture ||
                     "/placeholder.svg";
    
    const name = profile?.full_name || 
                user?.user_metadata?.full_name || 
                user?.user_metadata?.name ||
                user?.email?.split('@')[0] || 
                'User';
    
    const username = profile?.username || 
                    user?.user_metadata?.user_name ||
                    user?.user_metadata?.preferred_username ||
                    user?.email?.split('@')[0] || 
                    'user';
    
    return {
      avatarUrl,
      name,
      username,
      loading: false
    };
  }
  
  // Fallback for loading state
  return {
    avatarUrl: "/placeholder.svg",
    name: "User",
    username: "user",
    loading: false
  };
};
