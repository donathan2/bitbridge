
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { projectService } from '@/services/projectService';

export const useProjectJoin = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const joinProject = async (projectId: string, role: string = 'Developer') => {
    if (!user) {
      console.log('❌ No user found, cannot join project');
      return false;
    }

    console.log('🚀 useProjectJoin called:', { projectId, role, userId: user.id });

    setLoading(true);
    try {
      const result = await projectService.joinProject(projectId, user.id, role);
      console.log('📋 Join project result:', result);
      return result.success;
    } catch (error) {
      console.error('💥 Error in joinProject hook:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const leaveProject = async (projectId: string) => {
    if (!user) {
      console.log('❌ No user found, cannot leave project');
      return false;
    }

    console.log('🚀 useProjectJoin.leaveProject called:', { projectId, userId: user.id });

    setLoading(true);
    try {
      const result = await projectService.leaveProject(projectId, user.id);
      console.log('📋 Leave project result:', result);
      return result.success;
    } catch (error) {
      console.error('💥 Error in leaveProject hook:', error);
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
