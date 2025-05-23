
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
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Developer Profile</h1>
          <p className="text-lg text-gray-600">Track your coding journey and achievements</p>
        </div>

        {/* Profile Overview */}
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                  {user.experience.level}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-lg text-gray-600">{user.username}</p>
                  <Badge className="mt-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    {user.skillLevel}
                  </Badge>
                </div>
                
                {/* Experience Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Level {user.experience.level}</span>
                    <span>{user.experience.current} / {user.experience.nextLevel} XP</span>
                  </div>
                  <Progress value={experiencePercentage} className="h-3" />
                  <p className="text-sm text-gray-600">
                    {user.experience.nextLevel - user.experience.current} XP to next level
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl">
                  <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-700">{user.stats.completedProjects}</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-xl">
                  <Code className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-700">{user.stats.ongoingProjects}</p>
                  <p className="text-sm text-blue-600">Ongoing</p>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl">
                  <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-700">{user.stats.totalXP}</p>
                  <p className="text-sm text-purple-600">Total XP</p>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-4 rounded-xl">
                  <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-orange-700">{user.stats.totalProjects}</p>
                  <p className="text-sm text-orange-600">Total Projects</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Completed Projects */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Completed Projects ({completedProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {completedProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{project.title}</h3>
                      <Badge className={`${getDifficultyColor(project.difficulty)} text-white`}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.completedDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-green-600 font-medium">
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
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Code className="w-6 h-6" />
                Ongoing Projects ({ongoingProjects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {ongoingProjects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{project.title}</h3>
                      <Badge className={`${getDifficultyColor(project.difficulty)} text-white`}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tech.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
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
