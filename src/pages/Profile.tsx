import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Star, Code, Zap, Calendar, Clock, Github, MessageSquare, ExternalLink, Bitcoin, DollarSign, Award, Target, Users, GitBranch, Lightbulb, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

// Icon mapping for achievements
const iconMap: { [key: string]: any } = {
  Target,
  Users,
  Code,
  Lightbulb,
  GitBranch,
  Award,
  Zap,
  Shield,
  Trophy,
  Star
};

const Profile = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, achievements, projects, loading: profileLoading, error } = useUserProfile();
  
  // Handle loading state
  if (authLoading || profileLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-cyan-400 text-lg">Loading...</div>
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

  // Handle error
  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-red-400 text-lg">Error loading profile: {error}</div>
      </div>
    );
  }
  
  // Get user data from authenticated user
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || '';
  const avatarUrl = user.user_metadata?.avatar_url || "/placeholder.svg";
  
  // Calculate experience progress for the next level - same logic as NavBar
  const getExperienceForLevel = (level: number) => level * 1000; // 1000 XP per level
  const currentLevelXP = getExperienceForLevel((profile?.experience_level || 1) - 1);
  const nextLevelXP = getExperienceForLevel(profile?.experience_level || 1);
  const progressInCurrentLevel = (profile?.experience_points || 0) - currentLevelXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelXP;
  const experiencePercentage = (progressInCurrentLevel / xpNeededForNextLevel) * 100;
  
  // Use real profile data or defaults
  const userProfile = {
    name: displayName,
    username: `@${userEmail.split('@')[0]}`,
    bio: profile?.bio || "Welcome to BitBridge! Update your bio to tell others about yourself.",
    avatar: avatarUrl,
    skillLevel: profile?.skill_level || "Beginner Developer",
    experience: {
      current: profile?.experience_points || 0,
      nextLevel: nextLevelXP,
      level: profile?.experience_level || 1
    },
    currency: {
      bits: profile?.bits_currency || 100,
      bytes: profile?.bytes_currency || 5
    },
    stats: {
      totalProjects: projects.length,
      completedProjects: projects.filter(p => p.status === 'completed').length,
      ongoingProjects: projects.filter(p => p.status === 'ongoing').length,
      totalXP: profile?.experience_points || 0
    }
  };

  const completedProjects = projects.filter(p => p.status === 'completed').map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    tech: project.technologies,
    xp: project.xp_reward || 0,
    completedDate: project.completed_date || new Date().toISOString(),
    difficulty: project.difficulty,
    githubUrl: project.github_url || "",
    teamMembers: [
      { role: project.members[0]?.role || "Developer", username: `@${userEmail.split('@')[0]}`, avatar: avatarUrl }
    ]
  }));

  const ongoingProjects = projects.filter(p => p.status === 'ongoing').map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    tech: project.technologies,
    progress: project.progress || 0,
    startDate: project.started_date || new Date().toISOString(),
    difficulty: project.difficulty,
    githubUrl: project.github_url || "",
    teamMembers: [
      { role: project.members[0]?.role || "Developer", username: `@${userEmail.split('@')[0]}`, avatar: avatarUrl }
    ],
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'bg-slate-500';
      case 'Uncommon': return 'bg-green-500';
      case 'Rare': return 'bg-blue-500';
      case 'Epic': return 'bg-purple-500';
      case 'Legendary': return 'bg-yellow-500';
      default: return 'bg-slate-500';
    }
  };

  const navigateToChat = (projectId: number) => {
    setSelectedProject(null);
    navigate('/chat', { state: { projectId } });
  };

  const navigateToWorkspace = (projectId: number) => {
    setSelectedProject(null);
    navigate(`/project/${projectId}`);
  };

  const earnedAchievements = achievements.filter(a => a.earned_at);
  const unlockedAchievements = achievements.filter(a => !a.earned_at);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">BitBridge Profile</h1>
          <p className="text-lg text-slate-300 font-light">Track your coding journey and achievements</p>
        </div>

        {/* Profile Overview */}
        <Card className="overflow-hidden bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <Avatar className="w-36 h-36 border-4 border-slate-700 shadow-lg">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg shadow-cyan-500/20">
                  {userProfile.experience.level}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-5">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1 font-sans">{userProfile.name}</h2>
                  <p className="text-lg text-slate-300 mb-2 font-light">{userProfile.username}</p>
                  <Badge className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 shadow-glow">
                    {userProfile.skillLevel}
                  </Badge>
                </div>
                
                {/* Bio */}
                <div className="max-w-2xl">
                  <p className="text-slate-300 font-light leading-relaxed">
                    {userProfile.bio}
                  </p>
                </div>
                
                {/* Experience Bar and Currency - Combined */}
                <div className="space-y-4 max-w-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-medium text-slate-300">
                      <span>Level {userProfile.experience.level}</span>
                      <span>{userProfile.experience.current} / {userProfile.experience.nextLevel} XP</span>
                    </div>
                    <Progress value={experiencePercentage} className="h-3 bg-slate-700" />
                    <p className="text-sm text-slate-400 font-light">
                      {userProfile.experience.nextLevel - userProfile.experience.current} XP to next level
                    </p>
                  </div>
                  
                  {/* Compact Currency Display */}
                  <div className="flex gap-4 justify-center md:justify-start">
                    <div className="bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
                      <Bitcoin className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{userProfile.currency.bits.toLocaleString()}</span>
                      <span className="text-slate-300 text-sm">Bits</span>
                    </div>
                    <div className="bg-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-400 font-bold">{userProfile.currency.bytes}</span>
                      <span className="text-slate-300 text-sm">Bytes</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-5 text-center">
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{userProfile.stats.completedProjects}</p>
                  <p className="text-sm text-slate-300 font-light">Completed</p>
                </div>
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Code className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{userProfile.stats.ongoingProjects}</p>
                  <p className="text-sm text-slate-300 font-light">Ongoing</p>
                </div>
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Star className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{userProfile.stats.totalXP}</p>
                  <p className="text-sm text-slate-300 font-light">Total XP</p>
                </div>
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Award className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{earnedAchievements.length}</p>
                  <p className="text-sm text-slate-300 font-light">Achievements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
            <TabsTrigger value="projects" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              Projects
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Completed Projects */}
              <Card className="bg-slate-800 border-slate-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6">
                  <CardTitle className="flex items-center gap-2 font-sans">
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
                          <div className="flex justify-between items-center text-sm text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(project.completedDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1 text-cyan-400 font-medium">
                              <Star className="w-4 h-4" />
                              +{project.xp} XP
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Ongoing Projects */}
              <Card className="bg-slate-800 border-slate-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6">
                  <CardTitle className="flex items-center gap-2 font-sans">
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
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm font-medium text-slate-300">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2 bg-slate-700" />
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
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="space-y-8">
              {/* Achievements Summary */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">{earnedAchievements.length}</h3>
                    <p className="text-slate-400">Achievements Earned</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <Target className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">{unlockedAchievements.length}</h3>
                    <p className="text-slate-400">In Progress</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-6 text-center">
                    <Star className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {earnedAchievements.reduce((total, achievement) => total + achievement.xp_reward, 0)}
                    </h3>
                    <p className="text-slate-400">XP from Achievements</p>
                  </CardContent>
                </Card>
              </div>

              {/* Earned Achievements */}
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                  <Trophy className="h-6 w-6" />
                  Earned Achievements
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {earnedAchievements.length === 0 ? (
                    <div className="col-span-full text-center text-slate-400 py-8">
                      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No achievements earned yet</p>
                      <p className="text-sm mt-2">Complete projects and activities to earn achievements!</p>
                    </div>
                  ) : (
                    earnedAchievements.map((achievement) => {
                      const IconComponent = iconMap[achievement.icon_name] || Star;
                      return (
                        <Card key={achievement.id} className="bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-cyan-900/20 transition-all">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-lg">
                                <IconComponent className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-semibold text-white">{achievement.title}</h3>
                                  <Badge className={`${getRarityColor(achievement.rarity)} text-white text-xs`}>
                                    {achievement.rarity}
                                  </Badge>
                                </div>
                                <p className="text-slate-300 text-sm mb-3">{achievement.description}</p>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-slate-400">
                                    Earned {new Date(achievement.earned_at!).toLocaleDateString()}
                                  </span>
                                  <span className="text-cyan-400 font-medium">+{achievement.xp_reward} XP</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
              </div>

              {/* In Progress Achievements */}
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  In Progress
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unlockedAchievements.map((achievement) => {
                    const IconComponent = iconMap[achievement.icon_name] || Star;
                    const hasProgress = achievement.progress !== undefined && achievement.total !== undefined;
                    const progressPercentage = hasProgress ? (achievement.progress! / achievement.total!) * 100 : 0;
                    
                    return (
                      <Card key={achievement.id} className="bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-cyan-900/20 transition-all opacity-75">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="bg-slate-700 p-3 rounded-lg">
                              <IconComponent className="h-6 w-6 text-slate-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-slate-300">{achievement.title}</h3>
                                <Badge className={`${getRarityColor(achievement.rarity)} text-white text-xs opacity-75`}>
                                  {achievement.rarity}
                                </Badge>
                              </div>
                              <p className="text-slate-400 text-sm mb-3">{achievement.description}</p>
                              {hasProgress && (
                                <div className="mb-3">
                                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span>Progress</span>
                                    <span>{achievement.progress}/{achievement.total}</span>
                                  </div>
                                  <Progress value={progressPercentage} className="h-2 bg-slate-700" />
                                </div>
                              )}
                              <div className="text-sm text-slate-400">
                                Reward: <span className="text-cyan-400 font-medium">+{achievement.xp_reward} XP</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Project Details Dialog */}
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
                      {selectedProject.progress !== undefined ? `In Progress (${selectedProject.progress}%)` : 'Completed'}
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
                
                {/* Team Members */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Team Members</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {selectedProject.teamMembers.map((member: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 bg-slate-700 p-3 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-cyan-600 text-white">
                            {member.username.substring(1, 3).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-cyan-300">{member.username}</p>
                          <p className="text-xs text-slate-300">{member.role}</p>
                        </div>
                      </div>
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
                {selectedProject.progress !== undefined && (
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
