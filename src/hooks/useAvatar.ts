
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';

export const useAvatar = (userId?: string) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  // If userId is provided and it's different from current user, we'd need additional logic
  // For now, handling current user case
  const currentUserId = userId || user?.id;
  
  if (currentUserId === user?.id) {
    return {
      avatarUrl: profile?.profile_picture_url || profile?.avatar_url || user?.user_metadata?.avatar_url || "/placeholder.svg",
      name: profile?.full_name || user?.user_metadata?.full_name || user?.email || 'User',
      username: profile?.username || user?.email?.split('@')[0] || 'user'
    };
  }
  
  // For other users, return placeholder for now
  return {
    avatarUrl: "/placeholder.svg",
    name: "User",
    username: "user"
  };
};
