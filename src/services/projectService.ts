
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface JoinProjectResult {
  success: boolean;
  error?: string;
}

export const projectService = {
  async joinProject(projectId: string, userId: string, role: string): Promise<JoinProjectResult> {
    console.log('🔄 Starting project join process:', { projectId, userId, role });
    
    try {
      // Step 1: Check if user is already a member
      console.log('📋 Checking existing membership...');
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('id, role')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) {
        console.error('❌ Error checking membership:', checkError);
        return { success: false, error: `Membership check failed: ${checkError.message}` };
      }

      if (existingMember) {
        console.log('⚠️ User already a member:', existingMember);
        toast({
          title: "Already a member",
          description: `You are already a member as ${existingMember.role}.`,
          variant: "default",
        });
        return { success: false, error: 'Already a member' };
      }

      // Step 2: Add user to project
      console.log('➕ Adding user to project...');
      const { data: newMember, error: insertError } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: userId,
          role: role,
          joined_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (insertError) {
        console.error('❌ Error inserting member:', insertError);
        return { success: false, error: `Failed to join project: ${insertError.message}` };
      }

      console.log('✅ Successfully joined project:', newMember);
      
      toast({
        title: "Project joined!",
        description: `You have successfully joined as ${role}.`,
        variant: "default",
      });

      return { success: true };

    } catch (error) {
      console.error('💥 Unexpected error in joinProject:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Error",
        description: `Failed to join project: ${errorMessage}`,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    }
  },

  async leaveProject(projectId: string, userId: string): Promise<JoinProjectResult> {
    console.log('🔄 Starting project leave process:', { projectId, userId });
    
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error leaving project:', error);
        return { success: false, error: `Failed to leave project: ${error.message}` };
      }

      console.log('✅ Successfully left project');
      
      toast({
        title: "Left project",
        description: "You have left the project.",
        variant: "default",
      });

      return { success: true };

    } catch (error) {
      console.error('💥 Unexpected error in leaveProject:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Error",
        description: `Failed to leave project: ${errorMessage}`,
        variant: "destructive",
      });

      return { success: false, error: errorMessage };
    }
  }
};
