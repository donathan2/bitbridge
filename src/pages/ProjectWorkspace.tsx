import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Github, MessageSquare, FileText, CheckSquare, Users, Layout, Code, PlusCircle, Trash2, ExternalLink, Edit, Check, X } from 'lucide-react';
import { useProject } from '@/hooks/useProject';
import { useProjectMembers } from '@/hooks/useProjectMembers';
import { useProjectTasks } from '@/hooks/useProjectTasks';
import { useProjectMessages } from '@/hooks/useProjectMessages';
import { useProjectCompletion } from '@/hooks/useProjectCompletion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import TaskDialog from '@/components/TaskDialog';

const ProjectWorkspace = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { project, loading, error } = useProject(projectId || '');
  const { members } = useProjectMembers(projectId || '');
  const { tasks, createTask, updateTask, deleteTask } = useProjectTasks(projectId || '');
  const { messages, sendMessage } = useProjectMessages(projectId || '');
  const { completeProject, loading: completingProject } = useProjectCompletion();
  
  const [newMessage, setNewMessage] = useState('');
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Check if current user is project lead
  const isProjectLead = user && members.some(member => 
    member.user_id === user.id && member.role === 'Project Lead'
  );

  // Get available roles for task assignment
  const availableRoles = [...new Set(members.map(member => member.role))];

  // Add a new message
  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);
    const success = await sendMessage(newMessage);
    setSendingMessage(false);

    if (success) {
      setNewMessage('');
    } else {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle task operations
  const handleCreateTask = async (taskData: any) => {
    const success = await createTask(taskData);
    if (!success) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
    return success;
  };

  const handleUpdateTask = async (taskData: any) => {
    if (!editingTask) return false;
    const success = await updateTask(editingTask.id, taskData);
    if (!success) {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
    return success;
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const success = await deleteTask(taskId);
    if (!success) {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteProject = async () => {
    if (!confirm('Are you sure you want to mark this project as completed? This will distribute rewards to all team members.')) return;

    if (!projectId) return;

    const success = await completeProject(projectId);
    if (success) {
      navigate('/profile');
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

    try {
      // Delete project (this will cascade to members, tasks, and messages)
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Project Deleted",
        description: "The project has been deleted successfully.",
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    }
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

  if (error || !project) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4">Project Not Found</h1>
        <p className="text-white mb-8">{error || "The project you're looking for doesn't exist or you don't have access."}</p>
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

  // Calculate progress based on completed tasks
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
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
            {project.githubUrl && (
              <Link to={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Github size={16} />
                  GitHub
                  <ExternalLink size={14} />
                </Button>
              </Link>
            )}
            {isProjectLead && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleCompleteProject}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                  disabled={completingProject}
                >
                  <Check size={16} className="mr-1" />
                  {completingProject ? 'Completing...' : 'Complete Project'}
                </Button>
                <Button 
                  onClick={handleDeleteProject}
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 size={16} className="mr-1" />
                  Delete Project
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 flex items-center gap-3">
              <Calendar className="text-cyan-400 h-5 w-5" />
              <div>
                <p className="text-xs text-slate-400">Created</p>
                <p className="text-sm text-white">{new Date(project.createdAt || '').toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
          
          {project.endDate && (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="text-cyan-400 h-5 w-5" />
                <div>
                  <p className="text-xs text-slate-400">Target Completion</p>
                  <p className="text-sm text-white">{new Date(project.endDate).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="bg-slate-800 border-slate-700 col-span-1 md:col-span-2">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-slate-300">Overall Progress</span>
                <span className="text-sm font-medium text-white">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.categories.map((category: string, i: number) => (
            <Badge key={i} variant="outline" className="bg-slate-700 text-cyan-300 border-none">
              {category}
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
          <TabsTrigger value="discussion" className="data-[state=active]:bg-slate-700 rounded-t-md rounded-b-none px-4 py-3">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussion
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        <p className="text-white">Active</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-1">Progress</h4>
                        <p className="text-white">{progress}% Complete</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-1">Team Size</h4>
                        <p className="text-white">{members.length} Members</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-1">Difficulty</h4>
                        <p className="text-white">{project.difficulty}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-white">Recent Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(task.status)} w-3 h-3 p-0 rounded-full`} />
                          <span className="text-white">{task.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.assigned_role && (
                            <span className="text-sm text-slate-300">{task.assigned_role}</span>
                          )}
                          {task.due_date && (
                            <span className="text-xs text-slate-400">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-md">
                        <Avatar>
                          <AvatarImage src={member.user?.avatar_url || ''} alt={member.user?.username || ''} />
                          <AvatarFallback>
                            {(member.user?.full_name || member.user?.username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white">{member.user?.username || member.user?.full_name || 'Unknown'}</p>
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
              {isProjectLead && (
                <Button 
                  onClick={() => {
                    setEditingTask(null);
                    setIsTaskDialogOpen(true);
                  }}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks yet. {isProjectLead ? 'Create your first task!' : 'Tasks will appear here when the project lead adds them.'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center justify-between p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Badge className={`${getStatusColor(task.status)} w-3 h-3 p-0 rounded-full`} />
                        <div className="flex-1">
                          <p className="text-white font-medium">{task.title}</p>
                          {task.description && (
                            <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                            {task.assigned_role && (
                              <span>Role: {task.assigned_role}</span>
                            )}
                            {task.due_date && (
                              <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                            )}
                            <span className="capitalize">Status: {task.status}</span>
                          </div>
                        </div>
                      </div>
                      {isProjectLead && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingTask(task);
                              setIsTaskDialogOpen(true);
                            }}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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
                {members.map((member) => (
                  <Card key={member.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={member.user?.avatar_url || ''} alt={member.user?.username || ''} />
                          <AvatarFallback className="bg-cyan-600 text-white text-xl">
                            {(member.user?.full_name || member.user?.username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg font-medium text-white">{member.user?.username || member.user?.full_name || 'Unknown'}</h3>
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
        
        {/* Discussion Tab */}
        <TabsContent value="discussion" className="mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-xl text-white">Team Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-96">
                <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={message.user?.avatar_url || ''} alt={message.user?.username || ''} />
                          <AvatarFallback className="bg-cyan-600 text-white text-xs">
                            {(message.user?.username || message.user?.full_name || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-cyan-400">
                              {message.user?.username || message.user?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(message.created_at).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-white mt-1">{message.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleAddMessage} className="flex gap-2 mt-auto">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-grow bg-slate-700 border-slate-600 text-white resize-none"
                    rows={2}
                    disabled={sendingMessage}
                  />
                  <Button 
                    type="submit" 
                    disabled={sendingMessage || !newMessage.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700 self-end"
                  >
                    {sendingMessage ? 'Sending...' : 'Send'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Dialog */}
      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        members={members}
        availableRoles={availableRoles}
      />
    </div>
  );
};

export default ProjectWorkspace;
