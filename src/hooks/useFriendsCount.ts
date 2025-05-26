
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFriendsCount = () => {
  const { user } = useAuth();
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFriendsCount = async () => {
      try {
        setLoading(true);
        setError(null);

        // Count friendships where the user is either user1 or user2
        const { count, error } = await supabase
          .from('friendships')
          .select('*', { count: 'exact', head: true })
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        if (error) {
          console.error('Error fetching friends count:', error);
          throw error;
        }

        setFriendsCount(count || 0);
      } catch (err) {
        console.error('Error in fetchFriendsCount:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch friends count');
        setFriendsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsCount();
  }, [user]);

  return {
    friendsCount,
    loading,
    error
  };
};
