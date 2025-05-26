
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Navigate } from 'react-router-dom';
import SettingsLayout from '@/components/settings/SettingsLayout';

const Settings = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: profileLoading } = useUserProfile();
  const { loading: preferencesLoading } = useUserPreferences();

  // Show loading while auth is still determining user state
  if (authLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-pixel text-cyan-400 mb-2">Settings</h1>
            <p className="text-lg text-slate-300 font-light">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to auth page if not authenticated (after loading is complete)
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading for profile and preferences data
  if (profileLoading || preferencesLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-pixel text-cyan-400 mb-2">Settings</h1>
            <p className="text-lg text-slate-300 font-light">Loading your settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return <SettingsLayout />;
};

export default Settings;
