
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SocialConnection {
  id: string;
  user_id: string;
  platform: 'github' | 'twitter' | 'website';
  url: string;
  created_at: string;
}

export const useSocialConnections = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchConnections = async () => {
      try {
        console.log('Fetching social connections for user:', user.id);
        
        const { data, error } = await supabase
          .from('user_social_connections')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Social connections error:', error);
          throw error;
        }

        console.log('Social connections data:', data);
        setConnections((data || []) as SocialConnection[]);
      } catch (err) {
        console.error('Error fetching social connections:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [user]);

  const addConnection = async (platform: 'github' | 'twitter' | 'website', url: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_social_connections')
        .upsert({
          user_id: user.id,
          platform,
          url
        })
        .select()
        .single();

      if (error) throw error;

      setConnections(prev => {
        const filtered = prev.filter(conn => conn.platform !== platform);
        return [...filtered, data as SocialConnection];
      });
      
      return data;
    } catch (err) {
      console.error('Error adding connection:', err);
      throw err;
    }
  };

  const removeConnection = async (platform: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_social_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('platform', platform);

      if (error) throw error;

      setConnections(prev => prev.filter(conn => conn.platform !== platform));
    } catch (err) {
      console.error('Error removing connection:', err);
      throw err;
    }
  };

  const getConnectionByPlatform = (platform: string) => {
    return connections.find(conn => conn.platform === platform);
  };

  return {
    connections,
    loading,
    error,
    addConnection,
    removeConnection,
    getConnectionByPlatform
  };
};
