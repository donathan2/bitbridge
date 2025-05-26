
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserPreferences {
  theme: string;
  language: string;
  email_notifications: boolean;
  push_notifications: boolean;
}

export const useUserPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // For now, just set default preferences since we don't have the table
    setPreferences({
      theme: 'dark',
      language: 'en',
      email_notifications: true,
      push_notifications: false
    });
    setLoading(false);
  }, [user]);

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      // For now, just update local state
      setPreferences(prev => prev ? { ...prev, ...updates } : null);
      return preferences;
    } catch (err) {
      console.error('Error updating preferences:', err);
      throw err;
    }
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences
  };
};
