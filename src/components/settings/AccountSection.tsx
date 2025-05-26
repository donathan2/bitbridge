
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
import { Key, LogOut } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AccountSection = () => {
  const { user, signOut } = useAuth();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

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

    if (!passwordData.currentPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (!user?.email) {
        throw new Error('No email found for current user');
      }

      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: passwordData.currentPassword,
      });

      if (verifyError) {
        toast({
          title: "Error",
          description: "Current password is incorrect.",
          variant: "destructive",
        });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (updateError) throw updateError;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast({
        title: "Password updated",
        description: "Your password has been changed successfully. You may need to sign in again on other devices.",
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

  return (
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
                placeholder="Enter current password"
              />
            </div>
            <p className="text-sm text-slate-400">Required to verify your identity</p>
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
                placeholder="Enter new password"
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
                placeholder="Confirm new password"
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
      </CardContent>
    </Card>
  );
};

export default AccountSection;
