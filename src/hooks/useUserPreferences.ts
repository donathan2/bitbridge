
import { useState, useEffect } from 'react';

// Since we removed the user_preferences table, we'll create a stub implementation
export interface UserPreferences {
  id: string;
  user_id: string;
  theme: string;
  language: string;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set default preferences since the table no longer exists
    setPreferences({
      id: 'default',
      user_id: 'default',
      theme: 'dark',
      language: 'en',
      email_notifications: true,
      push_notifications: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setLoading(false);
  }, []);

  const updatePreferences = async (updates: Partial<Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    // Since we removed preferences functionality, just update local state
    if (preferences) {
      setPreferences({
        ...preferences,
        ...updates,
        updated_at: new Date().toISOString()
      });
    }
    return preferences;
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences
  };
};
