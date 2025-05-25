
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ProjectMessage {
  id: string;
  project_id: string;
  user_id: string;
  message: string;
  created_at: string;
  user: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const useProjectMessages = (projectId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching messages for project:', projectId);

      if (!projectId) {
        setMessages([]);
        setError(null);
        return;
      }

      const { data, error: messagesError } = await supabase
        .from('project_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('❌ Error fetching messages:', messagesError);
        throw messagesError;
      }

      // Fetch user profiles for the messages
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map(msg => msg.user_id))];
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, username, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('⚠️ Error fetching profiles:', profilesError);
        }

        const messagesWithProfiles = data.map(message => {
          const profile = profiles?.find(p => p.id === message.user_id);
          return {
            ...message,
            user: {
              full_name: profile?.full_name || null,
              username: profile?.username || null,
              avatar_url: profile?.avatar_url || null,
            }
          };
        });

        console.log('✅ Successfully fetched messages:', messagesWithProfiles);
        setMessages(messagesWithProfiles);
      } else {
        setMessages([]);
      }

      setError(null);
    } catch (err) {
      console.error('💥 Error in fetchMessages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!user || !messageText.trim()) return false;

    try {
      console.log('🚀 Sending message:', messageText);

      const { error } = await supabase
        .from('project_messages')
        .insert({
          project_id: projectId,
          user_id: user.id,
          message: messageText.trim()
        });

      if (error) {
        console.error('❌ Error sending message:', error);
        throw error;
      }

      console.log('✅ Message sent successfully');
      await fetchMessages();
      return true;
    } catch (err) {
      console.error('💥 Error sending message:', err);
      return false;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMessages();
    } else {
      setMessages([]);
      setLoading(false);
      setError(null);
    }
  }, [projectId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    refetch: fetchMessages
  };
};
