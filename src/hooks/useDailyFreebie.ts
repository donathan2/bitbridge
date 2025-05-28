
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useDailyFreebie = () => {
  const { user } = useAuth();
  const [claiming, setClaiming] = useState(false);

  const canClaimFreebie = async () => {
    if (!user) return false;

    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('last_freebie_claimed')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking freebie status:', error);
        return false;
      }

      if (!profile?.last_freebie_claimed) {
        return true;
      }

      const lastClaimed = new Date(profile.last_freebie_claimed);
      const now = new Date();
      const timeDiff = now.getTime() - lastClaimed.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);

      return hoursDiff >= 24;
    } catch (error) {
      console.error('Error in canClaimFreebie:', error);
      return false;
    }
  };

  const claimFreebie = async () => {
    if (!user) return;

    const canClaim = await canClaimFreebie();
    if (!canClaim) {
      toast({
        title: "Already Claimed",
        description: "You can only claim your daily freebie once every 24 hours!",
        variant: "destructive",
      });
      return;
    }

    setClaiming(true);

    try {
      // Generate random rewards
      const bitsReward = Math.floor(Math.random() * 201) + 100; // 100-300 bits
      const bytesReward = Math.floor(Math.random() * 16) + 5; // 5-20 bytes

      const { error } = await supabase
        .from('user_profiles')
        .update({
          bits_currency: supabase.raw(`bits_currency + ${bitsReward}`),
          bytes_currency: supabase.raw(`bytes_currency + ${bytesReward}`),
          last_freebie_claimed: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Daily Freebie Claimed!",
        description: `You received ${bitsReward} Bits and ${bytesReward} Bytes!`,
        variant: "default",
      });

    } catch (error) {
      console.error('Error claiming freebie:', error);
      toast({
        title: "Error",
        description: "Failed to claim daily freebie. Please try again.",
        variant: "destructive",
      });
    } finally {
      setClaiming(false);
    }
  };

  return {
    claimFreebie,
    canClaimFreebie,
    claiming
  };
};
