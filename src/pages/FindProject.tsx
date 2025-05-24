
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Search, 
  Filter, 
  Star, 
  Code, 
  Calendar, 
  Users, 
  Clock,
  CheckCircle,
  UserCheck,
  Plus,
  Bitcoin,
  DollarSign,
  X
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const createProjectSchema = z.object({
  title: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  roles: z.string().min(3, "Please specify required roles"),
  categories: z.string().min(3, "Please specify required technologies/categories"),
  githubRepo: z.string().url("Must be a valid URL"),
  endDate: z.string().refine(date => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate > today;
  }, "End date must be in the future"),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert'])
});

const FindProject = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>("any");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("any");
  const [skillFilter, setSkillFilter] = useState<string>("any");
  const [selectedRoles, setSelectedRoles] = useState<{[key: string]: string}>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryInputs, setCategoryInputs] = useState<string[]>(['']);
  
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      roles: "",
      categories: "",
      githubRepo: "",
      endDate: "",
      difficulty: "Beginner"
    }
  });

  // Fetch projects from database
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const onSubmit = async (data: z.infer<typeof createProjectSchema>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to create a project");
        return;
      }

      const rolesArray = data.roles.split(',').map(role => role.trim());
      const categoriesArray = data.categories.split(',').map(cat => cat.trim());

      const { error } = await supabase
        .from('projects')
        .insert({
          title: data.title,
          description: data.description,
          roles_needed: rolesArray,
          categories: categoriesArray,
          github_url: data.githubRepo,
          end_date: data.endDate,
          difficulty: data.difficulty,
          creator_id: user.id
        });

      if (error) throw error;

      toast.success("Project created successfully!", {
        description: `${data.title} has been created and is now visible to everyone.`
      });
      
      setIsDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error("Failed to create project. Please try again.");
    }
  };
  
  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-teal-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Advanced': return 'bg-indigo-600';
      case 'Expert': return 'bg-violet-700';
      default: return 'bg-teal-500';
    }
  };
  
  // Filter projects based on search query and filters
  const filteredProjects = projects.filter((project: any) => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "any" || 
      project.roles_needed.some((role: string) => role.toLowerCase().includes(roleFilter.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === "any" || 
      project.difficulty === difficultyFilter;
    
    const matchesSkill = skillFilter === "any" || 
      project.categories.some((skill: string) => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    
    return matchesSearch && matchesRole && matchesDifficulty && matchesSkill;
  });

  const allSkills = Array.from(
    new Set(projects.flatMap((project: any) => project.categories))
  ).sort();

  const allRoles = Array.from(
    new Set(projects.flatMap((project: any) => project.roles_needed))
  ).sort();

  const handleRoleSelect = (projectId: string, role: string) => {
    setSelectedRoles({
      ...selectedRoles,
      [projectId]: role
    });
  };

  const getAvailableRoles = (project: any) => {
    return project.roles_needed || [];
  };

  const addCategoryInput = () => {
    setCategoryInputs([...categoryInputs, '']);
  };

  const removeCategoryInput = (index: number) => {
    if (categoryInputs.length > 1) {
      const newInputs = categoryInputs.filter((_, i) => i !== index);
      setCategoryInputs(newInputs);
    }
  };

  const updateCategoryInput = (index: number, value: string) => {
    const newInputs = [...categoryInputs];
    newInputs[index] = value;
    setCategoryInputs(newInputs);
    
    // Update form field
    const categoriesString = newInputs.filter(cat => cat.trim()).join(', ');
    form.setValue('categories', categoriesString);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-slate-300">Loading projects...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Create Project Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Explore Projects</h1>
            <p className="text-lg text-slate-300 font-light">
              Join exciting projects, gain experience, and earn XP
            </p>
          </div>
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 mt-4 md:mt-0 text-lg shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 border-0"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Project
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-slate-800 border-slate-700 shadow-lg">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              {/* Search Bar */}
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400"
                />
              </div>
              
              {/* Filter Section */}
              <div className="flex gap-2 flex-wrap lg:flex-nowrap">
                <Select onValueChange={setRoleFilter} value={roleFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200 w-[140px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectItem value="any">Any Role</SelectItem>
                    {allRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select onValueChange={setDifficultyFilter} value={difficultyFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200 w-[140px]">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectItem value="any">Any Difficulty</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select onValueChange={setSkillFilter} value={skillFilter}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200 w-[140px]">
                    <SelectValue placeholder="Skill" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                    <SelectItem value="any">Any Skill</SelectItem>
                    {allSkills.map(skill => (
                      <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'} Found
            </h2>
            <div className="flex items-center text-slate-300 text-sm">
              <Filter className="mr-2 h-4 w-4" />
              Sorted by newest
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project: any) => (
                <Card key={project.id} className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 flex flex-col h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{project.title}</h3>
                        <div className="text-xs text-slate-400">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            Posted {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Badge className={`${getDifficultyColor(project.difficulty)} text-white shadow-glow`}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">{project.description}</p>
                    
                    {/* Categories */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {project.categories.slice(0, 3).map((category: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs text-slate-300 border-slate-600">
                            {category}
                          </Badge>
                        ))}
                        {project.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
                            +{project.categories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Project Roles */}
                    <div className="space-y-2 mb-3 flex-grow">
                      <h4 className="text-sm font-medium text-slate-300 mb-1">Team Roles</h4>
                      <ul className="space-y-1">
                        {project.roles_needed.map((role: string, idx: number) => (
                          <li key={idx} className="flex items-center justify-between text-xs text-slate-300">
                            <span className="flex items-center">
                              <CheckCircle className="mr-1 h-3 w-3 text-cyan-400" />
                              {role}
                            </span>
                            <span className="text-cyan-400 text-xs">
                              Available
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Rewards section */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center text-slate-300">
                        <Clock className="mr-1 h-3 w-3" />
                        {project.end_date ? `Due ${new Date(project.end_date).toLocaleDateString()}` : 'No deadline'}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center font-medium text-cyan-400">
                          <Star className="mr-1 h-3 w-3" />
                          +{project.xp_reward} XP
                        </div>
                        <div className="flex items-center font-medium text-yellow-400">
                          <Bitcoin className="mr-1 h-3 w-3" />
                          +{project.bits_reward} bits
                        </div>
                        <div className="flex items-center font-medium text-purple-400">
                          <DollarSign className="mr-1 h-3 w-3" />
                          +{project.bytes_reward} bytes
                        </div>
                      </div>
                    </div>
                    
                    {/* Role Selection and Join Button */}
                    <div className="flex items-center gap-2 mt-auto">
                      <Select 
                        value={selectedRoles[project.id] || ""} 
                        onValueChange={(value) => handleRoleSelect(project.id, value)}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200 flex-grow">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                          {getAvailableRoles(project).map((role: string) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                        disabled={!selectedRoles[project.id]}
                      >
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-800 border-slate-700 p-6 text-center">
              <p className="text-slate-300">No projects match your search criteria.</p>
              <p className="text-slate-400 mt-2">Try adjusting your filters or search term.</p>
            </Card>
          )}
        </div>
      </div>

      {/* Create Project Dialog - More Compact */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-cyan-400">Create New Project</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 text-sm">Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Smart AI Assistant" className="bg-slate-700 border-slate-600 h-8" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 text-sm">Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-slate-700 border-slate-600 h-8">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200 text-sm">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="An AI assistant that helps users with daily tasks..." 
                        className="bg-slate-700 border-slate-600 min-h-16 text-sm" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 text-sm">Required Roles</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Frontend Developer, Backend Engineer..." 
                          className="bg-slate-700 border-slate-600 min-h-16 text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 text-sm">Technologies/Categories</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="React, Node.js, TypeScript, MongoDB..." 
                          className="bg-slate-700 border-slate-600 min-h-16 text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="githubRepo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 text-sm">GitHub Repository</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://github.com/username/repo" 
                          className="bg-slate-700 border-slate-600 h-8 text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-200 text-sm">Goal End Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          className="bg-slate-700 border-slate-600 h-8 text-sm"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="sm:justify-between gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8"
                  onClick={() => {
                    setIsDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 h-8"
                >
                  Create Project
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FindProject;
