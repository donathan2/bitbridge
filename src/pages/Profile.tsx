import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Star, Code, Zap, Calendar, Clock, Github, MessageSquare, ExternalLink, Bitcoin, DollarSign, Award, Target, Users, GitBranch, Lightbulb, Shield, AlertCircle, RefreshCw, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useProfile } from '@/hooks/useProfile';
import { useAvatar } from '@/hooks/useAvatar';
import { useFriendsCount } from '@/hooks/useFriendsCount';
import { getProgressToNextLevel } from '@/utils/xpUtils';
import ProjectRewards from '@/components/ProjectRewards';

// Create a separate component for team member display to avoid hooks in map
const TeamMemberAvatar = ({ member }: { member: any }) => {
  const { avatarUrl: memberAvatarUrl } = useAvatar(member.user_id);
  
  return (
    <div className="flex items-center gap-3 bg-slate-700 p-3 rounded-lg">
      <Avatar className="h-10 w-10">
        <AvatarImage src={memberAvatarUrl} />
        <AvatarFallback className="bg-cyan-600 text-white">
          {(member.full_name || member.username || 'U').charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-cyan-300">@{member.username}</p>
        <p className="text-xs text-slate-300">{member.role}</p>
      </div>
    </div>
  );
};

const Profile = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile: userProfile, projects, loading: profileLoading, error } = useUserProfile();
  const { profile: profileData, loading: profileDataLoading } = useProfile();
  const { avatarUrl, name, username } = useAvatar();
  const { friendsCount, loading: friendsCountLoading } = useFriendsCount();
  
  // Handle loading state
  if (authLoading || profileLoading || profileDataLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-cyan-400 text-lg flex items-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  // Handle no user
  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-slate-300 text-lg">Please log in to view your profile.</div>
      </div>
    );
  }

  // Handle error with more detailed information
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Card className="bg-slate-800 border-red-500 max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Profile Loading Error</h3>
            <p className="text-red-400 text-sm mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Calculate experience progress using the new scaling system
  const xpProgress = getProgressToNextLevel(userProfile?.experience_points || 0);
  
  // Use real profile data or defaults with updated username
  const userProfileData = {
    name: name,
    username: `@${username}`,
    bio: userProfile?.bio || "Welcome to BitBridge! Update your bio to tell others about yourself.",
    avatar: avatarUrl,
    skillLevel: userProfile?.active_title || "Beginner Developer",
    experience: {
      current: userProfile?.experience_points || 0,
      nextLevel: xpProgress.nextLevelXP,
      level: xpProgress.currentLevel
    },
    currency: {
      bits: userProfile?.bits_currency || 100,
      bytes: userProfile?.bytes_currency || 5
    },
    stats: {
      totalProjects: projects?.length || 0,
      completedProjects: projects?.filter(p => p.status === 'completed').length || 0,
      ongoingProjects: projects?.filter(p => p.status === 'ongoing').length || 0,
      totalXP: userProfile?.experience_points || 0,
      friends: friendsCountLoading ? 0 : friendsCount
    }
  };

  const completedProjects = (projects || []).filter(p => p.status === 'completed').map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    tech: project.technologies,
    xp: project.xp_reward || 0,
    bits: project.bits_reward || 0,
    bytes: project.bytes_reward || 0,
    completedDate: project.completed_date || new Date().toISOString(),
    difficulty: project.difficulty,
    githubUrl: project.github_url || "",
    teamMembers: project.members
  }));

  const ongoingProjects = (projects || []).filter(p => p.status === 'ongoing').map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    tech: project.technologies,
    startDate: project.started_date || new Date().toISOString(),
    difficulty: project.difficulty,
    githubUrl: project.github_url || "",
    teamMembers: project.members,
    messages: [] // No messages for now since we don't have a messages table
  }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-teal-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Advanced': return 'bg-indigo-600';
      case 'Expert': return 'bg-violet-700';
      default: return 'bg-teal-500';
    }
  };

  const navigateToWorkspace = (projectId: number) => {
    setSelectedProject(null);
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-pixel text-cyan-400 mb-2">BitBridge Profile</h1>
          <p className="text-lg text-slate-300 font-light">Track your coding journey and achievements</p>
        </div>

        {/* Profile Overview */}
        <Card className="overflow-hidden bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <Avatar className="w-36 h-36 border-4 border-slate-700 shadow-lg">
                  <AvatarImage src={userProfileData.avatar} alt={userProfileData.name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                    {userProfileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg shadow-cyan-500/20">
                  {userProfileData.experience.level}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-5">
                <div>
                  <h2 className="text-3xl font-pixel text-white mb-1">{userProfileData.name}</h2>
                  <p className="text-lg text-slate-300 mb-2 font-light">{userProfileData.username}</p>
                  <Badge className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 shadow-glow">
                    {userProfileData.skillLevel.length > 20 ? 
                      `${userProfileData.skillLevel.substring(0, 20)}...` : 
                      userProfileData.skillLevel
                    }
                  </Badge>
                </div>
                
                {/* Bio */}
                <div className="max-w-2xl">
                  <p className="text-slate-300 font-light leading-relaxed">
                    {userProfileData.bio}
                  </p>
                </div>
                
                {/* Experience Bar and Currency - Combined */}
                <div className="space-y-4 max-w-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium text-slate-300">
                      <span>Level {userProfileData.experience.level}</span>
                      <span>{userProfileData.experience.current} / {userProfileData.experience.nextLevel} XP</span>
                    </div>
                    <Progress value={xpProgress.progressPercentage} className="h-3 bg-slate-700" />
                    <p className="text-sm text-slate-400 font-light">
                      {xpProgress.xpNeededForNextLevel} XP to next level
                    </p>
                  </div>
                  
                  {/* Compact Currency Display */}
                  <div className="flex gap-4 justify-center md:justify-start">
                    <div className="bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Bitcoin className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{userProfileData.currency.bits.toLocaleString()}</span>
                      <span className="text-slate-300 text-sm">Bits</span>
                    </div>
                    <div className="bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-400 font-bold">{userProfileData.currency.bytes}</span>
                      <span className="text-slate-300 text-sm">Bytes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-5 text-center">
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{userProfileData.stats.completedProjects}</p>
                  <p className="text-sm text-slate-300 font-light">Completed</p>
                </div>
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Code className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{userProfileData.stats.ongoingProjects}</p>
                  <p className="text-sm text-slate-300 font-light">Ongoing</p>
                </div>
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Star className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{userProfileData.stats.totalXP}</p>
                  <p className="text-sm text-slate-300 font-light">Total XP</p>
                </div>
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <UserPlus className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{userProfileData.stats.friends}</p>
                  <p className="text-sm text-slate-300 font-light">Friends</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Projects Only */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Completed Projects */}
          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6">
              <CardTitle className="flex items-center gap-2 font-pixel text-sm">
                <Trophy className="w-6 h-6" />
                Completed Projects ({completedProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {completedProjects.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No completed projects yet</p>
                    <p className="text-sm mt-2">Start working on projects to see them here!</p>
                  </div>
                ) : (
                  completedProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className="border border-slate-700 rounded-lg p-5 hover:shadow-md hover:shadow-cyan-900/10 transition-shadow bg-slate-800 cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-white">{project.title}</h3>
                        <Badge className={`${getDifficultyColor(project.difficulty)} text-white shadow-sm`}>
                          {project.difficulty}
                        </Badge>
                      </div>
                      <p className="text-slate-300 mb-4 font-light">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs text-slate-300 border-slate-600">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="mb-4">
                        <ProjectRewards 
                          difficulty={project.difficulty}
                          xpReward={project.xp}
                          bitsReward={project.bits}
                          bytesReward={project.bytes}
                        />
                      </div>
                      <div className="flex justify-between items-center text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.completedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ongoing Projects - Progress bars removed */}
          <Card className="bg-slate-800 border-slate-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6">
              <CardTitle className="flex items-center gap-2 font-pixel text-sm">
                <Code className="w-6 h-6" />
                Ongoing Projects ({ongoingProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {ongoingProjects.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No ongoing projects yet</p>
                    <p className="text-sm mt-2">Join a project to start collaborating!</p>
                  </div>
                ) : (
                  ongoingProjects.map((project) => (
                    <div 
                      key={project.id} 
                      className="border border-slate-700 rounded-lg p-5 hover:shadow-md hover:shadow-cyan-900/10 transition-shadow bg-slate-800 cursor-pointer"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-white">{project.title}</h3>
                        <Badge className={`${getDifficultyColor(project.difficulty)} text-white shadow-sm`}>
                          {project.difficulty}
                        </Badge>
                      </div>
                      <p className="text-slate-300 mb-4 font-light">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs text-slate-300 border-slate-600">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <Clock className="w-4 h-4" />
                        Started {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Details Dialog - Progress bars removed */}
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-cyan-400 flex items-center gap-2">
                {selectedProject?.title}
                <Badge className={selectedProject && `${getDifficultyColor(selectedProject.difficulty)} ml-2 text-white`}>
                  {selectedProject?.difficulty}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                {selectedProject?.description}
              </DialogDescription>
            </DialogHeader>
            
            {selectedProject && (
              <div className="space-y-6 mt-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-slate-300 font-semibold mb-1">Status</p>
                    <p className="text-white">
                      {selectedProject.completedDate ? 'Completed' : 'In Progress'}
                    </p>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-slate-300 font-semibold mb-1">Date</p>
                    <p className="text-white">
                      {selectedProject.completedDate 
                        ? `Completed on ${new Date(selectedProject.completedDate).toLocaleDateString()}` 
                        : `Started on ${new Date(selectedProject.startDate).toLocaleDateString()}`
                      }
                    </p>
                  </div>
                </div>
                
                {/* Project Rewards */}
                {selectedProject.completedDate && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Rewards Earned</h3>
                    <ProjectRewards 
                      difficulty={selectedProject.difficulty}
                      xpReward={selectedProject.xp}
                      bitsReward={selectedProject.bits}
                      bytesReward={selectedProject.bytes}
                    />
                  </div>
                )}
                
                {/* Technologies */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tech.map((tech: string) => (
                      <Badge key={tech} className="bg-slate-700 text-cyan-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Team Members - Now using separate component to avoid hooks in map */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Team Members</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedProject.teamMembers?.map((member: any, index: number) => (
                      <TeamMemberAvatar key={index} member={member} />
                    ))}
                  </div>
                </div>
                
                {/* GitHub Link */}
                {selectedProject.githubUrl && (
                  <div className="flex items-center gap-2">
                    <Github className="h-5 w-5 text-white" />
                    <a 
                      href={selectedProject.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-cyan-400 hover:underline flex items-center"
                    >
                      GitHub Repository
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                )}
                
                {/* Project workspace button - replacing the chat button */}
                {!selectedProject.completedDate && (
                  <div className="mt-4">
                    <Button 
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2"
                      onClick={() => navigateToWorkspace(selectedProject.id)}
                    >
                      <Code className="h-5 w-5" />
                      Open Project Workspace
                    </Button>
                    <p className="text-center text-sm text-slate-400 mt-2">
                      Access tasks, files, and team communication in the project workspace
                    </p>
                  </div>
                )}
                
                {/* Project Actions */}
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => setSelectedProject(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;
