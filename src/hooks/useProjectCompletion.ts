
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useProjectCompletion = () => {
  const [loading, setLoading] = useState(false);

  const completeProject = async (projectId: string) => {
    setLoading(true);
    try {
      console.log('🎯 Completing project:', projectId);

      const { error } = await supabase
        .from('projects')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (error) {
        console.error('❌ Error completing project:', error);
        toast({
          title: "Error",
          description: "Failed to complete project.",
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ Project completed successfully');
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
