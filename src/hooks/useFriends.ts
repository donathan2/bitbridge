
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useFriends = () => {
  const { user } = useAuth();
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFriendsCount = async () => {
      try {
        const { data, error } = await supabase
          .from('friendships')
          .select('id', { count: 'exact' })
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        if (error) throw error;

        setFriendsCount(data?.length || 0);
      } catch (err) {
        console.error('Error fetching friends count:', err);
        setFriendsCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsCount();
  }, [user]);

  return {
    friendsCount,
    loading
  };
};
