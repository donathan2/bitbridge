
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const getStandardRewardsByDifficulty = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner':
      return { xp: 300, bits: 200, bytes: 3 };
    case 'Intermediate':
      return { xp: 600, bits: 400, bytes: 6 };
    case 'Advanced':
      return { xp: 1000, bits: 700, bytes: 12 };
    case 'Expert':
      return { xp: 1500, bits: 1200, bytes: 20 };
    default:
      return { xp: 300, bits: 200, bytes: 3 };
  }
};

export const useProjectCompletion = () => {
  const [loading, setLoading] = useState(false);

  const completeProject = async (projectId: string) => {
    setLoading(true);
    try {
      console.log('🎯 Completing project:', projectId);

      // First get the project details to get the difficulty and rewards
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('difficulty, xp_reward, bits_reward, bytes_reward')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('❌ Error fetching project data:', projectError);
        toast({
          title: "Error",
          description: "Failed to fetch project data.",
          variant: "destructive",
        });
        return false;
      }

      // Get standard rewards based on difficulty
      const standardRewards = getStandardRewardsByDifficulty(projectData.difficulty);
      
      // Use the project's stored rewards if they exist, otherwise use standard rewards
      const finalRewards = {
        xp: projectData.xp_reward || standardRewards.xp,
        bits: projectData.bits_reward || standardRewards.bits,
        bytes: projectData.bytes_reward || standardRewards.bytes
      };

      console.log('💰 Final rewards to distribute:', finalRewards);

      // Update project status to completed
      const { error: updateError } = await supabase
        .from('projects')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Ensure the rewards are set correctly
          xp_reward: finalRewards.xp,
          bits_reward: finalRewards.bits,
          bytes_reward: finalRewards.bytes
        })
        .eq('id', projectId);

      if (updateError) {
        console.error('❌ Error completing project:', updateError);
        toast({
          title: "Error",
          description: "Failed to complete project.",
          variant: "destructive",
        });
        return false;
      }

      // Get all project members
      const { data: members, error: membersError } = await supabase
        .from('project_members')
        .select('user_id')
        .eq('project_id', projectId);

      if (membersError) {
        console.error('❌ Error fetching project members:', membersError);
        toast({
          title: "Error",
          description: "Failed to fetch project members.",
          variant: "destructive",
        });
        return false;
      }

      console.log('👥 Project members to reward:', members);

      // Distribute rewards to all members
      if (members && members.length > 0) {
        for (const member of members) {
          // Get current user profile
          const { data: currentProfile, error: profileError } = await supabase
            .from('user_profiles')
            .select('experience_points, bits_currency, bytes_currency')
            .eq('user_id', member.user_id)
            .single();

          if (profileError) {
            console.error('❌ Error fetching user profile:', member.user_id, profileError);
            continue;
          }

          // Calculate new values
          const newXP = (currentProfile.experience_points || 0) + finalRewards.xp;
          const newBits = (currentProfile.bits_currency || 0) + finalRewards.bits;
          const newBytes = (currentProfile.bytes_currency || 0) + finalRewards.bytes;

          // Update user profile with new rewards
          const { error: rewardError } = await supabase
            .from('user_profiles')
            .update({
              experience_points: newXP,
              bits_currency: newBits,
              bytes_currency: newBytes,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', member.user_id);

          if (rewardError) {
            console.error('❌ Error rewarding user:', member.user_id, rewardError);
          } else {
            console.log('✅ Rewarded user:', member.user_id, finalRewards);
          }
        }
      }

      console.log('✅ Project marked as completed successfully');
      
      toast({
        title: "Project Completed!",
        description: `Rewards distributed: ${finalRewards.xp} XP, ${finalRewards.bits} Bits, ${finalRewards.bytes} Bytes to all team members.`,
      });
      
      return true;
    } catch (error) {
      console.error('💥 Error completing project:', error);
      toast({
        title: "Error",
        description: "Failed to complete project.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { completeProject, loading };
};
