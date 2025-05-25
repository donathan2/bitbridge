
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ProjectMember {
  id: string;
  role: string;
  user_id: string;
  joined_at: string;
  user: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const useProjectMembers = (projectId: string) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        console.log('Fetching members for project:', projectId);

        const { data, error } = await supabase
          .from('project_members')
          .select(`
            id,
            role,
            user_id,
            joined_at,
            profiles!inner(
              full_name,
              username,
              avatar_url
            )
          `)
          .eq('project_id', projectId);

        if (error) {
          console.error('Error fetching project members:', error);
          throw error;
        }

        const transformedMembers = data?.map(member => ({
          id: member.id,
          role: member.role,
          user_id: member.user_id,
          joined_at: member.joined_at,
          user: {
            full_name: member.profiles?.full_name || null,
            username: member.profiles?.username || null,
            avatar_url: member.profiles?.avatar_url || null,
          }
        })) || [];

        console.log('Transformed members:', transformedMembers);
        setMembers(transformedMembers);
      } catch (err) {
        console.error('Error in fetchMembers:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch members');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchMembers();
    }
  }, [projectId]);

  return { members, loading, error, refetch: () => fetchMembers() };
};
