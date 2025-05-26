
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAvatar = (userId?: string) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [otherUserProfile, setOtherUserProfile] = useState<any>(null);
  
  // If userId is provided and it's different from current user, fetch that user's profile
  useEffect(() => {
    if (userId && userId !== user?.id) {
      const fetchOtherUserProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        setOtherUserProfile(data);
      };
      fetchOtherUserProfile();
    } else {
      setOtherUserProfile(null);
    }
  }, [userId, user?.id]);
  
  // If userId is provided and it's different from current user
  if (userId && userId !== user?.id && otherUserProfile) {
    return {
      avatarUrl: otherUserProfile.profile_picture_url || otherUserProfile.avatar_url || "/placeholder.svg",
      name: otherUserProfile.full_name || 'User',
      username: otherUserProfile.username || 'user'
    };
  }
  
  // For current user or when userId matches current user
  if (!userId || userId === user?.id) {
    return {
      avatarUrl: profile?.profile_picture_url || profile?.avatar_url || user?.user_metadata?.avatar_url || "/placeholder.svg",
      name: profile?.full_name || user?.user_metadata?.full_name || user?.email || 'User',
      username: profile?.username || user?.email?.split('@')[0] || 'user'
    };
  }
  
  // Fallback for loading state
  return {
    avatarUrl: "/placeholder.svg",
    name: "User",
    username: "user"
  };
};
