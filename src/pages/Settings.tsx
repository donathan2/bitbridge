import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, User, Mail, Key, LogOut, Github, Twitter, Globe } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useSocialConnections } from '@/hooks/useSocialConnections';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { preferences, loading: preferencesLoading, updatePreferences } = useUserPreferences();
  const { connections, addConnection, removeConnection, getConnectionByPlatform } = useSocialConnections();

  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [connectionUrls, setConnectionUrls] = useState({
    github: '',
    twitter: '',
    website: '',
  });

  // Initialize form data when data loads
  React.useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
          // Fetch the user's profile data including username
          const { data: profilesData, error } = await supabase
            .from('profiles')
            .select('username, full_name')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profiles:', error);
          }

          setProfileData({
            name: profilesData?.full_name || user.user_metadata?.full_name || '',
            username: profilesData?.username || user.user_metadata?.user_name || '',
            email: user.email || '',
            bio: profile?.bio || '',
          });
        } catch (err) {
          console.error('Error in fetchUserProfile:', err);
          // Fallback to user metadata if profiles query fails
          setProfileData({
            name: user.user_metadata?.full_name || '',
            username: user.user_metadata?.user_name || '',
            email: user.email || '',
            bio: profile?.bio || '',
          });
        }
      };

      fetchUserProfile();
    }
  }, [user, profile]);

  React.useEffect(() => {
    connections.forEach(conn => {
      setConnectionUrls(prev => ({
        ...prev,
        [conn.platform]: conn.url
      }));
    });
  }, [connections]);

  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.name,
          user_name: profileData.username,
        }
      });

      if (authError) throw authError;

      // Update profile
      if (profile) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ bio: profileData.bio })
          .eq('user_id', user.id);

        if (profileError) throw profileError;
      }

      // Update profiles table (this is the key part for username)
      const { error: publicProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileData.name,
          username: profileData.username,
          updated_at: new Date().toISOString()
        });

      if (publicProfileError) throw publicProfileError;

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  const handleConnectionAdd = async (platform: 'github' | 'twitter' | 'website') => {
    const url = connectionUrls[platform];
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addConnection(platform, url);
      toast({
        title: "Connection added",
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} connection has been added.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error adding connection:', error);
      toast({
        title: "Error",
        description: "Failed to add connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleConnectionRemove = async (platform: string) => {
    try {
      await removeConnection(platform);
      setConnectionUrls(prev => ({ ...prev, [platform]: '' }));
      toast({
        title: "Connection removed",
        description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} connection has been removed.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error removing connection:', error);
      toast({
        title: "Error",
        description: "Failed to remove connection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      // Note: Account deletion would need to be implemented as an edge function
      // For now, we'll just sign out the user
      await signOut();
      toast({
        title: "Account deletion requested",
        description: "Please contact support to complete account deletion.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignOutEverywhere = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast({
        title: "Signed out",
        description: "You have been signed out from all devices.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
          <TabsList className="grid grid-cols-4 bg-slate-800">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Update your profile details and public information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4 mb-6">
                  <Avatar className="w-24 h-24 border-4 border-cyan-500">
                    <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="bg-slate-700 text-xl">
                      {(profileData.name || profileData.username || user?.email || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="border-cyan-500 text-cyan-400">
                    Change Avatar
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="pl-8 bg-slate-700 border-slate-600 text-slate-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-white">Username</Label>
                    <div className="relative">
                      <span className="absolute left-2 top-2.5 text-slate-400">@</span>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                        className="pl-8 bg-slate-700 border-slate-600 text-slate-200"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="pl-8 bg-slate-600 border-slate-600 text-slate-400"
                    />
                  </div>
                  <p className="text-sm text-slate-400">Email cannot be changed here. Contact support if needed.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                    className="w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 p-2"
                    placeholder="Tell others about yourself..."
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleProfileUpdate}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Account Security</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your password and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
                    <div className="relative">
                      <Key className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="pl-8 bg-slate-700 border-slate-600 text-slate-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-white">New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        className="pl-8 bg-slate-700 border-slate-600 text-slate-200"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirm New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="pl-8 bg-slate-700 border-slate-600 text-slate-200"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={handlePasswordUpdate}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-700">
                  <h3 className="text-lg font-medium text-white mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-md border border-red-900 bg-slate-800">
                      <div>
                        <h4 className="font-medium text-red-400">Delete Account</h4>
                        <p className="text-sm text-slate-400">Once deleted, your account cannot be recovered</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        className="mt-2 md:mt-0"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-md border border-slate-700 bg-slate-800">
                      <div>
                        <h4 className="font-medium text-slate-300">Sign Out Everywhere</h4>
                        <p className="text-sm text-slate-400">Log out from all devices</p>
                      </div>
                      <Button 
                        variant="outline" 
                        className="mt-2 md:mt-0 border-slate-600 text-slate-300"
                        onClick={handleSignOutEverywhere}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Connected Accounts */}
          <TabsContent value="connections">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Connected Accounts</CardTitle>
                <CardDescription className="text-slate-400">
                  Link your accounts from other platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {/* GitHub Connection */}
                  <div className="flex items-center justify-between p-4 rounded-md border border-slate-700">
                    <div className="flex items-center">
                      <div className="bg-slate-700 p-2 rounded-md mr-4">
                        <Github className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">GitHub</h4>
                        <p className="text-sm text-slate-400">Connect your GitHub account</p>
                        {getConnectionByPlatform('github') && (
                          <p className="text-xs text-cyan-400">{getConnectionByPlatform('github')?.url}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!getConnectionByPlatform('github') ? (
                        <>
                          <Input
                            placeholder="https://github.com/username"
                            value={connectionUrls.github}
                            onChange={(e) => setConnectionUrls({...connectionUrls, github: e.target.value})}
                            className="w-64 bg-slate-700 border-slate-600 text-slate-200"
                          />
                          <Button 
                            variant="outline" 
                            className="border-cyan-500 text-cyan-400"
                            onClick={() => handleConnectionAdd('github')}
                          >
                            Connect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="border-red-500 text-red-400"
                          onClick={() => handleConnectionRemove('github')}
                        >
                          Disconnect
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Twitter Connection */}
                  <div className="flex items-center justify-between p-4 rounded-md border border-slate-700">
                    <div className="flex items-center">
                      <div className="bg-slate-700 p-2 rounded-md mr-4">
                        <Twitter className="h-6 w-6 text-sky-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">Twitter</h4>
                        <p className="text-sm text-slate-400">Connect your Twitter account</p>
                        {getConnectionByPlatform('twitter') && (
                          <p className="text-xs text-cyan-400">{getConnectionByPlatform('twitter')?.url}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!getConnectionByPlatform('twitter') ? (
                        <>
                          <Input
                            placeholder="https://twitter.com/username"
                            value={connectionUrls.twitter}
                            onChange={(e) => setConnectionUrls({...connectionUrls, twitter: e.target.value})}
                            className="w-64 bg-slate-700 border-slate-600 text-slate-200"
                          />
                          <Button 
                            variant="outline" 
                            className="border-cyan-500 text-cyan-400"
                            onClick={() => handleConnectionAdd('twitter')}
                          >
                            Connect
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="border-red-500 text-red-400"
                          onClick={() => handleConnectionRemove('twitter')}
                        >
                          Disconnect
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Website Connection */}
                  <div className="flex items-center justify-between p-4 rounded-md border border-slate-700">
                    <div className="flex items-center">
                      <div className="bg-slate-700 p-2 rounded-md mr-4">
                        <Globe className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">Website</h4>
                        <p className="text-sm text-slate-400">Link your personal website</p>
                        {getConnectionByPlatform('website') && (
                          <p className="text-xs text-cyan-400">{getConnectionByPlatform('website')?.url}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!getConnectionByPlatform('website') ? (
                        <>
                          <Input
                            placeholder="https://yourwebsite.com"
                            value={connectionUrls.website}
                            onChange={(e) => setConnectionUrls({...connectionUrls, website: e.target.value})}
                            className="w-64 bg-slate-700 border-slate-600 text-slate-200"
                          />
                          <Button 
                            variant="outline" 
                            className="border-cyan-500 text-cyan-400"
                            onClick={() => handleConnectionAdd('website')}
                          >
                            Add
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="border-red-500 text-red-400"
                          onClick={() => handleConnectionRemove('website')}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Preferences */}
          <TabsContent value="preferences">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
