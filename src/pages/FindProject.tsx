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
  DollarSign
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
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createProjectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().min(10, "Please provide a more detailed description"),
  roles: z.string().min(3, "Please specify required roles"),
  githubRepo: z.string().url("Must be a valid URL"),
  endDate: z.string().refine(date => {
    const selectedDate = new Date(date);
    const today = new Date();
    return selectedDate > today;
  }, "End date must be in the future")
});

const FindProject = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>("any");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("any");
  const [skillFilter, setSkillFilter] = useState<string>("any");
  const [selectedRoles, setSelectedRoles] = useState<{[key: number]: string}>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      roles: "",
      githubRepo: "",
      endDate: ""
    }
  });

  const onSubmit = (data: z.infer<typeof createProjectSchema>) => {
    // Here you would normally save this data to your backend
    console.log("Project data:", data);
    
    // Show success notification
    toast.success("Project created successfully!", {
      description: `${data.name} has been created.`
    });
    
    // Close the dialog and reset form
    setIsDialogOpen(false);
    form.reset();
  };
  
  // Mock project data with currency rewards
  const projects = [
    {
      id: 1,
      title: "E-commerce Mobile App",
      description: "Building a React Native e-commerce app with product listings, cart functionality, and payment processing",
      difficulty: "Advanced",
      xpReward: 1200,
      bitsReward: 850,
      bytesReward: 12,
      skills: ["React Native", "JavaScript", "Redux", "API Integration"],
      rolesNeeded: ["Frontend Developer", "UI/UX Designer", "Tester"],
      rolesFilled: {
        "Frontend Developer": {name: "alexcodes", avatar: "/placeholder.svg"}, 
        "UI/UX Designer": null, 
        "Tester": null
      },
      postedDate: "2024-05-18",
      estimatedCompletion: "4 weeks",
      ownerName: "Sarah Johnson",
      progress: 25
    },
    {
      id: 2,
      title: "Task Management API",
      description: "Backend API for a task management application with user authentication and task CRUD operations",
      difficulty: "Intermediate",
      xpReward: 850,
      bitsReward: 600,
      bytesReward: 8,
      skills: ["Node.js", "Express", "MongoDB", "Authentication"],
      rolesNeeded: ["Backend Developer", "Database Designer", "API Tester"],
      rolesFilled: {
        "Backend Developer": null, 
        "Database Designer": {name: "emily42", avatar: "/placeholder.svg"}, 
        "API Tester": null
      },
      postedDate: "2024-05-15",
      estimatedCompletion: "3 weeks",
      ownerName: "Michael Chang",
      progress: 40
    },
    {
      id: 3,
      title: "Video Streaming Platform",
      description: "Building a video streaming platform with user accounts, content recommendations, and playback controls",
      difficulty: "Expert",
      xpReward: 1500,
      bitsReward: 1200,
      bytesReward: 20,
      skills: ["React", "Node.js", "WebRTC", "AWS", "Redis"],
      rolesNeeded: ["Full-stack Developer", "DevOps Engineer", "QA Engineer"],
      rolesFilled: {
        "Full-stack Developer": {name: "devdavid", avatar: "/placeholder.svg"}, 
        "DevOps Engineer": null, 
        "QA Engineer": null
      },
      postedDate: "2024-05-20",
      estimatedCompletion: "8 weeks",
      ownerName: "Emily Wilson",
      progress: 10
    },
    {
      id: 4,
      title: "Personal Finance Tracker",
      description: "Web application to track personal expenses, income, and generate financial reports",
      difficulty: "Beginner",
      xpReward: 600,
      bitsReward: 400,
      bytesReward: 5,
      skills: ["HTML", "CSS", "JavaScript", "Chart.js"],
      rolesNeeded: ["Frontend Developer", "UI Designer", "Tester"],
      rolesFilled: {
        "Frontend Developer": null, 
        "UI Designer": null, 
        "Tester": {name: "miketester", avatar: "/placeholder.svg"}
      },
      postedDate: "2024-05-22",
      estimatedCompletion: "2 weeks",
      ownerName: "David Lee",
      progress: 15
    },
    {
      id: 5,
      title: "Weather Forecast Dashboard",
      description: "Dashboard displaying weather forecasts with interactive maps and data visualization",
      difficulty: "Intermediate",
      xpReward: 750,
      bitsReward: 550,
      bytesReward: 7,
      skills: ["React", "TypeScript", "API Integration", "D3.js"],
      rolesNeeded: ["Frontend Developer", "API Specialist", "UI Designer"],
      rolesFilled: {
        "Frontend Developer": null, 
        "API Specialist": null, 
        "UI Designer": null
      },
      postedDate: "2024-05-19",
      estimatedCompletion: "3 weeks",
      ownerName: "Julia Parker",
      progress: 30
    }
  ];

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
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "any" || 
      project.rolesNeeded.some(role => role.toLowerCase().includes(roleFilter.toLowerCase()));
    
    const matchesDifficulty = difficultyFilter === "any" || 
      project.difficulty === difficultyFilter;
    
    const matchesSkill = skillFilter === "any" || 
      project.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    
    return matchesSearch && matchesRole && matchesDifficulty && matchesSkill;
  });

  const allSkills = Array.from(
    new Set(projects.flatMap(project => project.skills))
  ).sort();

  const allRoles = Array.from(
    new Set(projects.flatMap(project => project.rolesNeeded))
  ).sort();

  const handleRoleSelect = (projectId: number, role: string) => {
    setSelectedRoles({
      ...selectedRoles,
      [projectId]: role
    });
  };

  const getAvailableRoles = (project: any) => {
    return project.rolesNeeded.filter((role: string) => !project.rolesFilled[role]);
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Create Project Button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 mb-2 font-sans">Find a Project</h1>
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
                  placeholder="Search projects or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400"
                />
              </div>
              
              {/* Filter Section - Now on the same line */}
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
              {filteredProjects.map(project => (
                <Card key={project.id} className="bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl hover:shadow-cyan-900/10 transition-all duration-300 flex flex-col h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white">{project.title}</h3>
                        <div className="text-xs text-slate-400">
                          <span className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            Posted {new Date(project.postedDate).toLocaleDateString()} by {project.ownerName}
                          </span>
                        </div>
                      </div>
                      <Badge className={`${getDifficultyColor(project.difficulty)} text-white shadow-glow`}>
                        {project.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-slate-300 text-sm mb-3 line-clamp-2">{project.description}</p>
                    
                    {/* Skills */}
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {project.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs text-slate-300 border-slate-600">
                            {skill}
                          </Badge>
                        ))}
                        {project.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs text-slate-300 border-slate-600">
                            +{project.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* Project Roles */}
                    <div className="space-y-2 mb-3 flex-grow">
                      <h4 className="text-sm font-medium text-slate-300 mb-1">Team Roles</h4>
                      <ul className="space-y-1">
                        {project.rolesNeeded.map((role, idx) => (
                          <li key={idx} className="flex items-center justify-between text-xs text-slate-300">
                            <span className="flex items-center">
                              {project.rolesFilled[role] ? 
                                <UserCheck className="mr-1 h-3 w-3 text-green-500" /> : 
                                <CheckCircle className="mr-1 h-3 w-3 text-cyan-400" />
                              }
                              {role}
                            </span>
                            {project.rolesFilled[role] ? (
                              <span className="flex items-center text-green-500 text-xs">
                                <Avatar className="h-4 w-4 mr-1">
                                  <AvatarImage src={project.rolesFilled[role].avatar} />
                                  <AvatarFallback className="text-[8px] bg-slate-600">
                                    {project.rolesFilled[role].name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                {project.rolesFilled[role].name}
                              </span>
                            ) : (
                              <span className="text-cyan-400 text-xs">
                                Available
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-xs font-medium text-slate-300">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-1.5 bg-slate-700" />
                    </div>
                    
                    {/* Updated rewards section with currency */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center text-slate-300">
                        <Clock className="mr-1 h-3 w-3" />
                        {project.estimatedCompletion}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center font-medium text-cyan-400">
                          <Star className="mr-1 h-3 w-3" />
                          +{project.xpReward} XP
                        </div>
                        <div className="flex items-center font-medium text-yellow-400">
                          <Bitcoin className="mr-1 h-3 w-3" />
                          +{project.bitsReward} bits
                        </div>
                        <div className="flex items-center font-medium text-purple-400">
                          <DollarSign className="mr-1 h-3 w-3" />
                          +{project.bytesReward} bytes
                        </div>
                      </div>
                    </div>
                    
                    {/* Role Selection and Join Button */}
                    <div className="flex items-center gap-2 mt-auto">
                      {getAvailableRoles(project).length > 0 ? (
                        <>
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
                        </>
                      ) : (
                        <Button className="w-full bg-slate-700 text-slate-300" disabled>
                          No Roles Available
                        </Button>
                      )}
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

      {/* Create Project Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-400">Create New Project</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Smart AI Assistant" className="bg-slate-700 border-slate-600" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="An AI assistant that helps users with daily tasks..." 
                        className="bg-slate-700 border-slate-600 min-h-24" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Required Roles</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Frontend Developer, Backend Engineer, UI/UX Designer..." 
                        className="bg-slate-700 border-slate-600"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-slate-400 text-xs">
                      List the roles needed for this project, separated by commas
                    </FormDescription>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="githubRepo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">GitHub Repository</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://github.com/username/repo" 
                        className="bg-slate-700 border-slate-600"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-200">Goal End Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-slate-700 border-slate-600"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="sm:justify-between gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => {
                    setIsDialogOpen(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
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
