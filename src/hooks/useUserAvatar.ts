
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

export const useUserAvatar = (userId?: string) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.svg");

  useEffect(() => {
    // If we have a specific userId, we'd need to fetch that user's profile
    // For now, we'll use the current user's profile
    const currentAvatarUrl = profile?.profile_picture_url || 
                             profile?.avatar_url || 
                             user?.user_metadata?.avatar_url || 
                             "/placeholder.svg";
    
    setAvatarUrl(currentAvatarUrl);
  }, [profile, user, userId]);

  return avatarUrl;
};
