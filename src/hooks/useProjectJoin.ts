
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export const useProjectJoin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const joinProject = async (projectId: string, role: string = 'Developer') => {
    if (!user) {
      console.log('No user found, cannot join project');
      toast({
        title: "Authentication required",
        description: "Please log in to join a project.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      console.log('Attempting to join project:', { projectId, role, userId: user.id });

      // Check if user is already a member
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing membership:', checkError);
        throw checkError;
      }

      if (existingMember) {
        console.log('User is already a member');
        toast({
          title: "Already a member",
          description: "You are already a member of this project.",
          variant: "default",
        });
        return false;
      }

      // Join the project
      console.log('Inserting new project member');
      const { data: newMember, error: joinError } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: user.id,
          role: role
        })
        .select()
        .single();

      if (joinError) {
        console.error('Error joining project:', joinError);
        throw joinError;
      }

      console.log('Successfully joined project:', newMember);
      toast({
        title: "Project joined!",
        description: `You have successfully joined as ${role}.`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Error in joinProject:', error);
      toast({
        title: "Error",
        description: "Failed to join project. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const leaveProject = async (projectId: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      console.log('Attempting to leave project:', { projectId, userId: user.id });

      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error leaving project:', error);
        throw error;
      }

      console.log('Successfully left project');
      toast({
        title: "Left project",
        description: "You have left the project.",
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Error leaving project:', error);
      toast({
        title: "Error",
        description: "Failed to leave project. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    joinProject,
    leaveProject,
    loading
  };
};
