
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

  const fetchMembers = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching members for project:', projectId);

      if (!projectId) {
        console.log('⚠️ No project ID provided');
        setMembers([]);
        setError(null);
        return;
      }

      // Fetch project members with the clean RLS policies
      const { data: memberData, error: memberError } = await supabase
        .from('project_members')
        .select('id, role, user_id, joined_at')
        .eq('project_id', projectId);

      if (memberError) {
        console.error('❌ Error fetching project members:', memberError);
        throw memberError;
      }

      if (!memberData || memberData.length === 0) {
        console.log('📭 No members found for project');
        setMembers([]);
        setError(null);
        return;
      }

      // Fetch user profiles separately
      const userIds = memberData.map(member => member.user_id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', userIds);

      if (profileError) {
        console.error('⚠️ Error fetching profiles:', profileError);
        // Continue with member data but without profile info
      }

      // Combine the data
      const transformedMembers = memberData.map(member => {
        const profile = profileData?.find(p => p.id === member.user_id);
        return {
          id: member.id,
          role: member.role,
          user_id: member.user_id,
          joined_at: member.joined_at,
          user: {
            full_name: profile?.full_name || null,
            username: profile?.username || null,
            avatar_url: profile?.avatar_url || null,
          }
        };
      });

      console.log('✅ Successfully fetched and transformed members:', transformedMembers);
      setMembers(transformedMembers);
      setError(null);
    } catch (err) {
      console.error('💥 Error in fetchMembers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch members');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMembers();
    } else {
      setMembers([]);
      setLoading(false);
      setError(null);
    }
  }, [projectId]);

  return { members, loading, error, refetch: fetchMembers };
};
