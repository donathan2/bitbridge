import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useProjectJoin } from '@/hooks/useProjectJoin';
import { toast } from '@/components/ui/use-toast';
import ProjectCard from '@/components/ProjectCard';
import ProjectDetailsDialog from '@/components/ProjectDetailsDialog';
import MultiSelectFilter from '@/components/MultiSelectFilter';

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

interface CreateProjectForm {
  title: string;
  description: string;
  techStack: string[];
  track: string[];
  rolesNeeded: string[];
  githubUrl: string;
  endDate: string;
  difficulty: string;
  customTechStack: string;
  customTrack: string;
  customRole: string;
}

const TECH_STACK_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Java', 'JavaScript', 'TypeScript',
  'PHP', 'Ruby', 'Go', 'Rust', 'C++', 'C#', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'AWS', 'Docker', 'Kubernetes'
];

const TRACK_OPTIONS = [
  'Web Development', 'Mobile Development', 'AI/ML', 'Blockchain', 'DevOps', 'Game Development',
  'Data Science', 'Cybersecurity', 'Cloud Computing', 'IoT', 'AR/VR', 'Desktop Applications'
];

const ROLE_OPTIONS = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer',
  'Product Manager', 'DevOps Engineer', 'Data Scientist', 'QA Engineer', 'Mobile Developer',
  'AI/ML Engineer', 'Blockchain Developer', 'Technical Writer', 'Marketing Specialist'
];

