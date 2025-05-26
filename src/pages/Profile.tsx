import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Edit, Users, Trophy, Code, Calendar, Github, Twitter, Globe, Bitcoin, DollarSign, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAvatar } from '@/hooks/useAvatar';
import { useSocialConnections } from '@/hooks/useSocialConnections';
import { getProgressToNextLevel } from '@/utils/xpUtils';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { avatarUrl, name, username } = useAvatar();
  const { connections } = useSocialConnections();
  const [stats, setStats] = useState({
    completedProjects: 0,
    activeProjects: 0,
    friendsCount: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        // Get completed projects count
        const { count: completedCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', user.id)
          .eq('status', 'completed');

        // Get active projects count
        const { count: activeCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('creator_id', user.id)
          .eq('status', 'active');

        // Get friends count - count friendships where user is either user1 or user2
        const { count: friendsCount } = await supabase
          .from('friendships')
          .select('*', { count: 'exact', head: true })
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

        setStats({
          completedProjects: completedCount || 0,
          activeProjects: activeCount || 0,
          friendsCount: friendsCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Trigger a re-fetch of profile data
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  
  if (profileLoading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-slate-400 mt-2">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Profile</h1>
          <p className="text-lg text-slate-300">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const displayProfile = profile || {
    bio: 'Welcome to BitBridge! Update your bio to tell others about yourself.',
    skill_level: 'Beginner Developer',
    experience_points: 0,
    experience_level: 1,
    bits_currency: 100,
    bytes_currency: 5,
    active_title: 'Beginner Developer'
  };

  const xpProgress = getProgressToNextLevel(displayProfile.experience_points);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'website': return <Globe className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Profile</h1>
          <p className="text-lg text-slate-300 font-light">Your coding journey and achievements</p>
        </div>

        {/* Main Profile Card */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 border-4 border-white/20">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="bg-slate-700 text-white text-xl">
                    {name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{name}</h2>
                  <p className="text-cyan-100">@{username}</p>
                  <Badge className="mt-2 bg-white/20 text-white border-white/30">
                    {displayProfile.active_title}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bio Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                <p className="text-slate-300 mb-4">{displayProfile.bio}</p>
                
                {/* Social Links */}
                {connections.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-white mb-2">Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {connections.map((connection) => (
                        <a
                          key={connection.id}
                          href={connection.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-md text-slate-300 hover:text-white transition-colors"
                        >
                          {getSocialIcon(connection.platform)}
                          <span className="capitalize">{connection.platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats & Progress */}
              <div className="space-y-4">
                {/* Experience Progress */}
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300 font-medium">Level {xpProgress.currentLevel}</span>
                    <span className="text-slate-400 text-sm">
                      {displayProfile.experience_points}/{xpProgress.nextLevelXP} XP
                    </span>
                  </div>
                  <Progress value={xpProgress.progressPercentage} className="h-3 bg-slate-600" />
                  <p className="text-xs text-slate-400 mt-1">
                    {xpProgress.xpToNextLevel} XP to next level
                  </p>
                </div>

                {/* Currency */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Bitcoin className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold text-lg">
                        {displayProfile.bits_currency?.toLocaleString() || 0}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">Bits</p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-400 font-bold text-lg">
                        {displayProfile.bytes_currency || 0}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">Bytes</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Code className="w-4 h-4 text-cyan-400" />
                      <span className="text-white font-semibold">{stats.completedProjects}</span>
                    </div>
                    <p className="text-slate-400 text-xs">Completed</p>
                  </div>
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Calendar className="w-4 h-4 text-green-400" />
                      <span className="text-white font-semibold">{stats.activeProjects}</span>
                    </div>
                    <p className="text-slate-400 text-xs">Active</p>
                  </div>
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-semibold">{stats.friendsCount}</span>
                    </div>
                    <p className="text-slate-400 text-xs">Friends</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
