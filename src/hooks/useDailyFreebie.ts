
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
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error checking freebie status:', error);
        return false;
      }

      // Check if last_freebie_claimed exists and has a value
      const lastClaimed = (profile as any)?.last_freebie_claimed;
      
      if (!lastClaimed) {
        return true;
      }

      const lastClaimedDate = new Date(lastClaimed);
      const now = new Date();
      const timeDiff = now.getTime() - lastClaimedDate.getTime();
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

      // Get current values first
      const { data: currentProfile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('bits_currency, bytes_currency')
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;

      // Update with new values
      const { error } = await supabase
        .from('user_profiles')
        .update({
          bits_currency: (currentProfile.bits_currency || 0) + bitsReward,
          bytes_currency: (currentProfile.bytes_currency || 0) + bytesReward,
          last_freebie_claimed: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as any)
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
