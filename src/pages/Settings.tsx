
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

const Settings = () => {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    avatarUrl: '/placeholder.svg',
    bio: 'Full-stack developer passionate about React and TypeScript',
  });
  
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    emailNotifications: true,
    pushNotifications: false,
    language: 'en',
  });
  
  const handleProfileUpdate = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
      variant: "default",
    });
  };
  
  const handlePasswordUpdate = () => {
    // Password validation would go here
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
      variant: "default",
    });
  };
  
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
                    <AvatarImage src={profileData.avatarUrl} />
                    <AvatarFallback className="bg-slate-700 text-xl">JD</AvatarFallback>
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
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="pl-8 bg-slate-700 border-slate-600 text-slate-200"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                    className="w-full rounded-md bg-slate-700 border-slate-600 text-slate-200 p-2"
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
                      <Button variant="destructive" className="mt-2 md:mt-0">
                        Delete Account
                      </Button>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-md border border-slate-700 bg-slate-800">
                      <div>
                        <h4 className="font-medium text-slate-300">Sign Out Everywhere</h4>
                        <p className="text-sm text-slate-400">Log out from all devices</p>
                      </div>
                      <Button variant="outline" className="mt-2 md:mt-0 border-slate-600 text-slate-300">
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
                  <div className="flex items-center justify-between p-4 rounded-md border border-slate-700">
                    <div className="flex items-center">
                      <div className="bg-slate-700 p-2 rounded-md mr-4">
                        <Github className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">GitHub</h4>
                        <p className="text-sm text-slate-400">Connect your GitHub account</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-cyan-500 text-cyan-400">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-md border border-slate-700">
                    <div className="flex items-center">
                      <div className="bg-slate-700 p-2 rounded-md mr-4">
                        <Twitter className="h-6 w-6 text-sky-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Twitter</h4>
                        <p className="text-sm text-slate-400">Connect your Twitter account</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-cyan-500 text-cyan-400">Connect</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-md border border-slate-700">
                    <div className="flex items-center">
                      <div className="bg-slate-700 p-2 rounded-md mr-4">
                        <Globe className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Website</h4>
                        <p className="text-sm text-slate-400">Link your personal website</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-cyan-500 text-cyan-400">Add</Button>
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
                  Customize your app experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">Theme</h4>
                      <p className="text-sm text-slate-400">Choose your preferred theme</p>
                    </div>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) => setPreferences({...preferences, theme: value})}
                    >
                      <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-slate-200">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">Language</h4>
                      <p className="text-sm text-slate-400">Set your preferred language</p>
                    </div>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => setPreferences({...preferences, language: value})}
                    >
                      <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-slate-200">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="font-medium text-white">Email Notifications</h4>
                      <p className="text-sm text-slate-400">Get notified about new projects and messages</p>
                    </div>
                    <Switch
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <h4 className="font-medium text-white">Push Notifications</h4>
                      <p className="text-sm text-slate-400">Receive browser notifications</p>
                    </div>
                    <Switch
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => setPreferences({...preferences, pushNotifications: checked})}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      toast({
                        title: "Preferences updated",
                        description: "Your preferences have been saved.",
                        variant: "default",
                      });
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    Save Preferences
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
