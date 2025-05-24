import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Filter, Plus, Users, Calendar, Star, Github, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectJoin } from '@/hooks/useProjectJoin';
import { toast } from '@/components/ui/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  categories: string[];
  rolesNeeded: string[];
  githubUrl: string | null;
  endDate: string | null;
  difficulty: string;
  xpReward: number;
  bitsReward: number;
  bytesReward: number;
  creatorId: string;
  createdAt: string | null;
  creator: {
    name: string;
    username: string;
    avatar: string;
  };
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-teal-500';
    case 'Intermediate': return 'bg-blue-500';
    case 'Advanced': return 'bg-indigo-600';
    case 'Expert': return 'bg-violet-700';
    default: return 'bg-teal-500';
  }
};

interface CreateProjectForm {
  title: string;
  description: string;
  categories: string[];
  rolesNeeded: string[];
  githubUrl: string;
  endDate: string;
  difficulty: string;
}

const FindProject = () => {
  const { user } = useAuth();
  const { joinProject, loading: joinLoading } = useProjectJoin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userJoinedProjects, setUserJoinedProjects] = useState<string[]>([]);

  const [createProjectForm, setCreateProjectForm] = useState<CreateProjectForm>({
    title: '',
    description: '',
    categories: [],
    rolesNeeded: [],
    githubUrl: '',
    endDate: '',
    difficulty: 'Beginner',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDifficultyChange = (value: string) => {
    setDifficultyFilter(value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (difficultyFilter && difficultyFilter !== 'all') {
      filtered = filtered.filter(project => project.difficulty === difficultyFilter);
    }

    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.categories.includes(categoryFilter));
    }

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    filterProjects();
  }, [searchTerm, difficultyFilter, categoryFilter, projects]);

  useEffect(() => {
    fetchProjects();
    if (user) {
      fetchUserJoinedProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      // Fetch creator profiles separately
      const creatorIds = data?.map(project => project.creator_id) || [];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', creatorIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      const transformedProjects = data?.map(project => {
        const creatorProfile = profiles?.find(p => p.id === project.creator_id);
        return {
          id: project.id,
          title: project.title,
          description: project.description,
          categories: project.categories,
          rolesNeeded: project.roles_needed,
          githubUrl: project.github_url,
          endDate: project.end_date,
          difficulty: project.difficulty,
          xpReward: project.xp_reward,
          bitsReward: project.bits_reward,
          bytesReward: project.bytes_reward,
          creatorId: project.creator_id,
          createdAt: project.created_at,
          creator: {
            name: creatorProfile?.full_name || 'Unknown User',
            username: creatorProfile?.username || 'unknown',
            avatar: creatorProfile?.avatar_url || '/placeholder.svg'
          }
        };
      }) || [];

      setProjects(transformedProjects);
      setFilteredProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserJoinedProjects = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select('project_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user projects:', error);
        return;
      }

      const joinedProjectIds = data?.map(item => item.project_id) || [];
      setUserJoinedProjects(joinedProjectIds);
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const handleJoinProject = async (projectId: string) => {
    const success = await joinProject(projectId);
    if (success) {
      // Refresh the user's joined projects list
      fetchUserJoinedProjects();
      setSelectedProject(null);
    }
  };

  const handleCreateProject = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a project.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { title, description, categories, rolesNeeded, githubUrl, endDate, difficulty } = createProjectForm;

      // Validate the form data
      if (!title || !description || categories.length === 0 || rolesNeeded.length === 0 || !difficulty) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      console.log('Creating project...');

      // Insert the new project into the database
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            title,
            description,
            categories,
            roles_needed: rolesNeeded,
            github_url: githubUrl,
            end_date: endDate,
            difficulty,
            creator_id: user.id,
            xp_reward: 100,
            bits_reward: 50,
            bytes_reward: 10,
          },
        ])
        .select()
        .single();

      if (projectError) {
        console.error('Error creating project:', projectError);
        toast({
          title: "Error",
          description: "Failed to create project. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Project created:', projectData);

      // Automatically add the creator as a project member
      const { error: memberError } = await supabase
        .from('project_members')
        .insert({
          project_id: projectData.id,
          user_id: user.id,
          role: 'Project Lead'
        });

      if (memberError) {
        console.error('Error adding creator as member:', memberError);
        // Don't fail the entire operation, just log the error
        toast({
          title: "Warning",
          description: "Project created but failed to add you as a member. You can join manually.",
          variant: "default",
        });
      } else {
        console.log('Creator added as project member');
      }

      // Reset form and close dialog
      setCreateProjectForm({
        title: '',
        description: '',
        categories: [],
        rolesNeeded: [],
        githubUrl: '',
        endDate: '',
        difficulty: 'Beginner',
      });
      setIsCreateDialogOpen(false);

      // Refresh both projects list and user's joined projects
      await Promise.all([
        fetchProjects(),
        fetchUserJoinedProjects()
      ]);

      toast({
        title: "Project created!",
        description: "Your project has been created successfully and you've been added as a member.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isUserMember = (projectId: string) => {
    return userJoinedProjects.includes(projectId);
  };

  const isProjectCreator = (project: Project) => {
    return user && project.creatorId === user.id;
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Find Projects</h1>
          <p className="text-lg text-slate-300 font-light">Explore exciting projects and join a team</p>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search projects..."
              className="bg-slate-700 border-slate-600 text-slate-200 w-full"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <Search className="h-5 w-5 text-slate-400 -ml-8" />
          </div>

          <div className="flex items-center space-x-4">
            <Select onValueChange={handleDifficultyChange}>
              <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-slate-200">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-slate-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                <SelectItem value="AI/ML">AI/ML</SelectItem>
                <SelectItem value="Blockchain">Blockchain</SelectItem>
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-cyan-500 text-cyan-400">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 text-white border-slate-700">
                <DialogHeader>
                  <DialogTitle>Filter Projects</DialogTitle>
                  <DialogDescription>
                    Apply advanced filters to find the perfect project.
                  </DialogDescription>
                </DialogHeader>
                {/* Add more filter options here */}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Create Project Button */}
        <div className="text-right">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create a New Project</DialogTitle>
                <DialogDescription>
                  Share your project idea with the community.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={createProjectForm.title}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, title: e.target.value })}
                    className="col-span-3 bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={createProjectForm.description}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, description: e.target.value })}
                    className="col-span-3 bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categories" className="text-right">
                    Categories
                  </Label>
                  <Input
                    id="categories"
                    value={createProjectForm.categories.join(', ')}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, categories: e.target.value.split(',').map(s => s.trim()) })}
                    className="col-span-3 bg-slate-700 border-slate-600 text-slate-200"
                    placeholder="e.g., Web Development, AI/ML"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rolesNeeded" className="text-right">
                    Roles Needed
                  </Label>
                  <Input
                    id="rolesNeeded"
                    value={createProjectForm.rolesNeeded.join(', ')}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, rolesNeeded: e.target.value.split(',').map(s => s.trim()) })}
                    className="col-span-3 bg-slate-700 border-slate-600 text-slate-200"
                    placeholder="e.g., Frontend Developer, Backend Developer"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="githubUrl" className="text-right">
                    GitHub URL
                  </Label>
                  <Input
                    id="githubUrl"
                    value={createProjectForm.githubUrl}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, githubUrl: e.target.value })}
                    className="col-span-3 bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={createProjectForm.endDate}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, endDate: e.target.value })}
                    className="col-span-3 bg-slate-700 border-slate-600 text-slate-200"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="difficulty" className="text-right">
                    Difficulty
                  </Label>
                  <Select onValueChange={(value) => setCreateProjectForm({ ...createProjectForm, difficulty: value })}>
                    <SelectTrigger className="col-span-3 bg-slate-700 border-slate-600 text-slate-200">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" onClick={handleCreateProject} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-slate-400 py-8">
              <Search className="w-12 h-12 mx-auto mb-4 animate-spin" />
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-8">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No projects found</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.id} className="bg-slate-800 border-slate-700 hover:shadow-lg hover:shadow-cyan-900/20 transition-all cursor-pointer group">
                <CardHeader className="pb-4" onClick={() => setSelectedProject(project)}>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {project.title}
                    </CardTitle>
                    <Badge className={`${getDifficultyColor(project.difficulty)} text-white text-xs flex-shrink-0 ml-2`}>
                      {project.difficulty}
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                    {project.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-1">
                      {project.categories.slice(0, 3).map((category) => (
                        <Badge key={category} variant="outline" className="text-xs text-slate-300 border-slate-600">
                          {category}
                        </Badge>
                      ))}
                      {project.categories.length > 3 && (
                        <Badge variant="outline" className="text-xs text-slate-400 border-slate-600">
                          +{project.categories.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Creator Info */}
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={project.creator.avatar} />
                        <AvatarFallback className="bg-cyan-600 text-white text-xs">
                          {project.creator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-400">by @{project.creator.username}</span>
                    </div>

                    {/* Rewards */}
                    <div className="flex justify-between items-center text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-cyan-400" />
                        <span className="text-cyan-400">{project.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.createdAt!).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Join Button - Now based purely on membership status */}
                    <div className="pt-2">
                      {isUserMember(project.id) ? (
                        <Button disabled className="w-full bg-green-600 text-white">
                          <Users className="mr-2 h-4 w-4" />
                          Already Joined
                        </Button>
                      ) : (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinProject(project.id);
                          }}
                          disabled={joinLoading}
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          {joinLoading ? 'Joining...' : 'Join Project'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
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
                    <p className="text-slate-300 font-semibold mb-1">Creator</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedProject.creator.avatar} />
                        <AvatarFallback className="bg-cyan-600 text-white text-xs">
                          {selectedProject.creator.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-cyan-300">@{selectedProject.creator.username}</span>
                    </div>
                  </div>
                  <div className="bg-slate-700 p-4 rounded-lg">
                    <p className="text-slate-300 font-semibold mb-1">Created Date</p>
                    <p className="text-white">{new Date(selectedProject.createdAt!).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.categories.map((category: string) => (
                      <Badge key={category} className="bg-slate-700 text-cyan-300">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Roles Needed */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Roles Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.rolesNeeded.map((role: string) => (
                      <Badge key={role} className="bg-slate-700 text-cyan-300">
                        {role}
                      </Badge>
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
                
                {/* Project Actions - Now based purely on membership status */}
                <div className="flex justify-end gap-3 mt-4">
                  {isUserMember(selectedProject.id) ? (
                    <Button disabled className="bg-green-600 text-white">
                      Already Joined
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleJoinProject(selectedProject.id)}
                      disabled={joinLoading}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    >
                      {joinLoading ? 'Joining...' : 'Join Project'}
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

export default FindProject;
