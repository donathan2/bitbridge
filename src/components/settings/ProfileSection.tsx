
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
import { Check, User, Mail, Crown, Upload, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserTitles } from '@/hooks/useUserTitles';
import { useProfile } from '@/hooks/useProfile';
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { useAvatar } from '@/hooks/useAvatar';
import { supabase } from '@/integrations/supabase/client';

const ProfileSection = () => {
  const { user } = useAuth();
  const { profile: userProfile, updateActiveTitle } = useUserProfile();
  const { userTitles } = useUserTitles();
  const { profile: publicProfile } = useProfile();
  const { uploadProfilePicture, uploading } = useProfilePicture();
  const { avatarUrl, name, username } = useAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    name: '',
    username: '',
    email: '',
    bio: '',
    activeTitle: '',
  });

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
            name: name,
            username: username,
            email: user.email || '',
            bio: userProfile?.bio || '',
            activeTitle: userProfile?.active_title || 'Beginner Developer',
          });
        } catch (err) {
          console.error('Error in fetchUserProfile:', err);
          setProfileData({
            name: name,
            username: username,
            email: user.email || '',
            bio: userProfile?.bio || '',
            activeTitle: userProfile?.active_title || 'Beginner Developer',
          });
        }
      };

      fetchUserProfile();
    }
  }, [user, userProfile, name, username]);

  const validateUsername = async (newUsername: string) => {
    if (!newUsername.trim()) {
      setUsernameError('Username is required');
      return false;
    }

    if (newUsername === username) {
      setUsernameError(null);
      return true;
    }

    setIsCheckingUsername(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', newUsername.trim())
        .maybeSingle();

      if (error) {
        console.error('Error checking username:', error);
        setUsernameError('Error checking username availability');
        return false;
      }

      if (data) {
        setUsernameError('Username is already taken');
        return false;
      }

      setUsernameError(null);
      return true;
    } catch (error) {
      console.error('Error validating username:', error);
      setUsernameError('Error checking username availability');
      return false;
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleUsernameChange = (newUsername: string) => {
    setProfileData({...profileData, username: newUsername});
    
    // Clear previous error immediately
    setUsernameError(null);
    
    // Debounce validation
    const timeoutId = setTimeout(() => {
      validateUsername(newUsername);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleProfileUpdate = async () => {
    if (!user) return;

    // Validate username before updating
    const isUsernameValid = await validateUsername(profileData.username);
    if (!isUsernameValid) {
      toast({
        title: "Invalid Username",
        description: usernameError || "Please choose a different username.",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);

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

      if (publicProfileError) {
        if (publicProfileError.code === '23505') {
          toast({
            title: "Username Taken",
            description: "This username is already in use. Please choose a different one.",
            variant: "destructive",
          });
          return;
        }
        throw publicProfileError;
      }

      // Update active title
      await updateActiveTitle(profileData.activeTitle);

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
        variant: "default",
      });

      // The real-time subscription in NavBar will handle the UI updates
      // No need for a full page reload
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
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
        <CardTitle className="text-white font-pixel">Profile Information</CardTitle>
        <CardDescription className="text-slate-400">
          Update your profile details and public information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <Avatar className="w-24 h-24 border-4 border-cyan-500">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-slate-700 text-xl">
              {name.charAt(0).toUpperCase()}
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
                disabled={isUpdating}
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
                onChange={(e) => handleUsernameChange(e.target.value)}
                className={`pl-8 bg-slate-700 border-slate-600 text-slate-200 ${
                  usernameError ? 'border-red-500' : ''
                }`}
                disabled={isUpdating}
              />
              {isCheckingUsername && (
                <div className="absolute right-2 top-2.5">
                  <div className="animate-spin h-4 w-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            {usernameError && (
              <div className="flex items-center space-x-1 text-red-400 text-sm">
                <AlertCircle className="h-3 w-3" />
                <span>{usernameError}</span>
              </div>
            )}
            <p className="text-sm text-slate-400">Choose a unique username that others will see.</p>
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
              disabled={isUpdating}
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
                    {title.length > 30 ? `${title.substring(0, 30)}...` : title}
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
            disabled={isUpdating}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleProfileUpdate}
            disabled={!!usernameError || isCheckingUsername || isUpdating}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50"
          >
            <Check className="mr-2 h-4 w-4" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
