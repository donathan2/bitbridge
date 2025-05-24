
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import SettingsLayout from '@/components/settings/SettingsLayout';

const Settings = () => {
  const { user } = useAuth();
  const { loading: profileLoading } = useUserProfile();
  const { loading: preferencesLoading } = useUserPreferences();

  if (profileLoading || preferencesLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Settings</h1>
            <p className="text-lg text-slate-300 font-light">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Settings</h1>
            <p className="text-lg text-slate-300 font-light">Please log in to access settings.</p>
          </div>
        </div>
      </div>
    );
  }

  return <SettingsLayout />;
};

export default Settings;
