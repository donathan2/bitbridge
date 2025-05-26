
import { useState, useEffect } from 'react';

// Since we removed the user_social_connections table, we'll create a stub implementation
export interface SocialConnection {
  id: string;
  user_id: string;
  platform: 'github' | 'twitter' | 'website';
  url: string;
  created_at: string;
}

export const useSocialConnections = () => {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set empty connections since the table no longer exists
    setConnections([]);
    setLoading(false);
  }, []);

  const addConnection = async (platform: 'github' | 'twitter' | 'website', url: string) => {
    // Since we removed social connections functionality, just return empty
    return null;
  };

  const removeConnection = async (platform: string) => {
    // Since we removed social connections functionality, do nothing
    return;
  };

  const getConnectionByPlatform = (platform: string) => {
    return undefined;
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
