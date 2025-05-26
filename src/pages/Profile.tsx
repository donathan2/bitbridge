
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, MapPin, Calendar, Users, Trophy, Star, Github, Linkedin, Twitter, Globe, Bitcoin, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useSocialConnections } from '@/hooks/useSocialConnections';
import { supabase } from '@/integrations/supabase/client';
import { getProgressToNextLevel } from '@/utils/xpUtils';

const Profile = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { profile: userProfile } = useUserProfile();
  const { connections } = useSocialConnections();
  const [projects, setProjects] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProjects();
      fetchFriendsCount();
    }
  }, [user]);

  const fetchUserProjects = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          project_id,
          role,
          joined_at,
          projects!inner(*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user projects:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendsCount = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select('id')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

      if (error) {
        console.error('Error fetching friends count:', error);
        return;
      }

      setFriendsCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching friends count:', error);
    }
  };

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

  const fullName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || 'User';
  const username = profile?.username || user?.user_metadata?.user_name || user?.user_metadata?.preferred_username || user?.email?.split('@')[0] || 'user';
  const avatarUrl = profile?.profile_picture_url || profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "/placeholder.svg";

  const xp = userProfile?.experience_points || 0;
  const levelData = getProgressToNextLevel(xp);
  const activeTitle = userProfile?.active_title || 'Beginner Developer';

  const completedProjects = projects.filter(p => p.projects?.status === 'completed');
  const activeProjects = projects.filter(p => p.projects?.status === 'active');

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Profile</h1>
          <p className="text-lg text-slate-300 font-light">Your developer journey and achievements</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="relative mx-auto w-32 h-32 mb-4">
                  <Avatar className="w-32 h-32 border-4 border-cyan-500">
                    <AvatarImage src={avatarUrl} alt={fullName} />
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-2xl">
                      {fullName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full p-2 bg-cyan-600 hover:bg-cyan-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-1">{fullName}</h2>
                <p className="text-cyan-400 mb-2">@{username}</p>
                <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white mb-4">
                  {activeTitle}
                </Badge>
                
                <p className="text-slate-300 text-sm mb-4">
                  {userProfile?.bio || 'Welcome to BitBridge! Update your bio to tell others about yourself.'}
                </p>
                
                <div className="flex justify-center space-x-4 text-sm text-slate-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {new Date(profile?.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400">{friendsCount}</div>
                    <div className="text-xs text-slate-400">Friends</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{completedProjects.length}</div>
                    <div className="text-xs text-slate-400">Completed</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">{activeProjects.length}</div>
                    <div className="text-xs text-slate-400">Active</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{levelData.currentLevel}</div>
                    <div className="text-xs text-slate-400">Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Currency Card */}
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Currency</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bitcoin className="w-5 h-5 text-yellow-400" />
                    <span className="text-slate-300">Bits</span>
                  </div>
                  <span className="text-yellow-400 font-semibold">
                    {userProfile?.bits_currency?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-purple-400" />
                    <span className="text-slate-300">Bytes</span>
                  </div>
                  <span className="text-purple-400 font-semibold">
                    {userProfile?.bytes_currency || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {connections && connections.length > 0 && (
              <Card className="bg-slate-800 border-slate-700 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-white">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {connections.map((connection) => (
                    <a
                      key={connection.id}
                      href={connection.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      {getSocialIcon(connection.platform)}
                      <span className="capitalize">{connection.platform}</span>
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Experience & Projects */}
          <div className="lg:col-span-2 space-y-6">
            {/* Experience Level Card */}
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Trophy className="mr-2 w-5 h-5 text-yellow-400" />
                  Level {levelData.currentLevel}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>{levelData.currentLevelXP} XP</span>
                  <span>{levelData.nextLevelXP} XP</span>
                </div>
                <Progress value={levelData.progressPercentage} className="h-3" />
                <div className="text-center text-slate-300">
                  <span className="text-cyan-400 font-semibold">{levelData.xpNeededForNextLevel} XP</span> needed for next level
                </div>
              </CardContent>
            </Card>

            {/* Active Projects */}
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center text-slate-400 py-4">Loading projects...</div>
                ) : activeProjects.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <div className="bg-slate-700 rounded-lg p-6">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No active projects</h3>
                      <p className="text-slate-500">Join a project to start collaborating!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeProjects.map((project) => (
                      <div key={project.project_id} className="bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-semibold">{project.projects.title}</h3>
                          <Badge className="bg-yellow-600 text-white">{project.role}</Badge>
                        </div>
                        <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                          {project.projects.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Joined {new Date(project.joined_at).toLocaleDateString()}</span>
                          <Badge className="bg-blue-600 text-white">{project.projects.difficulty}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completed Projects */}
            <Card className="bg-slate-800 border-slate-700 shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="mr-2 w-5 h-5 text-yellow-400" />
                  Completed Projects
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedProjects.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <div className="bg-slate-700 rounded-lg p-6">
                      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No completed projects yet</h3>
                      <p className="text-slate-500">Complete your first project to earn rewards!</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedProjects.map((project) => (
                      <div key={project.project_id} className="bg-slate-700 p-4 rounded-lg border border-green-500/20">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-semibold">{project.projects.title}</h3>
                          <div className="flex gap-2">
                            <Badge className="bg-green-600 text-white">Completed</Badge>
                            <Badge className="bg-yellow-600 text-white">{project.role}</Badge>
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-3 line-clamp-2">
                          {project.projects.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Completed {new Date(project.projects.completed_at).toLocaleDateString()}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-cyan-400">+{project.projects.xp_reward} XP</span>
                            <span className="text-yellow-400">+{project.projects.bits_reward} Bits</span>
                            <span className="text-purple-400">+{project.projects.bytes_reward} Bytes</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
