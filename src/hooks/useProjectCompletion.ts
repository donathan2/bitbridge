
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useProjectCompletion = () => {
  const [loading, setLoading] = useState(false);

  const completeProject = async (projectId: string) => {
    setLoading(true);
    try {
      console.log('🎯 Completing project:', projectId);

      // Update project status to completed
      const { error: projectError } = await supabase
        .from('projects')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (projectError) {
        console.error('❌ Error completing project:', projectError);
        toast({
          title: "Error",
          description: "Failed to complete project.",
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ Project marked as completed successfully');
      
      // The database trigger will automatically distribute rewards to all project members
      toast({
        title: "Project Completed!",
        description: "Rewards have been distributed to all team members.",
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
