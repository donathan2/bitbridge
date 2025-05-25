
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Project {
  id: string;
  title: string;
  description: string;
  categories: string[];
  rolesNeeded: string[];
  githubUrl: string | null;
  endDate: string | null;
  difficulty: string;
  xpReward: number;
  bitsReward: number;
  bytesReward: number;
  creatorId: string;
  createdAt: string | null;
  creator: {
    name: string;
    username: string;
    avatar: string;
  };
}

export const useProject = (projectId: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching project:', projectId);

      if (!projectId) {
        console.log('⚠️ No project ID provided');
        setProject(null);
        setError('No project ID provided');
        return;
      }

      // Fetch project data
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (projectError) {
        console.error('❌ Error fetching project:', projectError);
        throw projectError;
      }

      if (!projectData) {
        console.log('📭 No project found');
        setProject(null);
        setError('Project not found');
        return;
      }

      // Fetch creator profile
      const { data: creatorProfile, error: creatorError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .eq('id', projectData.creator_id)
        .single();

      if (creatorError) {
        console.error('⚠️ Error fetching creator profile:', creatorError);
      }

      const transformedProject: Project = {
        id: projectData.id,
        title: projectData.title,
        description: projectData.description,
        categories: projectData.categories || [],
        rolesNeeded: projectData.roles_needed || [],
        githubUrl: projectData.github_url,
        endDate: projectData.end_date,
        difficulty: projectData.difficulty,
        xpReward: projectData.xp_reward || 0,
        bitsReward: projectData.bits_reward || 0,
        bytesReward: projectData.bytes_reward || 0,
        creatorId: projectData.creator_id,
        createdAt: projectData.created_at,
        creator: {
          name: creatorProfile?.full_name || 'Unknown User',
          username: creatorProfile?.username || 'unknown',
          avatar: creatorProfile?.avatar_url || '/placeholder.svg'
        }
      };

      console.log('✅ Successfully fetched project:', transformedProject);
      setProject(transformedProject);
      setError(null);
    } catch (err) {
      console.error('💥 Error in fetchProject:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    } else {
      setProject(null);
      setLoading(false);
      setError('No project ID provided');
    }
  }, [projectId]);

  return { project, loading, error, refetch: fetchProject };
};
