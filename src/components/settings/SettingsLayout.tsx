
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import ProfileSection from './ProfileSection';
import AccountSection from './AccountSection';
import PreferencesSection from './PreferencesSection';

const SettingsLayout = () => {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Settings</h1>
          <p className="text-lg text-slate-300 font-light">
            Manage your account preferences and profile information
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 bg-slate-800">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSection />
          </TabsContent>
          
          <TabsContent value="preferences">
            <PreferencesSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsLayout;
