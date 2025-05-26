
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

export const useUserAchievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
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

    } catch (err) {
      console.error('Error fetching achievements:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading achievements';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return {
    achievements,
    loading,
    error,
    refetch: fetchAchievements
  };
};
