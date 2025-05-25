import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Calendar, 
  Trophy, 
  Target, 
  Users, 
  Github,
  ExternalLink,
  Crown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useProfile } from '@/hooks/useProfile';
import { getProgressToNextLevel } from '@/utils/xpUtils';

const Profile = () => {
  const { user } = useAuth();
  const { profile, achievements, projects, loading } = useUserProfile();
  const { profile: publicProfile } = useProfile();

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">Loading Profile...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">Please sign in to view your profile</h1>
          </div>
        </div>
      </div>
    );
  }

  const displayProfile = profile || {
    experience_level: 1,
    experience_points: 0,
    bits_currency: 100,
    bytes_currency: 5,
    bio: 'Welcome to BitBridge!',
    active_title: 'Beginner Developer'
  };

  const xpProgress = getProgressToNextLevel(displayProfile.experience_points);
  const earnedAchievements = achievements.filter(a => a.earned_at);
  const ongoingProjects = projects.filter(p => p.status === 'ongoing');
  const completedProjects = projects.filter(p => p.status === 'completed');

  // Truncate title if it's too long
  const truncateTitle = (title: string, maxLength: number = 20) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24 border-4 border-cyan-500">
                <AvatarImage src={publicProfile?.profile_picture_url || user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-slate-700 text-2xl">
                  {(publicProfile?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {publicProfile?.full_name || user?.user_metadata?.full_name || 'User'}
                </h1>
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
                  <Crown className="w-4 h-4 text-cyan-400" />
                  <span 
                    className="text-lg text-cyan-400 font-medium"
                    title={displayProfile.active_title}
                  >
                    {truncateTitle(displayProfile.active_title || 'Beginner Developer')}
                  </span>
                </div>
                {publicProfile?.username && (
                  <p className="text-slate-400 mb-3">@{publicProfile.username}</p>
                )}
                <p className="text-slate-300 max-w-2xl">
                  {displayProfile.bio || 'No bio available'}
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">
                  {xpProgress.currentLevel}
                </div>
                <span className="text-slate-400 text-sm">Level</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Experience Points</CardTitle>
              <Target className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{displayProfile.experience_points.toLocaleString()}</div>
              <div className="mt-2">
                <Progress value={xpProgress.progressPercentage} className="h-2 bg-slate-600" />
                <p className="text-xs text-slate-400 mt-1">
                  {xpProgress.pointsToNext} XP to level {xpProgress.currentLevel + 1}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{earnedAchievements.length}</div>
              <p className="text-xs text-slate-400">
                of {achievements.length} total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Projects</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{ongoingProjects.length}</div>
              <p className="text-xs text-slate-400">
                in progress
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Completed</CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{completedProjects.length}</div>
              <p className="text-xs text-slate-400">
                projects done
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Section */}
        {earnedAchievements.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-yellow-400" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earnedAchievements.slice(0, 6).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                    <div className="text-2xl">{achievement.icon_name || '🏆'}</div>
                    <div>
                      <h4 className="font-medium text-white">{achievement.title}</h4>
                      <p className="text-sm text-slate-400">{achievement.description}</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 text-xs ${
                          achievement.rarity === 'legendary' ? 'border-yellow-500 text-yellow-400' :
                          achievement.rarity === 'epic' ? 'border-purple-500 text-purple-400' :
                          achievement.rarity === 'rare' ? 'border-blue-500 text-blue-400' :
                          'border-gray-500 text-gray-400'
                        }`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-400" />
                My Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div key={project.id} className="border border-slate-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-medium text-white">{project.title}</h4>
                        <p className="text-slate-400 text-sm mt-1">{project.description}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={`${
                          project.status === 'completed' 
                            ? 'border-green-500 text-green-400' 
                            : 'border-blue-500 text-blue-400'
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary" className="bg-slate-600 text-slate-300">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    
                    {project.github_url && (
                      <div className="flex items-center text-sm text-slate-400">
                        <Github className="h-4 w-4 mr-1" />
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-cyan-400 transition-colors"
                        >
                          View Repository
                          <ExternalLink className="h-3 w-3 ml-1 inline" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Profile;
