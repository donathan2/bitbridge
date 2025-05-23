
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Github, MessageSquare, FileText, CheckSquare, Users, Layout, Code, PlusCircle, Trash2, ExternalLink } from 'lucide-react';

const ProjectWorkspace = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [newMessage, setNewMessage] = useState('');
  
  // Fetch project data - this would be replaced with a real API call
  useEffect(() => {
    // Simulating API fetch
    const fetchProject = () => {
      setLoading(true);
      // Mock data - would be replaced with actual API call
      const ongoingProjects = [
        {
          id: "1",
          title: "AI Chat Interface",
          description: "Modern chat UI with AI integration",
          tech: ["React", "TypeScript", "OpenAI"],
          progress: 75,
          startDate: "2024-05-20",
          endDate: "2024-06-30",
          difficulty: "Advanced",
          githubUrl: "https://github.com/alexchen/ai-chat",
          teamMembers: [
            { id: "1", role: "Frontend Developer", username: "@alexchen", avatar: "/placeholder.svg" },
            { id: "2", role: "AI Engineer", username: "@jwilson", avatar: "/placeholder.svg" },
            { id: "3", role: "UX Designer", username: "@echen", avatar: "/placeholder.svg" }
          ],
          messages: [
            { id: "1", username: "@alexchen", avatar: "/placeholder.svg", text: "Just pushed the new chat components", timestamp: "2024-05-22 10:30 AM" },
            { id: "2", username: "@jwilson", avatar: "/placeholder.svg", text: "Great! I'll update the API integration tomorrow", timestamp: "2024-05-22 11:45 AM" },
            { id: "3", username: "@echen", avatar: "/placeholder.svg", text: "I've uploaded the new design mockups to Figma", timestamp: "2024-05-23 09:15 AM" }
          ],
          tasks: [
            { id: "1", title: "Create responsive chat interface", assignee: "@alexchen", status: "completed", dueDate: "2024-05-25" },
            { id: "2", title: "Implement message history", assignee: "@alexchen", status: "in-progress", dueDate: "2024-05-28" },
            { id: "3", title: "Connect OpenAI API", assignee: "@jwilson", status: "in-progress", dueDate: "2024-05-30" },
            { id: "4", title: "Design user onboarding flow", assignee: "@echen", status: "pending", dueDate: "2024-06-05" }
          ],
          files: [
            { id: "1", name: "Design System.fig", type: "figma", uploadedBy: "@echen", uploadDate: "2024-05-20" },
            { id: "2", name: "API Documentation.md", type: "markdown", uploadedBy: "@jwilson", uploadDate: "2024-05-22" },
            { id: "3", name: "Project Roadmap.pdf", type: "pdf", uploadedBy: "@alexchen", uploadDate: "2024-05-23" }
          ]
        },
        {
          id: "2",
          title: "Portfolio Website",
          description: "Personal portfolio with animations",
          tech: ["React", "Framer Motion"],
          progress: 60,
          startDate: "2024-05-18",
          endDate: "2024-06-15",
          difficulty: "Intermediate",
          githubUrl: "https://github.com/alexchen/portfolio",
          teamMembers: [
            { id: "1", role: "Developer", username: "@alexchen", avatar: "/placeholder.svg" },
            { id: "2", role: "Designer", username: "@sarahj", avatar: "/placeholder.svg" }
          ],
          messages: [
            { id: "1", username: "@alexchen", avatar: "/placeholder.svg", text: "Homepage animations are complete", timestamp: "2024-05-21 09:30 AM" },
            { id: "2", username: "@sarahj", avatar: "/placeholder.svg", text: "New color scheme looks great!", timestamp: "2024-05-22 14:20 PM" }
          ],
          tasks: [
            { id: "1", title: "Implement page transitions", assignee: "@alexchen", status: "completed", dueDate: "2024-05-22" },
            { id: "2", title: "Create project showcase component", assignee: "@alexchen", status: "in-progress", dueDate: "2024-05-25" },
            { id: "3", title: "Design contact form", assignee: "@sarahj", status: "completed", dueDate: "2024-05-20" }
          ],
          files: [
            { id: "1", name: "Portfolio Wireframes.fig", type: "figma", uploadedBy: "@sarahj", uploadDate: "2024-05-18" },
            { id: "2", name: "Content Strategy.docx", type: "document", uploadedBy: "@alexchen", uploadDate: "2024-05-19" }
          ]
        },
        {
          id: "3",
          title: "Mobile Game",
          description: "Puzzle game with React Native",
          tech: ["React Native", "Expo"],
          progress: 30,
          startDate: "2024-05-22",
          endDate: "2024-07-15",
          difficulty: "Expert",
          githubUrl: "https://github.com/alexchen/puzzle-game",
          teamMembers: [
            { id: "1", role: "Mobile Developer", username: "@alexchen", avatar: "/placeholder.svg" },
            { id: "2", role: "Game Designer", username: "@mwong", avatar: "/placeholder.svg" },
            { id: "3", role: "Sound Engineer", username: "@dsmith", avatar: "/placeholder.svg" },
            { id: "4", role: "Animator", username: "@akhan", avatar: "/placeholder.svg" }
          ],
          messages: [
            { id: "1", username: "@alexchen", avatar: "/placeholder.svg", text: "Basic game mechanics implemented", timestamp: "2024-05-22 16:30 PM" },
            { id: "2", username: "@mwong", avatar: "/placeholder.svg", text: "Level designs ready for review", timestamp: "2024-05-23 08:40 AM" }
          ],
          tasks: [
            { id: "1", title: "Implement core gameplay loop", assignee: "@alexchen", status: "in-progress", dueDate: "2024-05-29" },
            { id: "2", title: "Design first 10 levels", assignee: "@mwong", status: "completed", dueDate: "2024-05-23" },
            { id: "3", title: "Create background music", assignee: "@dsmith", status: "pending", dueDate: "2024-06-05" },
            { id: "4", title: "Animate character movements", assignee: "@akhan", status: "pending", dueDate: "2024-06-10" }
          ],
          files: [
            { id: "1", name: "Game Design Document.pdf", type: "pdf", uploadedBy: "@mwong", uploadDate: "2024-05-22" },
            { id: "2", name: "Character Assets.zip", type: "archive", uploadedBy: "@akhan", uploadDate: "2024-05-23" }
          ]
        }
      ];

      const foundProject = ongoingProjects.find(p => p.id === projectId);
      
      if (foundProject) {
        setProject(foundProject);
      }
      setLoading(false);
    };
    
    fetchProject();
  }, [projectId]);

  // Add a new task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = {
      id: `new-${Date.now()}`,
      title: newTask,
      assignee: "@alexchen", // Default assignee
      status: "pending",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Due in 7 days
    };
    
    setProject({
      ...project,
      tasks: [...project.tasks, task]
    });
    
    setNewTask('');
  };

  // Add a new message
  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const message = {
      id: `new-${Date.now()}`,
      username: "@alexchen", // Current user
      avatar: "/placeholder.svg",
      text: newMessage,
      timestamp: new Date().toLocaleString()
    };
    
    setProject({
      ...project,
      messages: [...project.messages, message]
    });
    
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Loading project workspace...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4">Project Not Found</h1>
        <p className="text-white mb-8">The project you're looking for doesn't exist or you don't have access.</p>
        <Button asChild>
          <Link to="/profile">Return to Profile</Link>
        </Button>
      </div>
    );
  }

  // Helper function to get task status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-amber-500';
      case 'pending': return 'bg-slate-500';
      default: return 'bg-slate-500';
    }
  };

  // Helper function for file type icon
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'figma': return <Code className="h-5 w-5" />;
      case 'pdf': return <FileText className="h-5 w-5" />;
      case 'markdown': case 'document': return <FileText className="h-5 w-5" />;
      case 'archive': return <FileText className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">{project.title}</h1>
            <p className="text-slate-300 mt-1">{project.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-cyan-600 hover:bg-cyan-700">{project.difficulty}</Badge>
            <Link to={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Github size={16} />
                GitHub
                <ExternalLink size={14} />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar className="text-cyan-400 h-5 w-5" />
              <div>
                <p className="text-xs text-slate-400">Start Date</p>
                <p className="text-sm text-white">{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="text-cyan-400 h-5 w-5" />
              <div>
                <p className="text-xs text-slate-400">Target Completion</p>
                <p className="text-sm text-white">{new Date(project.endDate).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700 col-span-1 md:col-span-2">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-300">Overall Progress</span>
                <span className="text-sm font-medium text-white">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech: string, i: number) => (
            <Badge key={i} variant="outline" className="bg-slate-700 text-cyan-300 border-none">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Workspace Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-slate-800 border-b border-slate-700 w-full justify-start rounded-none p-0 h-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <Layout className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="tasks" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <CheckSquare className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <FileText className="h-4 w-4 mr-2" />
            Files
          </TabsTrigger>
          <TabsTrigger value="discussion" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussion
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Stats */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Project Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-slate-300">{project.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-1">Project Status</h4>
                        <p className="text-white">In Progress</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-1">Progress</h4>
                        <p className="text-white">{project.progress}% Complete</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-1">Start Date</h4>
                        <p className="text-white">{new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-1">Target Completion</h4>
                        <p className="text-white">{new Date(project.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Task Overview */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-white">Recent Tasks</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="#tasks" onClick={() => {
                      // Fixed: Use querySelector with type assertion to handle click
                      const element = document.querySelector('[data-value="tasks"]') as HTMLElement;
                      if (element) {
                        element.click();
                      }
                    }}>
                      View All
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.tasks.slice(0, 3).map((task: any) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(task.status)} w-3 h-3 p-0 rounded-full`} />
                          <span className="text-white">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-300">{task.assignee}</span>
                          <span className="text-xs text-slate-400">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Team Members */}
            <div>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.teamMembers.map((member: any) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-md">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.username} />
                          <AvatarFallback>
                            {member.username.substring(1, 3).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white">{member.username}</p>
                          <p className="text-xs text-slate-400">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-white">Project Tasks</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Filter:</span>
                <select className="bg-slate-700 text-white rounded px-2 py-1 text-sm border border-slate-600">
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add Task Form */}
              <form onSubmit={handleAddTask} className="mb-6 flex gap-2">
                <Input
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Add a new task..."
                  className="flex-grow bg-slate-700 border-slate-600 text-white"
                />
                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </form>
              
              {/* Tasks List */}
              <div className="space-y-3">
                {project.tasks.map((task: any) => (
                  <div 
                    key={task.id} 
                    className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(task.status)} w-3 h-3 p-0 rounded-full`} />
                      <div>
                        <p className="text-white">{task.title}</p>
                        <p className="text-xs text-slate-400">Assigned to: {task.assignee}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-300">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <select 
                        className="bg-slate-600 text-white text-sm rounded px-2 py-1 border border-slate-500"
                        value={task.status}
                        onChange={(e) => {
                          const updatedTasks = project.tasks.map((t: any) => 
                            t.id === task.id ? {...t, status: e.target.value} : t
                          );
                          setProject({...project, tasks: updatedTasks});
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-slate-400 hover:text-red-400"
                        onClick={() => {
                          const updatedTasks = project.tasks.filter((t: any) => t.id !== task.id);
                          setProject({...project, tasks: updatedTasks});
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.teamMembers.map((member: any) => (
                  <Card key={member.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={member.avatar} alt={member.username} />
                          <AvatarFallback className="bg-cyan-600 text-white text-xl">
                            {member.username.substring(1, 3).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium text-white">{member.username}</h3>
                          <p className="text-cyan-400">{member.role}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="sm" variant="outline" className="h-8 px-3 py-1">
                              <MessageSquare className="h-3.5 w-3.5 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Files Tab */}
        <TabsContent value="files" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl text-white">Project Files</CardTitle>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <PlusCircle className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">File Name</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Uploaded By</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                      <th className="text-right py-3 px-4 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.files.map((file: any) => (
                      <tr key={file.id} className="border-b border-slate-700 hover:bg-slate-700">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getFileIcon(file.type)}
                            <span className="text-white">{file.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300 capitalize">{file.type}</td>
                        <td className="py-3 px-4 text-slate-300">{file.uploadedBy}</td>
                        <td className="py-3 px-4 text-slate-300">
                          {new Date(file.uploadDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Discussion Tab */}
        <TabsContent value="discussion" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Team Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-96">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {project.messages.map((message: any) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.avatar} alt={message.username} />
                        <AvatarFallback className="bg-cyan-600 text-white text-xs">
                          {message.username.substring(1, 3).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-cyan-400">{message.username}</p>
                          <p className="text-xs text-slate-400">{message.timestamp}</p>
                        </div>
                        <p className="text-white mt-1">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddMessage} className="flex gap-2 mt-auto">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow bg-slate-700 border-slate-600 text-white resize-none"
                    rows={2}
                  />
                  <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 self-end">
                    Send
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectWorkspace;
