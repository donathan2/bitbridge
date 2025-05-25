import React, { useState, useEffect, useRef } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, User, Mail, Crown, Upload } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserTitles } from '@/hooks/useUserTitles';
import { useProfile } from '@/hooks/useProfile';
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { supabase } from '@/integrations/supabase/client';

const ProfileSection = () => {
  const { user } = useAuth();
  const { profile: userProfile, updateActiveTitle } = useUserProfile();
  const { userTitles } = useUserTitles();
  const { profile: publicProfile } = useProfile();
  const { uploadProfilePicture, uploading } = useProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    activeTitle: '',
  });

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
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
            bio: userProfile?.bio || '',
            activeTitle: userProfile?.active_title || 'Beginner Developer',
          });
        } catch (err) {
          console.error('Error in fetchUserProfile:', err);
          setProfileData({
            name: user.user_metadata?.full_name || '',
            username: user.user_metadata?.user_name || '',
            email: user.email || '',
            bio: userProfile?.bio || '',
            activeTitle: userProfile?.active_title || 'Beginner Developer',
          });
        }
      };

      fetchUserProfile();
    }
  }, [user, userProfile]);

  const handleProfileUpdate = async () => {
    if (!user) return;

    try {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profileData.name,
          user_name: profileData.username,
        }
      });

      if (authError) throw authError;

      if (userProfile) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({ 
            bio: profileData.bio,
            active_title: profileData.activeTitle
          })
          .eq('user_id', user.id);

        if (profileError) throw profileError;
      }

      const { error: publicProfileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profileData.name,
          username: profileData.username,
          updated_at: new Date().toISOString()
        });

      if (publicProfileError) throw publicProfileError;

      // Update active title
      await updateActiveTitle(profileData.activeTitle);

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });

      // Force a page reload to update all profile instances
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadProfilePicture(file);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Available titles (owned titles + default title)
  const availableTitles = ['Beginner Developer', ...userTitles];

  return (
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
            <AvatarImage src={publicProfile?.profile_picture_url || user?.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-slate-700 text-xl">
              {(profileData.name || profileData.username || user?.email || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button 
            variant="outline" 
            className="border-cyan-500 text-cyan-400"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Uploading...' : 'Change Avatar'}
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
          <Label htmlFor="activeTitle" className="text-white">Active Title</Label>
          <div className="relative">
            <Crown className="absolute left-2 top-2.5 h-4 w-4 text-slate-400 z-10" />
            <Select 
              value={profileData.activeTitle} 
              onValueChange={(value) => setProfileData({...profileData, activeTitle: value})}
            >
              <SelectTrigger className="pl-8 bg-slate-700 border-slate-600 text-slate-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {availableTitles.map((title) => (
                  <SelectItem 
                    key={title} 
                    value={title}
                    className="text-slate-200 focus:bg-slate-600 focus:text-white"
                  >
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-slate-400">
            Purchase new titles in the BitVault to unlock more options.
          </p>
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
  );
};

export default ProfileSection;
