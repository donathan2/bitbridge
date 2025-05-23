
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Star, Code, Zap, Calendar, Clock, Github, MessageSquare, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const Profile = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  
  // Mock user data
  const user = {
    name: "Alex Chen",
    username: "@alexchen",
    bio: "Full-stack developer passionate about React, TypeScript and building beautiful user experiences. 5+ years of experience in web development, currently exploring WebAssembly and AI applications.",
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
      difficulty: "Advanced",
      githubUrl: "https://github.com/alexchen/ecommerce-dashboard",
      teamMembers: [
        { role: "Frontend Developer", username: "@alexchen", avatar: "/placeholder.svg" },
        { role: "Backend Developer", username: "@sarahj", avatar: "/placeholder.svg" },
        { role: "UI/UX Designer", username: "@mwong", avatar: "/placeholder.svg" }
      ]
    },
    {
      id: 2,
      title: "Task Management App",
      description: "Full-stack productivity application",
      tech: ["Next.js", "Prisma", "PostgreSQL"],
      xp: 1200,
      completedDate: "2024-05-10",
      difficulty: "Expert",
      githubUrl: "https://github.com/alexchen/task-manager",
      teamMembers: [
        { role: "Full-stack Developer", username: "@alexchen", avatar: "/placeholder.svg" },
        { role: "Backend Developer", username: "@priyap", avatar: "/placeholder.svg" }
      ]
    },
    {
      id: 3,
      title: "Weather Widget",
      description: "Real-time weather component",
      tech: ["React", "API Integration"],
      xp: 450,
      completedDate: "2024-05-05",
      difficulty: "Intermediate",
      githubUrl: "https://github.com/alexchen/weather-widget",
      teamMembers: [
        { role: "Frontend Developer", username: "@alexchen", avatar: "/placeholder.svg" }
      ]
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
      difficulty: "Advanced",
      githubUrl: "https://github.com/alexchen/ai-chat",
      teamMembers: [
        { role: "Frontend Developer", username: "@alexchen", avatar: "/placeholder.svg" },
        { role: "AI Engineer", username: "@jwilson", avatar: "/placeholder.svg" },
        { role: "UX Designer", username: "@echen", avatar: "/placeholder.svg" }
      ],
      messages: [
        { username: "@alexchen", avatar: "/placeholder.svg", text: "Just pushed the new chat components", timestamp: "2024-05-22 10:30 AM" },
        { username: "@jwilson", avatar: "/placeholder.svg", text: "Great! I'll update the API integration tomorrow", timestamp: "2024-05-22 11:45 AM" },
        { username: "@echen", avatar: "/placeholder.svg", text: "I've uploaded the new design mockups to Figma", timestamp: "2024-05-23 09:15 AM" }
      ]
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "Personal portfolio with animations",
      tech: ["React", "Framer Motion"],
      progress: 60,
      startDate: "2024-05-18",
      difficulty: "Intermediate",
      githubUrl: "https://github.com/alexchen/portfolio",
      teamMembers: [
        { role: "Developer", username: "@alexchen", avatar: "/placeholder.svg" },
        { role: "Designer", username: "@sarahj", avatar: "/placeholder.svg" }
      ],
      messages: [
        { username: "@alexchen", avatar: "/placeholder.svg", text: "Homepage animations are complete", timestamp: "2024-05-21 09:30 AM" },
        { username: "@sarahj", avatar: "/placeholder.svg", text: "New color scheme looks great!", timestamp: "2024-05-22 14:20 PM" }
      ]
    },
    {
      id: 3,
      title: "Mobile Game",
      description: "Puzzle game with React Native",
      tech: ["React Native", "Expo"],
      progress: 30,
      startDate: "2024-05-22",
      difficulty: "Expert",
      githubUrl: "https://github.com/alexchen/puzzle-game",
      teamMembers: [
        { role: "Mobile Developer", username: "@alexchen", avatar: "/placeholder.svg" },
        { role: "Game Designer", username: "@mwong", avatar: "/placeholder.svg" },
        { role: "Sound Engineer", username: "@dsmith", avatar: "/placeholder.svg" },
        { role: "Animator", username: "@akhan", avatar: "/placeholder.svg" }
      ],
      messages: [
        { username: "@alexchen", avatar: "/placeholder.svg", text: "Basic game mechanics implemented", timestamp: "2024-05-22 16:30 PM" },
        { username: "@mwong", avatar: "/placeholder.svg", text: "Level designs ready for review", timestamp: "2024-05-23 08:40 AM" }
      ]
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
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section - Remove since we now have NavBar */}
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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg shadow-cyan-500/20">
                  {user.experience.level}
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-5">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1 font-sans">{user.name}</h2>
                  <p className="text-lg text-slate-300 mb-2 font-light">{user.username}</p>
                  <Badge className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-3 py-1 shadow-glow">
                    {user.skillLevel}
                  </Badge>
                </div>
                
                {/* Bio */}
                <div className="max-w-2xl">
                  <p className="text-slate-300 font-light leading-relaxed">
                    {user.bio}
                  </p>
                </div>
                
                {/* Experience Bar */}
                <div className="space-y-2 max-w-md">
                  <div className="flex justify-between text-sm font-medium text-slate-300">
                    <span>Level {user.experience.level}</span>
                    <span>{user.experience.current} / {user.experience.nextLevel} XP</span>
                  </div>
                  <Progress value={experiencePercentage} className="h-3 bg-slate-700" />
                  <p className="text-sm text-slate-400 font-light">
                    {user.experience.nextLevel - user.experience.current} XP to next level
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-5 text-center">
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Trophy className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{user.stats.completedProjects}</p>
                  <p className="text-sm text-slate-300 font-light">Completed</p>
                </div>
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Code className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{user.stats.ongoingProjects}</p>
                  <p className="text-sm text-slate-300 font-light">Ongoing</p>
                </div>
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Star className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{user.stats.totalXP}</p>
                  <p className="text-sm text-slate-300 font-light">Total XP</p>
                </div>
                <div className="bg-slate-700 p-5 rounded-xl shadow-md hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                  <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">{user.stats.totalProjects}</p>
                  <p className="text-sm text-slate-300 font-light">Total Projects</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                {completedProjects.map((project) => (
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
                ))}
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
                {ongoingProjects.map((project) => (
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

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
                
                {/* Team Chat */}
                {selectedProject.messages && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
                      <MessageSquare className="h-5 w-5" />
                      Team Chat
                    </h3>
                    <div className="bg-slate-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="space-y-4">
                        {selectedProject.messages.map((message: any, index: number) => (
                          <div key={index} className="flex gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={message.avatar} />
                              <AvatarFallback className="bg-cyan-600 text-white text-xs">
                                {message.username.substring(1, 3).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-cyan-300 text-sm">{message.username}</span>
                                <span className="text-slate-400 text-xs">{message.timestamp}</span>
                              </div>
                              <p className="text-slate-200 text-sm mt-1">{message.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Message Input */}
                    <div className="mt-3 flex gap-2">
                      <Textarea 
                        placeholder="Type a message..." 
                        className="bg-slate-700 border-slate-600 resize-none"
                      />
                      <Button className="bg-cyan-600 hover:bg-cyan-700 text-white self-end">
                        Send
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Project Actions */}
                <div className="flex justify-end gap-3 mt-4">
                  {selectedProject.progress !== undefined && (
                    <Button className="bg-cyan-600 hover:bg-cyan-700">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Team Chat
                    </Button>
                  )}
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
