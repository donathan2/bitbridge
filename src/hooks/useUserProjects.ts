
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProjectMember {
  role: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
  full_name: string | null;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'ongoing' | 'completed';
  difficulty: string;
  technologies: string[];
  progress?: number;
  xp_reward?: number;
  bits_reward?: number;
  bytes_reward?: number;
  github_url?: string;
  started_date?: string;
  completed_date?: string;
  members: ProjectMember[];
}

export const useUserProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching project memberships...');
      
      const { data: membershipData, error: membershipError } = await supabase
        .from('project_members')
        .select('project_id, role, joined_at')
        .eq('user_id', user.id);

      if (membershipError) {
        console.error('Membership error:', membershipError);
        console.log('Setting projects to empty array due to membership error');
        setProjects([]);
        return;
      }

      console.log('Membership data:', membershipData);

      if (membershipData && membershipData.length > 0) {
        const projectIds = membershipData.map(m => m.project_id);
        
        // Fetch the actual project details
        console.log('Fetching project details for IDs:', projectIds);
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .in('id', projectIds);

        if (projectsError) {
          console.error('Projects error:', projectsError);
          console.log('Setting projects to empty array due to projects error');
          setProjects([]);
          return;
        }

        // For each project, fetch all its members
        const projectsWithMembers = await Promise.all(
          projectsData?.map(async (project) => {
            // First get all project members
            const { data: projectMembersData, error: membersError } = await supabase
              .from('project_members')
              .select('role, user_id')
              .eq('project_id', project.id);

            if (membersError) {
              console.error('Error fetching project members:', membersError);
              return {
                id: project.id,
                title: project.title,
                description: project.description,
                status: (project.status === 'completed' ? 'completed' : 'ongoing') as 'ongoing' | 'completed',
                difficulty: project.difficulty,
                technologies: project.categories || [],
                progress: project.status === 'completed' ? 100 : 50,
                xp_reward: project.xp_reward,
                bits_reward: project.bits_reward,
                bytes_reward: project.bytes_reward,
                github_url: project.github_url,
                started_date: membershipData.find(m => m.project_id === project.id)?.joined_at || project.created_at,
                completed_date: project.completed_at,
                members: []
              };
            }

            // Then get profile data for each member
            const membersWithProfiles = await Promise.all(
              projectMembersData?.map(async (member) => {
                const { data: profileData } = await supabase
                  .from('profiles')
                  .select('username, full_name, avatar_url')
                  .eq('id', member.user_id)
                  .single();

                return {
                  role: member.role,
                  user_id: member.user_id,
                  username: profileData?.username || 'Unknown User',
                  avatar_url: profileData?.avatar_url || null,
                  full_name: profileData?.full_name || null
                };
              }) || []
            );

            const userMembership = membershipData.find(m => m.project_id === project.id);
            
            return {
              id: project.id,
              title: project.title,
              description: project.description,
              status: (project.status === 'completed' ? 'completed' : 'ongoing') as 'ongoing' | 'completed',
              difficulty: project.difficulty,
              technologies: project.categories || [],
              progress: project.status === 'completed' ? 100 : 50,
              xp_reward: project.xp_reward,
              bits_reward: project.bits_reward,
              bytes_reward: project.bytes_reward,
              github_url: project.github_url,
              started_date: userMembership?.joined_at || project.created_at,
              completed_date: project.completed_at,
              members: membersWithProfiles
            };
          }) || []
        );

        console.log('Projects with members:', projectsWithMembers);
        setProjects(projectsWithMembers);
      } else {
        console.log('No project memberships found');
        setProjects([]);
      }

    } catch (err) {
      console.error('Error fetching projects:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while loading projects';
      setError(errorMessage);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects
  };
};
