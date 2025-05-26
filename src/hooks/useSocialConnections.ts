
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

    // For now, just set empty connections since we don't have the table
    setConnections([]);
    setLoading(false);
  }, [user]);

  const addConnection = async (platform: 'github' | 'twitter' | 'website', url: string) => {
    if (!user) return;

    try {
      // For now, just add to local state
      const newConnection: SocialConnection = {
        id: crypto.randomUUID(),
        user_id: user.id,
        platform,
        url,
        created_at: new Date().toISOString()
      };
      
      setConnections(prev => {
        const filtered = prev.filter(conn => conn.platform !== platform);
        return [...filtered, newConnection];
      });
      
      return newConnection;
    } catch (err) {
      console.error('Error adding connection:', err);
      throw err;
    }
  };

  const removeConnection = async (platform: string) => {
    if (!user) return;

    try {
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
