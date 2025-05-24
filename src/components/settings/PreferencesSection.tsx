
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useUserPreferences } from '@/hooks/useUserPreferences';

const PreferencesSection = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  const handlePreferenceUpdate = async (key: string, value: any) => {
    try {
      await updatePreferences({ [key]: value });
      toast({
        title: "Preference updated",
        description: `${key.charAt(0).toUpperCase() + key.slice(1)} has been updated.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating preference:', error);
      toast({
        title: "Error",
        description: "Failed to update preference. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Preferences</CardTitle>
        <CardDescription className="text-slate-400">
          Customize your notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="font-medium text-white">Email Notifications</h4>
              <p className="text-sm text-slate-400">Get notified about new projects and messages</p>
            </div>
            <Switch
              checked={preferences?.email_notifications ?? true}
              onCheckedChange={(checked) => handlePreferenceUpdate('email_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="font-medium text-white">Push Notifications</h4>
              <p className="text-sm text-slate-400">Receive browser notifications</p>
            </div>
            <Switch
              checked={preferences?.push_notifications ?? false}
              onCheckedChange={(checked) => handlePreferenceUpdate('push_notifications', checked)}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={() => {
              toast({
                title: "Preferences saved",
                description: "Your preferences have been saved automatically.",
                variant: "default",
              });
            }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            Preferences Auto-Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreferencesSection;
