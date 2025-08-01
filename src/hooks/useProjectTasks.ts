
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  assigned_role: string | null;
  assigned_user_id: string | null;
  assigned_user_ids: string[] | null;
  status: string;
  due_date: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useProjectTasks = (projectId: string) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching tasks for project:', projectId);

      if (!projectId) {
        setTasks([]);
        setError(null);
        return;
      }

      const { data, error: tasksError } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('❌ Error fetching tasks:', tasksError);
        throw tasksError;
      }

      // Transform the data to ensure assigned_user_ids is always present
      const transformedTasks = (data || []).map(task => ({
        ...task,
        assigned_user_ids: task.assigned_user_ids || (task.assigned_user_id ? [task.assigned_user_id] : null)
      }));

      console.log('✅ Successfully fetched tasks:', transformedTasks);
      setTasks(transformedTasks);
      setError(null);
    } catch (err) {
      console.error('💥 Error in fetchTasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: {
    title: string;
    description?: string;
    assigned_role?: string;
    assigned_user_ids?: string[];
    due_date?: string;
  }) => {
    if (!user) return false;

    try {
      console.log('🚀 Creating task:', taskData);

      const { error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: projectId,
          created_by: user.id,
          ...taskData
        });

      if (error) {
        console.error('❌ Error creating task:', error);
        throw error;
      }

      console.log('✅ Task created successfully');
      await fetchTasks();
      return true;
    } catch (err) {
      console.error('💥 Error creating task:', err);
      return false;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<ProjectTask>) => {
    try {
      console.log('🔄 Updating task:', taskId, updates);

      // Clean up the updates object to only include fields that exist in the database
      const cleanUpdates = {
        title: updates.title,
        description: updates.description,
        assigned_role: updates.assigned_role,
        assigned_user_ids: updates.assigned_user_ids,
        status: updates.status,
        due_date: updates.due_date,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(cleanUpdates).forEach(key => {
        if (cleanUpdates[key as keyof typeof cleanUpdates] === undefined) {
          delete cleanUpdates[key as keyof typeof cleanUpdates];
        }
      });

      const { error } = await supabase
        .from('project_tasks')
        .update(cleanUpdates)
        .eq('id', taskId);

      if (error) {
        console.error('❌ Error updating task:', error);
        throw error;
      }

      console.log('✅ Task updated successfully');
      await fetchTasks();
      return true;
    } catch (err) {
      console.error('💥 Error updating task:', err);
      return false;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      console.log('🗑️ Deleting task:', taskId);

      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('❌ Error deleting task:', error);
        throw error;
      }

      console.log('✅ Task deleted successfully');
      await fetchTasks();
      return true;
    } catch (err) {
      console.error('💥 Error deleting task:', err);
      return false;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
      setError(null);
    }
  }, [projectId]);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
};