const FindProject = () => {
  const { user } = useAuth();
  const { joinProject, loading: joinLoading } = useProjectJoin();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userJoinedProjects, setUserJoinedProjects] = useState<string[]>([]);

  const [createProjectForm, setCreateProjectForm] = useState<CreateProjectForm>({
    title: '',
    description: '',
    techStack: [],
    track: [],
    rolesNeeded: [],
    githubUrl: '',
    endDate: '',
    difficulty: 'Beginner',
    customTechStack: '',
    customTrack: '',
    customRole: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchTerm(e.target.value);
  };

  const filterProjects = () => {
    let filtered = [...projects];

    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter(project => selectedDifficulties.includes(project.difficulty));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(project => 
        project.categories.some(category => selectedCategories.includes(category))
      );
    }

    setFilteredProjects(filtered);
  };

  useEffect(() => {
    filterProjects();
  }, [searchTerm, selectedDifficulties, selectedCategories, projects]);

  useEffect(() => {
    fetchProjects();
    if (user) {
      fetchUserJoinedProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log('Fetching projects from database...');
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active') // Only fetch active projects
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setFilteredProjects([]);
        return;
      }

      console.log('Raw projects data:', data);

      if (!data || data.length === 0) {
        console.log('No projects found in database');
        setProjects([]);
        setFilteredProjects([]);
        return;
      }

      // Fetch creator profiles separately
      const creatorIds = data.map(project => project.creator_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url, profile_picture_url')
        .in('id', creatorIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      const transformedProjects = data.map(project => {
        const creatorProfile = profiles?.find(p => p.id === project.creator_id);
        return {
          id: project.id,
          title: project.title,
          description: project.description,
          categories: project.categories || [],
          rolesNeeded: project.roles_needed || [],
          githubUrl: project.github_url,
          endDate: project.end_date,
          difficulty: project.difficulty,
          xpReward: project.xp_reward || 0,
          bitsReward: project.bits_reward || 0,
          bytesReward: project.bytes_reward || 0,
          creatorId: project.creator_id,
          createdAt: project.created_at,
          creator: {
            name: creatorProfile?.full_name || 'Unknown User',
            username: creatorProfile?.username || 'unknown',
            avatar: creatorProfile?.profile_picture_url || creatorProfile?.avatar_url || '/placeholder.svg'
          }
        };
      });

      console.log('Transformed projects:', transformedProjects);
      setProjects(transformedProjects);
      setFilteredProjects(transformedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserJoinedProjects = async () => {
    if (!user) return;
    
    try {
      console.log('🔍 Fetching user joined projects for:', user.id);
      const { data, error } = await supabase
        .from('project_members')
        .select('project_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('❌ Error fetching user projects:', error);
        return;
      }

      const joinedProjectIds = data?.map(item => item.project_id) || [];
      console.log('📋 User joined projects:', joinedProjectIds);
      setUserJoinedProjects(joinedProjectIds);
    } catch (error) {
      console.error('💥 Error fetching user projects:', error);
    }
  };

  const handleJoinProject = async (projectId: string, role: string) => {
    console.log('🎯 HandleJoinProject called:', { projectId, role });
    
    const success = await joinProject(projectId, role);
    console.log('📝 Join result:', { success });
    
    if (success) {
      console.log('✅ Join successful, refreshing data...');
      
      // Immediately update the local state to show the user has joined
      setUserJoinedProjects(prev => [...prev, projectId]);
      
      // Close any open dialogs
      setSelectedProject(null);
      
      // Refresh data in the background
      await Promise.all([
        fetchUserJoinedProjects(),
        fetchProjects()
      ]);
      
      console.log('🔄 Data refresh completed');
    } else {
      console.log('❌ Join failed');
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
      const { title, description, techStack, track, rolesNeeded, githubUrl, endDate, difficulty, customTechStack, customTrack, customRole } = createProjectForm;

      // Combine selected options with custom entries
      const finalTechStack = [...techStack];
      if (customTechStack.trim()) {
        finalTechStack.push(customTechStack.trim());
      }

      const finalTrack = [...track];
      if (customTrack.trim()) {
        finalTrack.push(customTrack.trim());
      }

      const finalRoles = [...rolesNeeded];
      if (customRole.trim()) {
        finalRoles.push(customRole.trim());
      }

      // Combine tech stack and track for categories
      const finalCategories = [...finalTechStack, ...finalTrack];

      // Validate the form data
      if (!title || !description || finalCategories.length === 0 || finalRoles.length === 0 || !difficulty) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      console.log('Creating project with data:', { title, description, categories: finalCategories, roles: finalRoles });

      // Insert the new project into the database with active status
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert([
          {
            title,
            description,
            categories: finalCategories,
            roles_needed: finalRoles,
            github_url: githubUrl || null,
            end_date: endDate || null,
            difficulty,
            creator_id: user.id,
            status: 'active'
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

      // Automatically add the creator as the Project Lead
      const { error: memberError } = await supabase
        .from('project_members')
        .insert({
          project_id: projectData.id,
          user_id: user.id,
          role: 'Project Lead'
        });

      if (memberError) {
        console.error('Error adding creator as Project Lead:', memberError);
        toast({
          title: "Warning",
          description: "Project created but failed to add you as Project Lead. You can join manually.",
          variant: "default",
        });
      } else {
        console.log('Creator added as Project Lead');
      }

      // Reset form and close dialog
      setCreateProjectForm({
        title: '',
        description: '',
        techStack: [],
        track: [],
        rolesNeeded: [],
        githubUrl: '',
        endDate: '',
        difficulty: 'Beginner',
        customTechStack: '',
        customTrack: '',
        customRole: '',
      });
      setIsCreateDialogOpen(false);

      // Refresh both projects list and user's joined projects
      await Promise.all([
        fetchProjects(),
        fetchUserJoinedProjects()
      ]);

      toast({
        title: "Project created!",
        description: "Your project has been created successfully and you've been added as the Project Lead.",
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

  const handleCheckboxChange = (field: 'techStack' | 'track' | 'rolesNeeded', value: string, checked: boolean) => {
    setCreateProjectForm(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const isUserMember = (projectId: string) => {
    return userJoinedProjects.includes(projectId);
  };

  const isProjectCreator = (project: Project) => {
    return user && project.creatorId === user.id;
  };

  // Get unique categories from all projects for the filter
  const allCategories = [...new Set(projects.flatMap(project => project.categories))].sort();
  const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Find Projects</h1>
          <p className="text-lg text-slate-300 font-light">Explore exciting projects and join a team</p>
        </div>

        {/* Search and Filter Section */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg border-2 border-cyan-500/20">
          <CardContent className="p-6 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    className="pl-10 bg-slate-700 border-slate-600 text-slate-200 w-full shadow-inner"
                    value={searchTerm}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <MultiSelectFilter
                  options={difficultyOptions}
                  selectedValues={selectedDifficulties}
                  onSelectionChange={setSelectedDifficulties}
                  placeholder="Difficulty"
                  label="Select Difficulties"
                />

                <MultiSelectFilter
                  options={allCategories}
                  selectedValues={selectedCategories}
                  onSelectionChange={setSelectedCategories}
                  placeholder="Categories"
                  label="Select Categories"
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedDifficulties.length > 0 || selectedCategories.length > 0) && (
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-300 text-sm font-medium">Active filters:</span>
                  {selectedDifficulties.map((difficulty) => (
                    <span key={difficulty} className="bg-cyan-600 text-white px-2 py-1 rounded text-xs">
                      {difficulty}
                    </span>
                  ))}
                  {selectedCategories.map((category) => (
                    <span key={category} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Project Button */}
        <div className="text-right">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create a New Project</DialogTitle>
                <DialogDescription>
                  Share your project idea with the community.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={createProjectForm.title}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, title: e.target.value })}
                    className="col-span-3 bg-slate-700 border-slate-600 text-slate-200"
                    placeholder="Enter project title"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={createProjectForm.description}
                    onChange={(e) => setCreateProjectForm({ ...createProjectForm, description: e.target.value })}
                    className="col-span-3 bg-slate-700 border-slate-600 text-slate-200"
                    placeholder="Describe your project"
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Tech Stack *</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-900 rounded border border-slate-600">
                      {TECH_STACK_OPTIONS.map(tech => (
                        <div key={tech} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tech-${tech}`}
                            checked={createProjectForm.techStack.includes(tech)}
                            onCheckedChange={(checked) => handleCheckboxChange('techStack', tech, checked as boolean)}
                          />
                          <Label htmlFor={`tech-${tech}`} className="text-xs">{tech}</Label>
                        </div>
                      ))}
                    </div>
                    <Input
                      placeholder="Other (specify)"
                      value={createProjectForm.customTechStack}
                      onChange={(e) => setCreateProjectForm({ ...createProjectForm, customTechStack: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Track *</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-900 rounded border border-slate-600">
                      {TRACK_OPTIONS.map(track => (
                        <div key={track} className="flex items-center space-x-2">
                          <Checkbox
                            id={`track-${track}`}
                            checked={createProjectForm.track.includes(track)}
                            onCheckedChange={(checked) => handleCheckboxChange('track', track, checked as boolean)}
                          />
                          <Label htmlFor={`track-${track}`} className="text-xs">{track}</Label>
                        </div>
                      ))}
                    </div>
                    <Input
                      placeholder="Other (specify)"
                      value={createProjectForm.customTrack}
                      onChange={(e) => setCreateProjectForm({ ...createProjectForm, customTrack: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Roles Needed *</Label>
                  <div className="col-span-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-900 rounded border border-slate-600">
                      {ROLE_OPTIONS.map(role => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={`role-${role}`}
                            checked={createProjectForm.rolesNeeded.includes(role)}
                            onCheckedChange={(checked) => handleCheckboxChange('rolesNeeded', role, checked as boolean)}
                          />
                          <Label htmlFor={`role-${role}`} className="text-xs">{role}</Label>
                        </div>
                      ))}
                    </div>
                    <Input
                      placeholder="Other (specify)"
                      value={createProjectForm.customRole}
                      onChange={(e) => setCreateProjectForm({ ...createProjectForm, customRole: e.target.value })}
                      className="bg-slate-700 border-slate-600 text-slate-200"
                    />
                  </div>
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
                    placeholder="https://github.com/username/repo"
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
                    Difficulty *
                  </Label>
                  <Select 
                    value={createProjectForm.difficulty}
                    onValueChange={(value) => setCreateProjectForm({ ...createProjectForm, difficulty: value })}
                  >
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

              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  onClick={handleCreateProject} 
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                >
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
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-slate-500 mb-4">
                  {projects.length === 0 
                    ? "Be the first to create a project!" 
                    : "Try adjusting your search or filters."
                  }
                </p>
                {projects.length === 0 && (
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Project
                  </Button>
                )}
              </div>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isUserMember={isUserMember(project.id)}
                onJoinProject={handleJoinProject}
                onProjectClick={setSelectedProject}
                joinLoading={joinLoading}
              />
            ))
          )}
        </div>

        {/* Project Details Dialog */}
        <ProjectDetailsDialog
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          isUserMember={selectedProject ? isUserMember(selectedProject.id) : false}
          onJoinProject={handleJoinProject}
          joinLoading={joinLoading}
        />
      </div>
    </div>
  );
};

export default FindProject;
