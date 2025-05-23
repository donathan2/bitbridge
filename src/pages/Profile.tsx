
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Star, Code, Zap, Calendar, Clock } from 'lucide-react';

const Profile = () => {
  // Mock user data
  const user = {
    name: "Alex Chen",
    username: "@alexchen",
    avatar: "/placeholder.svg",
    skillLevel: "Advanced Developer",
    experience: {
      current: 7500,
      nextLevel: 10000,
      level: 8
    },
    stats: {
      totalProjects: 24,
      completedProjects: 18,
      ongoingProjects: 6,
      totalXP: 7500
    }
  };

  const completedProjects = [
    {
      id: 1,
      title: "E-commerce Dashboard",
      description: "Modern React dashboard with analytics",
      tech: ["React", "TypeScript", "Tailwind"],
      xp: 850,
      completedDate: "2024-05-15",
      difficulty: "Advanced"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Full-stack productivity application",
      tech: ["Next.js", "Prisma", "PostgreSQL"],
      xp: 1200,
      completedDate: "2024-05-10",
      difficulty: "Expert"
    },
    {
      id: 3,
      title: "Weather Widget",
      description: "Real-time weather component",
      tech: ["React", "API Integration"],
      xp: 450,
      completedDate: "2024-05-05",
      difficulty: "Intermediate"
    }
  ];

  const ongoingProjects = [
    {
      id: 1,
      title: "AI Chat Interface",
      description: "Modern chat UI with AI integration",
      tech: ["React", "TypeScript", "OpenAI"],
      progress: 75,
      startDate: "2024-05-20",
      difficulty: "Advanced"
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "Personal portfolio with animations",
      tech: ["React", "Framer Motion"],
      progress: 60,
      startDate: "2024-05-18",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      title: "Mobile Game",
      description: "Puzzle game with React Native",
      tech: ["React Native", "Expo"],
      progress: 30,
      startDate: "2024-05-22",
      difficulty: "Expert"
    }
  ];

  const experiencePercentage = (user.experience.current / user.experience.nextLevel) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-teal-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Advanced': return 'bg-indigo-600';
      case 'Expert': return 'bg-violet-700';
      default: return 'bg-teal-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-3 font-sans">BitBridge Profile</h1>
          <p className="text-lg text-slate-600 font-light">Track your coding journey and achievements</p>
        </div>

        {/* Profile Overview */}
        <Card className="overflow-hidden bg-white border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-10">
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                <Avatar className="w-36 h-36 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                  {user.experience.level}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-5">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-1 font-sans">{user.name}</h2>
                  <p className="text-lg text-slate-600 mb-2 font-light">{user.username}</p>
                  <Badge className="mt-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-3 py-1">
                    {user.skillLevel}
                  </Badge>
                </div>
                
                {/* Experience Bar */}
                <div className="space-y-2 max-w-md">
                  <div className="flex justify-between text-sm font-medium text-slate-700">
                    <span>Level {user.experience.level}</span>
                    <span>{user.experience.current} / {user.experience.nextLevel} XP</span>
                  </div>
                  <Progress value={experiencePercentage} className="h-3 bg-slate-100" indicatorClassName="bg-gradient-to-r from-indigo-500 to-blue-600" />
                  <p className="text-sm text-slate-600 font-light">
                    {user.experience.nextLevel - user.experience.current} XP to next level
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-5 text-center">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-5 rounded-xl shadow-sm">
                  <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-slate-700">{user.stats.completedProjects}</p>
                  <p className="text-sm text-slate-600 font-light">Completed</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-5 rounded-xl shadow-sm">
                  <Code className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-slate-700">{user.stats.ongoingProjects}</p>
                  <p className="text-sm text-slate-600 font-light">Ongoing</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-violet-50 p-5 rounded-xl shadow-sm">
                  <Star className="w-8 h-8 text-violet-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-slate-700">{user.stats.totalXP}</p>
                  <p className="text-sm text-slate-600 font-light">Total XP</p>
                </div>
                <div className="bg-gradient-to-br from-slate-50 to-teal-50 p-5 rounded-xl shadow-sm">
                  <Zap className="w-8 h-8 text-teal-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-slate-700">{user.stats.totalProjects}</p>
                  <p className="text-sm text-slate-600 font-light">Total Projects</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Completed Projects */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
              <CardTitle className="flex items-center gap-2 font-sans">
                <Trophy className="w-6 h-6" />
                Completed Projects ({completedProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {completedProjects.map((project) => (
                  <div key={project.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-slate-800">{project.title}</h3>
                      <Badge className={`${getDifficultyColor(project.difficulty)} text-white`}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-4 font-light">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs text-slate-600 border-slate-200">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.completedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-indigo-600 font-medium">
                        <Star className="w-4 h-4" />
                        +{project.xp} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ongoing Projects */}
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
              <CardTitle className="flex items-center gap-2 font-sans">
                <Code className="w-6 h-6" />
                Ongoing Projects ({ongoingProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {ongoingProjects.map((project) => (
                  <div key={project.id} className="border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-slate-800">{project.title}</h3>
                      <Badge className={`${getDifficultyColor(project.difficulty)} text-white`}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-4 font-light">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs text-slate-600 border-slate-200">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm font-medium text-slate-700">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 bg-slate-100" indicatorClassName="bg-gradient-to-r from-indigo-400 to-blue-500" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      Started {new Date(project.startDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
